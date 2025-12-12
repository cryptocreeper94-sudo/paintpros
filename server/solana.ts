import { 
  Connection, 
  Keypair, 
  Transaction, 
  SystemProgram, 
  TransactionInstruction, 
  PublicKey,
  sendAndConfirmTransaction
} from '@solana/web3.js';
import * as crypto from 'crypto';

const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

const NETWORKS = {
  devnet: 'https://api.devnet.solana.com',
  'mainnet-beta': 'https://api.mainnet-beta.solana.com'
};

export function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function getConnection(network: 'devnet' | 'mainnet-beta' = 'devnet'): Connection {
  return new Connection(NETWORKS[network], 'confirmed');
}

export function getWalletFromPrivateKey(privateKeyBase58: string): Keypair {
  const bs58 = require('bs58');
  const privateKey = bs58.decode(privateKeyBase58);
  return Keypair.fromSecretKey(privateKey);
}

export async function stampHashToBlockchain(
  documentHash: string,
  wallet: Keypair,
  network: 'devnet' | 'mainnet-beta' = 'devnet',
  metadata?: { entityType: string; entityId: string }
): Promise<{ signature: string; slot: number; blockTime: Date }> {
  const connection = getConnection(network);
  
  const memoData = metadata 
    ? `NPP:${metadata.entityType}:${metadata.entityId}:${documentHash}`
    : `NPP:HASH:${documentHash}`;
  
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

export async function verifyStamp(
  signature: string,
  network: 'devnet' | 'mainnet-beta' = 'devnet'
): Promise<{ 
  found: boolean; 
  hash?: string; 
  blockTime?: Date; 
  slot?: number;
  explorerUrl: string;
}> {
  const connection = getConnection(network);
  const explorerUrl = network === 'devnet' 
    ? `https://explorer.solana.com/tx/${signature}?cluster=devnet`
    : `https://explorer.solana.com/tx/${signature}`;
  
  try {
    const tx = await connection.getTransaction(signature, { 
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 0
    });
    
    if (!tx) {
      return { found: false, explorerUrl };
    }
    
    const blockTime = tx.blockTime ? new Date(tx.blockTime * 1000) : undefined;
    
    return {
      found: true,
      blockTime,
      slot: tx.slot,
      explorerUrl
    };
  } catch (error) {
    console.error('Error verifying stamp:', error);
    return { found: false, explorerUrl };
  }
}

export function generateNewWallet(): { publicKey: string; privateKey: string } {
  const bs58 = require('bs58');
  const keypair = Keypair.generate();
  return {
    publicKey: keypair.publicKey.toBase58(),
    privateKey: bs58.encode(keypair.secretKey)
  };
}

export async function getWalletBalance(publicKey: string, network: 'devnet' | 'mainnet-beta' = 'devnet'): Promise<number> {
  const connection = getConnection(network);
  const balance = await connection.getBalance(new PublicKey(publicKey));
  return balance / 1e9;
}

export async function requestDevnetAirdrop(publicKey: string): Promise<string> {
  const connection = getConnection('devnet');
  const signature = await connection.requestAirdrop(new PublicKey(publicKey), 1e9);
  await connection.confirmTransaction(signature);
  return signature;
}
