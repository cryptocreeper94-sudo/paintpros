import { Express, RequestHandler } from "express";
import session from "express-session";
import bcrypt from "bcryptjs";
import { z } from "zod";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

const pgStore = connectPg(session);

export function getCustomSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
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
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
      sameSite: "lax",
    },
  });
}

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function setupCustomAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getCustomSession());

  app.post("/api/auth/register", async (req, res) => {
    try {
      const validated = registerSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(validated.email);
      if (existingUser) {
        res.status(400).json({ error: "An account with this email already exists" });
        return;
      }

      const passwordHash = await bcrypt.hash(validated.password, 12);
      
      const user = await storage.createUser({
        email: validated.email,
        passwordHash,
        firstName: validated.firstName,
        lastName: validated.lastName,
        phone: validated.phone || null,
        authProvider: "email",
        emailVerified: false,
      });

      (req.session as any).userId = user.id;
      (req.session as any).user = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
        tenantId: user.tenantId,
      };

      res.status(201).json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
        return;
      }
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed. Please try again." });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validated = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(validated.email);
      if (!user) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      if (!user.passwordHash) {
        res.status(401).json({ error: "Please use a different login method for this account" });
        return;
      }

      const isValid = await bcrypt.compare(validated.password, user.passwordHash);
      if (!isValid) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      (req.session as any).userId = user.id;
      (req.session as any).user = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
        tenantId: user.tenantId,
      };

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
        return;
      }
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed. Please try again." });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        res.status(500).json({ error: "Logout failed" });
        return;
      }
      res.clearCookie("connect.sid");
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    res.json(sessionUser);
  });

  app.get("/api/auth/user", (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) {
      res.json(null);
      return;
    }
    res.json(sessionUser);
  });
}

export const isCustomAuthenticated: RequestHandler = (req, res, next) => {
  const sessionUser = (req.session as any).user;
  if (!sessionUser) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  (req as any).user = sessionUser;
  next();
};
