import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../shared/schema.js";
import { desc, eq } from "drizzle-orm";
import crypto from "crypto";
import { 
  Connection, 
  Keypair, 
  Transaction, 
  SystemProgram, 
  TransactionInstruction, 
  PublicKey,
  sendAndConfirmTransaction
} from '@solana/web3.js';

const { Pool } = pg;
const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function generateHallmarkNumber(): string {
  const date = new Date().toISOString().replace(/[-:]/g, '').substring(0, 8);
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `ORBIT-${date}-${random}`;
}

function getConnection(network: 'devnet' | 'mainnet-beta' = 'mainnet-beta'): Connection {
  const heliusRpcUrl = process.env.HELIUS_RPC_URL;
  const heliusApiKey = process.env.HELIUS_API_KEY;
  
  if (heliusRpcUrl) {
    return new Connection(heliusRpcUrl, 'confirmed');
  }
  
  if (heliusApiKey) {
    const heliusUrl = network === 'devnet' 
      ? `https://devnet.helius-rpc.com/?api-key=${heliusApiKey}`
      : `https://mainnet.helius-rpc.com/?api-key=${heliusApiKey}`;
    return new Connection(heliusUrl, 'confirmed');
  }
  
  const defaultUrls = {
    devnet: 'https://api.devnet.solana.com',
    'mainnet-beta': 'https://api.mainnet-beta.solana.com'
  };
  return new Connection(defaultUrls[network], 'confirmed');
}

async function stampToSolana(
  documentHash: string,
  wallet: Keypair,
  network: 'devnet' | 'mainnet-beta',
  metadata: { entityType: string; entityId: string }
): Promise<{ signature: string; slot: number; blockTime: Date }> {
  const connection = getConnection(network);
  
  const memoData = `NPP:${metadata.entityType}:${metadata.entityId}:${documentHash}`;
  
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: wallet.publicKey,
      lamports: 0
    }),
    new TransactionInstruction({
      keys: [],
      programId: MEMO_PROGRAM_ID,
      data: Buffer.from(memoData, 'utf8')
    })
  );
  
  const signature = await sendAndConfirmTransaction(connection, transaction, [wallet]);
  
  const tx = await connection.getTransaction(signature, { commitment: 'confirmed' });
  const slot = tx?.slot || 0;
  const blockTime = tx?.blockTime ? new Date(tx.blockTime * 1000) : new Date();
  
  return { signature, slot, blockTime };
}

export async function preBuildStamp(): Promise<void> {
  console.log("\n📦 PRE-BUILD VERSION STAMP\n");
  
  if (!process.env.DATABASE_URL) {
    console.log("⚠️  No DATABASE_URL - skipping version stamp");
    return;
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
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
    
    const privateKey = process.env.PHANTOM_SECRET_KEY || process.env.SOLANA_PRIVATE_KEY;
    
    if (privateKey) {
      console.log("🔗 Stamping to Solana blockchain...");
      try {
        const bs58 = await import('bs58');
        const privateKeyBytes = bs58.default.decode(privateKey);
        const wallet = Keypair.fromSecretKey(privateKeyBytes);
        
        const network = 'mainnet-beta' as const;
        const result = await stampToSolana(
          release.contentHash,
          wallet,
          network,
          { entityType: 'release', entityId: release.id }
        );
        
        await db.update(schema.releaseVersions)
          .set({ solanaTxSignature: result.signature, solanaTxStatus: 'confirmed' })
          .where(eq(schema.releaseVersions.id, release.id));
        
        const explorerUrl = `https://explorer.solana.com/tx/${result.signature}`;
        await db.update(schema.hallmarks)
          .set({ blockchainTxSignature: result.signature, blockchainExplorerUrl: explorerUrl })
          .where(eq(schema.hallmarks.id, savedHallmark.id));
        
        console.log(`✅ Solana stamp confirmed: ${result.signature.substring(0, 20)}...`);
        console.log(`   Explorer: ${explorerUrl}`);
      } catch (solanaError) {
        console.log(`⚠️  Solana stamping failed (will continue build): ${solanaError}`);
      }
    } else {
      console.log("⚠️  No Solana wallet configured - skipping blockchain stamp");
    }
    
    console.log("\n✨ Pre-build stamp complete!\n");
    
  } catch (error) {
    console.error("❌ Pre-build stamp failed:", error);
  } finally {
    await pool.end();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  preBuildStamp();
}
