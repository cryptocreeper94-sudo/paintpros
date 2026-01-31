import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Serve attached_assets directory for Meta/external access to images
  const attachedAssetsPath = path.resolve(process.cwd(), "attached_assets");
  if (fs.existsSync(attachedAssetsPath)) {
    app.use("/attached_assets", express.static(attachedAssetsPath, {
      maxAge: "1d",
      etag: true,
      lastModified: true,
    }));
  }

  // Serve hashed assets (JS, CSS, images) with long cache time
  // These files have content hashes in their names, so they're safe to cache forever
  app.use("/assets", express.static(path.join(distPath, "assets"), {
    maxAge: "1y",
    immutable: true,
  }));

  // Serve other static files with short cache and revalidation
  app.use(express.static(distPath, {
    maxAge: "0",
    etag: true,
    lastModified: true,
  }));

  // fall through to index.html if the file doesn't exist
  // Always serve with no-cache so browser checks for new version
  app.use("*", (_req, res) => {
    res.set({
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0"
    });
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
