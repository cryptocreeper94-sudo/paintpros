import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

// Track auth initialization status
let authInitialized = false;
let authInitError: Error | null = null;

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

// Lazy OIDC config getter with retry logic
async function getOidcConfigWithRetry(maxRetries = 3): Promise<client.Configuration> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await getOidcConfig();
    } catch (error) {
      console.error(`[Auth] OIDC discovery attempt ${attempt}/${maxRetries} failed:`, error);
      if (attempt === maxRetries) throw error;
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  throw new Error("OIDC discovery failed after all retries");
}

export function getSession() {
  const sessionTtl = 30 * 24 * 60 * 60 * 1000; // 30 days
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

// Cached OIDC config - initialized lazily
let cachedOidcConfig: client.Configuration | null = null;

// Get OIDC config lazily (only when needed for auth routes)
async function ensureOidcConfig(): Promise<client.Configuration> {
  if (cachedOidcConfig) return cachedOidcConfig;
  cachedOidcConfig = await getOidcConfigWithRetry();
  authInitialized = true;
  return cachedOidcConfig;
}

export function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  const registeredStrategies = new Set<string>();

  const ensureStrategy = async (domain: string) => {
    const config = await ensureOidcConfig();
    const strategyName = `replitauth:${domain}`;
    if (!registeredStrategies.has(strategyName)) {
      const strategy = new Strategy(
        {
          name: strategyName,
          config,
          scope: "openid email profile offline_access",
          callbackURL: `https://${domain}/api/callback`,
        },
        verify,
      );
      passport.use(strategy);
      registeredStrategies.add(strategyName);
    }
    return strategyName;
  };

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", async (req, res, next) => {
    try {
      const strategyName = await ensureStrategy(req.hostname);
      passport.authenticate(strategyName, {
        prompt: "login consent",
        scope: ["openid", "email", "profile", "offline_access"],
      })(req, res, next);
    } catch (error) {
      console.error("[Auth] Login failed - OIDC unavailable:", error);
      res.status(503).json({ message: "Authentication service temporarily unavailable" });
    }
  });

  app.get("/api/callback", async (req, res, next) => {
    try {
      const strategyName = await ensureStrategy(req.hostname);
      passport.authenticate(strategyName, {
        successReturnToOrRedirect: "/",
        failureRedirect: "/api/login",
      })(req, res, next);
    } catch (error) {
      console.error("[Auth] Callback failed - OIDC unavailable:", error);
      res.status(503).json({ message: "Authentication service temporarily unavailable" });
    }
  });

  app.get("/api/logout", async (req, res) => {
    try {
      const config = await ensureOidcConfig();
      req.logout(() => {
        res.redirect(
          client.buildEndSessionUrl(config, {
            client_id: process.env.REPL_ID!,
            post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
          }).href
        );
      });
    } catch (error) {
      console.error("[Auth] Logout failed - OIDC unavailable:", error);
      // Still log out locally even if OIDC is unavailable
      req.logout(() => {
        res.redirect("/");
      });
    }
  });
  
  console.log("[Auth] Auth routes registered (OIDC discovery deferred)");
}

// Initialize OIDC in background after server starts
export async function initAuthBackground(): Promise<void> {
  try {
    console.log("[Auth] Starting background OIDC discovery...");
    await ensureOidcConfig();
    console.log("[Auth] OIDC discovery completed successfully");
  } catch (error) {
    authInitError = error as Error;
    console.error("[Auth] Background OIDC discovery failed:", error);
    // Don't throw - server should keep running
  }
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await ensureOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    console.error("[Auth] Token refresh failed:", error);
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
