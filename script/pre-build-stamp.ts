import crypto from "crypto";

function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function generateHallmarkNumber(): string {
  const date = new Date().toISOString().replace(/[-:]/g, '').substring(0, 8);
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `ORBIT-${date}-${random}`;
}

export async function preBuildStamp(): Promise<void> {
  console.log("\n📦 PRE-BUILD VERSION STAMP\n");
  
  // Skip database operations during build phase
  // Version stamping should happen at runtime after server starts
  if (process.env.NODE_ENV === 'production' || !process.env.DATABASE_URL) {
    console.log("⚠️  Skipping database operations during build phase");
    console.log("   Version stamping will occur at server startup instead");
    console.log("\n✨ Pre-build stamp skipped (build-safe mode)!\n");
    return;
  }

  // Only run in development with explicit DATABASE_URL
  try {
    const { drizzle } = await import("drizzle-orm/node-postgres");
    const pg = await import("pg");
    const schema = await import("../shared/schema.js");
    const { desc, eq } = await import("drizzle-orm");
    
    const { Pool } = pg.default;
    const pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
    });
    
    const db = drizzle(pool, { schema });
    
    try {
      const [latestRelease] = await db.select().from(schema.releaseVersions)
        .orderBy(desc(schema.releaseVersions.buildNumber))
        .limit(1);
      
      let currentVersion = latestRelease?.version || "1.0.0";
      let buildNumber = (latestRelease?.buildNumber || 0) + 1;
      
      const [major, minor, patch] = currentVersion.split('.').map(Number);
      const newVersion = `${major}.${minor}.${patch + 1}`;
      
      const contentHash = hashData(`${newVersion}-${buildNumber}-${Date.now()}`);
      const hallmarkNumber = generateHallmarkNumber();
      
      const hallmarkData = {
        hallmarkNumber,
        assetType: 'release',
        createdBy: 'system',
        recipientName: 'Paint Pros by ORBIT',
        recipientRole: 'system' as const,
        contentHash: hashData(`v${newVersion} build ${buildNumber}`),
        metadata: { version: newVersion, buildNumber, bumpType: 'patch' },
        searchTerms: `${hallmarkNumber} release system ${newVersion}`,
      };
      
      const [savedHallmark] = await db.insert(schema.hallmarks).values(hallmarkData).returning();
      console.log(`✅ Hallmark created: ${savedHallmark.hallmarkNumber}`);
      
      const [release] = await db.insert(schema.releaseVersions).values({
        version: newVersion,
        buildNumber,
        hallmarkId: savedHallmark.id,
        contentHash,
      }).returning();
      
      console.log(`✅ Version bumped: v${newVersion} (Build ${buildNumber})`);
      console.log("\n✨ Pre-build stamp complete!\n");
      
    } catch (dbError) {
      console.log(`⚠️  Database operation failed (continuing build): ${dbError}`);
    } finally {
      await pool.end();
    }
  } catch (error) {
    console.log(`⚠️  Pre-build stamp skipped (module load error): ${error}`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  preBuildStamp();
}
