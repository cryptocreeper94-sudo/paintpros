import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { storage } from "./storage";
import * as solana from "./solana";
import * as hallmarkService from "./hallmarkService";

const app = express();
const httpServer = createServer(app);

// Track if we've already processed auto-deploy for this instance
let autoDeployProcessed = false;

// Registered tenants for auto-deploy versioning
// NPP is MANUAL versioning only - bump when user requests
// Demo (PAINTPROS) is AUTO versioning on every publish
const DEPLOY_TENANTS = [
  { id: 'demo', name: 'PaintPros.io Platform' },
  // NPP removed - manual versioning only per user request
];

/**
 * Automatic Version Bump & Solana Stamp on Production Deployment
 * This runs once when the server starts in production mode
 * Bumps versions for ALL registered tenants independently
 */
async function autoDeployVersionBump(): Promise<void> {
  if (autoDeployProcessed) {
    console.log("[auto-deploy] Already processed this deployment");
    return;
  }
  
  const deploymentId = process.env.REPLIT_DEPLOYMENT_ID;
  const isProduction = process.env.NODE_ENV === "production";
  
  if (!isProduction) {
    console.log("[auto-deploy] Skipping - not in production mode");
    return;
  }
  
  console.log("[auto-deploy] Production detected, starting automatic version bump for all tenants...");
  
  const privateKey = process.env.PHANTOM_SECRET_KEY || process.env.SOLANA_PRIVATE_KEY;
  const wallet = privateKey ? solana.getWalletFromPrivateKey(privateKey) : null;
  const network: 'devnet' | 'mainnet-beta' = 'mainnet-beta';
  
  // Process each tenant independently
  for (const tenant of DEPLOY_TENANTS) {
    try {
      console.log(`[auto-deploy][${tenant.id}] Processing ${tenant.name}...`);
      
      // Get tenant-specific latest release
      const latestRelease = await storage.getLatestRelease(tenant.id);
      
      // Check if this deployment ID was already processed for this tenant
      if (deploymentId && latestRelease?.deploymentId === deploymentId) {
        console.log(`[auto-deploy][${tenant.id}] Deployment already processed, skipping`);
        continue;
      }
      
      // Calculate new version for this tenant
      let currentVersion = latestRelease?.version || "1.0.0";
      let buildNumber = (latestRelease?.buildNumber || 0) + 1;
      
      const [major, minor, patch] = currentVersion.split('.').map(Number);
      const newVersion = `${major}.${minor}.${patch + 1}`;
      
      console.log(`[auto-deploy][${tenant.id}] Bumping: ${currentVersion} -> ${newVersion} (Build ${buildNumber})`);
      
      // Create tenant-specific content hash
      const contentHash = solana.hashData(`${tenant.id}-${newVersion}-${buildNumber}-${Date.now()}-${deploymentId || 'manual'}`);
      
      // Create hallmark for this tenant's release
      const hallmarkData = hallmarkService.createHallmarkData(
        'release',
        tenant.name,
        'system',
        'system',
        `v${newVersion} build ${buildNumber}`,
        { 
          version: newVersion, 
          buildNumber, 
          bumpType: 'patch',
          tenantId: tenant.id,
          deploymentId: deploymentId || 'manual',
          autoDeployed: true,
          timestamp: new Date().toISOString()
        },
        undefined,
        undefined,
        tenant.id // Use tenant ID for proper prefix (NPP-, PP-, ORBIT-)
      );
      
      const savedHallmark = await storage.createHallmark(hallmarkData);
      console.log(`[auto-deploy][${tenant.id}] Created hallmark: ${savedHallmark.hallmarkNumber}`);
      
      // Create tenant-specific release record
      const release = await storage.createRelease({
        tenantId: tenant.id,
        version: newVersion,
        buildNumber,
        hallmarkId: savedHallmark.id,
        contentHash,
        deploymentId: deploymentId || `manual-${Date.now()}`,
        releaseNotes: `Automatic deployment ${new Date().toISOString()}`,
      });
      console.log(`[auto-deploy][${tenant.id}] Created release: v${newVersion}`);
      
      // Attempt Solana blockchain stamp for this tenant
      if (wallet) {
        try {
          console.log(`[auto-deploy][${tenant.id}] Stamping to Solana...`);
          
          const result = await solana.stampHashToBlockchain(
            contentHash,
            wallet,
            network,
            { entityType: 'release', entityId: release.id },
            tenant.id // Pass tenant ID for memo prefix
          );
          
          await storage.updateReleaseSolanaStatus(release.id, result.signature, "confirmed");
          
          const explorerUrl = `https://explorer.solana.com/tx/${result.signature}`;
          await storage.updateHallmarkBlockchain(savedHallmark.id, result.signature, explorerUrl);
          
          console.log(`[auto-deploy][${tenant.id}] SUCCESS! TX: ${result.signature}`);
        } catch (stampError) {
          console.error(`[auto-deploy][${tenant.id}] Solana stamp failed:`, stampError);
        }
      } else {
        console.log(`[auto-deploy][${tenant.id}] No wallet - version bumped without blockchain stamp`);
      }
      
      console.log(`[auto-deploy][${tenant.id}] COMPLETE: v${newVersion} (Build ${buildNumber})`);
      
    } catch (error) {
      console.error(`[auto-deploy][${tenant.id}] Error:`, error);
      // Continue with other tenants even if one fails
    }
  }
  
  autoDeployProcessed = true;
  console.log("[auto-deploy] All tenants processed successfully");
}

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    async () => {
      log(`serving on port ${port}`);
      
      // Run automatic version bump on production deployment
      // This happens after server is ready to ensure database connection is established
      await autoDeployVersionBump();
    },
  );
})();
