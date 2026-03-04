import crypto from "crypto";
import { ANCHORABLE_TYPES, EDITION_PREFIXES, FOUNDING_ASSETS, TENANT_PREFIXES, hallmarkCounter, trustStamps, hallmarks } from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";

export interface HallmarkData {
  hallmarkNumber: string;
  assetNumber?: string;
  assetType: string;
  referenceId?: string;
  createdBy: string;
  recipientName: string;
  recipientRole: 'employee' | 'owner' | 'admin' | 'client' | 'system';
  contentHash: string;
  metadata: Record<string, any>;
  searchTerms: string;
}

export interface BadgeTier {
  tier: string;
  color: string;
  icon: string;
  glow: string;
  edition?: string;
}

export interface ParsedHallmark {
  prefix?: string;
  master: number;
  sub: number;
  edition?: string;
  isFounder: boolean;
  isSpecial: boolean;
  raw: string;
}

export interface TrustStampInput {
  userId?: number;
  category: string;
  data?: Record<string, any>;
}

const PP_COUNTER_ID = "pp-master";
const PP_GENESIS = "PP-00000001";
const PP_PREFIX = "PP";

export async function generateHallmark(): Promise<string> {
  const result = await db.execute(sql`
    INSERT INTO hallmark_counter (id, current_sequence)
    VALUES (${PP_COUNTER_ID}, '1')
    ON CONFLICT (id) DO UPDATE
    SET current_sequence = (CAST(hallmark_counter.current_sequence AS integer) + 1)::text
    RETURNING current_sequence
  `);

  const seq = parseInt(result.rows[0].current_sequence as string, 10);
  return `${PP_PREFIX}-${seq.toString().padStart(8, '0')}`;
}

export function generateContentHash(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

export async function createTrustStamp(input: TrustStampInput): Promise<typeof trustStamps.$inferSelect> {
  const payload = JSON.stringify(input.data || {});
  const dataHash = crypto.createHash('sha256').update(payload).digest('hex');

  const [stamp] = await db.insert(trustStamps).values({
    userId: input.userId ?? null,
    category: input.category,
    data: input.data || {},
    dataHash,
  }).returning();

  return stamp;
}

export async function ensureGenesisHallmark(): Promise<void> {
  const existing = await db.select()
    .from(hallmarks)
    .where(eq(hallmarks.hallmarkNumber, PP_GENESIS))
    .limit(1);

  if (existing.length > 0) {
    console.log(`[hallmark] Genesis hallmark ${PP_GENESIS} already exists`);
    return;
  }

  const metadata = {
    ecosystem: "Trust Layer",
    parentGenesis: "TH-00000001",
    operator: "DarkWave Studios LLC",
    platform: "paintpros.tlid.io",
    prefix: PP_PREFIX,
    format: "PP-XXXXXXXX",
    type: "genesis",
    createdAt: new Date().toISOString(),
  };

  const contentHash = generateContentHash(JSON.stringify(metadata));

  await db.insert(hallmarks).values({
    hallmarkNumber: PP_GENESIS,
    assetType: "genesis",
    createdBy: "system",
    recipientName: "PaintPros Platform",
    recipientRole: "system",
    contentHash,
    metadata,
    searchTerms: `${PP_GENESIS} genesis paintpros trust-layer darkwave`,
  });

  await db.execute(sql`
    INSERT INTO hallmark_counter (id, current_sequence)
    VALUES (${PP_COUNTER_ID}, '1')
    ON CONFLICT (id) DO UPDATE
    SET current_sequence = GREATEST(CAST(hallmark_counter.current_sequence AS integer), 1)::text
  `);

  console.log(`[hallmark] Genesis hallmark ${PP_GENESIS} created`);
}

export async function verifyHallmark(hallmarkId: string): Promise<{
  verified: boolean;
  hallmark: typeof hallmarks.$inferSelect | null;
  badge: BadgeTier | null;
  message: string;
}> {
  const [found] = await db.select()
    .from(hallmarks)
    .where(eq(hallmarks.hallmarkNumber, hallmarkId))
    .limit(1);

  if (!found) {
    return {
      verified: false,
      hallmark: null,
      badge: null,
      message: `Hallmark ${hallmarkId} not found`,
    };
  }

  const badge = getAssetBadge(found.assetNumber || found.hallmarkNumber);

  return {
    verified: true,
    hallmark: found,
    badge,
    message: `Hallmark ${hallmarkId} verified`,
  };
}

export function generateHallmarkNumber(tenantId?: string): string {
  const date = new Date().toISOString().replace(/[-:]/g, '').substring(0, 8);
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  
  if (tenantId && TENANT_PREFIXES[tenantId]) {
    return `${TENANT_PREFIXES[tenantId].prefix}-${date}-${random}`;
  }
  
  return `ORBIT-${date}-${random}`;
}

export function generateTenantAssetNumber(
  tenantId: string,
  master: number,
  sub: number = 1
): string {
  const tenantConfig = TENANT_PREFIXES[tenantId];
  const prefix = tenantConfig?.prefix || 'STD';
  const masterStr = master.toString().padStart(9, '0');
  const subStr = sub.toString().padStart(2, '0');
  return `${prefix}-${masterStr}-${subStr}`;
}

export function formatAssetNumber(master: number, sub: number = 0): string {
  const masterStr = master.toString().padStart(9, '0');
  const subStr = sub.toString().padStart(2, '0');
  return `#${masterStr}-${subStr}`;
}

export function formatSpecialEdition(
  prefix: keyof typeof EDITION_PREFIXES,
  master: number,
  sub: number = 0
): string {
  const masterStr = master.toString().padStart(9, '0');
  const subStr = sub.toString().padStart(2, '0');
  return `#${prefix}-${masterStr}-${subStr}`;
}

export function parseAssetNumber(assetNumber: string): { master: number; sub: number } | null {
  const match = assetNumber.match(/^#(\d{9})-(\d{2})$/);
  if (!match) return null;
  return {
    master: parseInt(match[1], 10),
    sub: parseInt(match[2], 10),
  };
}

export function parseHallmark(hallmarkNumber: string): ParsedHallmark | null {
  if (hallmarkNumber.startsWith('ORBIT-')) {
    return {
      master: 0,
      sub: 0,
      isFounder: false,
      isSpecial: false,
      raw: hallmarkNumber,
    };
  }

  const ppMatch = hallmarkNumber.match(/^PP-(\d{8})$/);
  if (ppMatch) {
    const seq = parseInt(ppMatch[1], 10);
    return {
      prefix: 'PP',
      master: seq,
      sub: 0,
      edition: 'PaintPros Trust Layer',
      isFounder: seq === 1,
      isSpecial: true,
      raw: hallmarkNumber,
    };
  }

  if (hallmarkNumber.startsWith('PAINTPROS-')) {
    const assetMatch = hallmarkNumber.match(/^PAINTPROS-(\d{9})-(\d{2})$/);
    if (assetMatch) {
      return {
        prefix: 'PAINTPROS',
        master: parseInt(assetMatch[1], 10),
        sub: parseInt(assetMatch[2], 10),
        edition: 'PaintPros.io Platform',
        isFounder: true,
        isSpecial: true,
        raw: hallmarkNumber,
      };
    }
    return {
      prefix: 'PAINTPROS',
      master: 0,
      sub: 0,
      edition: 'PaintPros.io Platform',
      isFounder: false,
      isSpecial: true,
      raw: hallmarkNumber,
    };
  }

  const tenantHallmarkMatch = hallmarkNumber.match(/^(NPP)-\d{8}-[A-Z0-9]{6}$/);
  if (tenantHallmarkMatch) {
    const prefix = tenantHallmarkMatch[1];
    return {
      prefix,
      master: 0,
      sub: 0,
      edition: 'Nash PaintPros',
      isFounder: false,
      isSpecial: true,
      raw: hallmarkNumber,
    };
  }

  const tenantAssetMatch = hallmarkNumber.match(/^(NPP)-(\d{9})-(\d{2})$/);
  if (tenantAssetMatch) {
    const prefix = tenantAssetMatch[1];
    const master = parseInt(tenantAssetMatch[2], 10);
    const sub = parseInt(tenantAssetMatch[3], 10);
    return {
      prefix,
      master,
      sub,
      edition: 'Nash PaintPros',
      isFounder: master <= 3,
      isSpecial: true,
      raw: hallmarkNumber,
    };
  }

  const specialMatch = hallmarkNumber.match(/^#([A-Z]+)-(\d{9})-(\d{2})$/);
  if (specialMatch) {
    const prefix = specialMatch[1] as keyof typeof EDITION_PREFIXES;
    const master = parseInt(specialMatch[2], 10);
    const sub = parseInt(specialMatch[3], 10);
    return {
      prefix,
      master,
      sub,
      edition: EDITION_PREFIXES[prefix] || 'Special Edition',
      isFounder: prefix === 'FE' && master <= 3,
      isSpecial: true,
      raw: hallmarkNumber,
    };
  }

  const standardMatch = hallmarkNumber.match(/^#(\d{9})-(\d{2})$/);
  if (standardMatch) {
    const master = parseInt(standardMatch[1], 10);
    const sub = parseInt(standardMatch[2], 10);
    return {
      master,
      sub,
      isFounder: master <= 3,
      isSpecial: master < 3000,
      raw: hallmarkNumber,
    };
  }

  return null;
}

export function getAssetBadge(hallmarkNumber: string): BadgeTier {
  const parsed = parseHallmark(hallmarkNumber);
  
  if (!parsed) {
    return { tier: 'Standard', color: '#6b7280', icon: '📄', glow: 'none' };
  }

  if (parsed.prefix === 'PP') {
    if (parsed.master === 1) {
      return { tier: 'Genesis Hallmark', color: '#1e3a5f', icon: 'shield', glow: '0 0 20px #1e3a5f', edition: 'PaintPros Genesis' };
    }
    return { tier: 'PaintPros Verified', color: '#1e3a5f', icon: 'shield-check', glow: '0 0 15px #1e3a5f', edition: 'PaintPros Trust Layer' };
  }

  if (parsed.prefix === 'PAINTPROS') {
    return { tier: 'Paint Pros Platform', color: '#d4a853', icon: '🎨', glow: '0 0 20px #d4a853', edition: 'PaintPros.io Platform' };
  }

  if (parsed.prefix === 'NPP') {
    return { tier: 'NPP Verified', color: '#5a7a4d', icon: '🎨', glow: '0 0 15px #5a7a4d', edition: 'Nash PaintPros' };
  }

  if (parsed.prefix === 'PT') {
    return { tier: 'Platinum', color: '#e5e7eb', icon: '🏆', glow: '0 0 20px #e5e7eb', edition: 'Platinum Tier' };
  }
  
  if (parsed.prefix === 'DW') {
    return { tier: 'DarkWave', color: '#14b8a6', icon: '🌊', glow: '0 0 15px #14b8a6', edition: 'DarkWave Studios' };
  }

  if (parsed.master >= 1 && parsed.master <= 3) {
    return { tier: 'Founding Asset', color: '#fbbf24', icon: '👑', glow: '0 0 20px #fbbf24', edition: "Founder's Edition" };
  }
  
  if (parsed.master >= 4 && parsed.master <= 99) {
    return { tier: 'Core Team', color: '#f59e0b', icon: '⭐', glow: '0 0 15px #f59e0b' };
  }
  
  if (parsed.master >= 100 && parsed.master <= 999) {
    return { tier: 'Special Edition', color: '#8b5cf6', icon: '💎', glow: '0 0 15px #8b5cf6', edition: 'Special Edition' };
  }
  
  if (parsed.master >= 1000 && parsed.master <= 1999) {
    return { tier: 'Genesis Series', color: '#06b6d4', icon: '🚀', glow: '0 0 15px #06b6d4', edition: 'Genesis Series' };
  }
  
  if (parsed.master >= 2000 && parsed.master <= 2999) {
    return { tier: 'Anniversary', color: '#ec4899', icon: '🎉', glow: '0 0 15px #ec4899', edition: 'Anniversary Edition' };
  }

  return { tier: 'Standard', color: '#6b7280', icon: '📄', glow: 'none' };
}

export function createHallmarkData(
  assetType: string,
  recipientName: string,
  recipientRole: HallmarkData['recipientRole'],
  createdBy: string,
  content: string,
  metadata: Record<string, any> = {},
  referenceId?: string,
  assetNumber?: string,
  tenantId?: string
): HallmarkData {
  const hallmarkNumber = generateHallmarkNumber(tenantId);
  const contentHash = generateContentHash(content);
  
  const searchTerms = [
    hallmarkNumber,
    assetNumber || '',
    assetType,
    recipientName.toLowerCase(),
    recipientRole,
    createdBy.toLowerCase(),
    ...Object.values(metadata).filter(v => typeof v === 'string').map(v => (v as string).toLowerCase())
  ].filter(Boolean).join(' ');

  return {
    hallmarkNumber,
    assetNumber,
    assetType,
    referenceId,
    createdBy,
    recipientName,
    recipientRole,
    contentHash,
    metadata,
    searchTerms,
  };
}

export function shouldAnchorToBlockchain(assetType: string): boolean {
  return (ANCHORABLE_TYPES as readonly string[]).includes(assetType);
}

export function getFoundingAsset(key: keyof typeof FOUNDING_ASSETS) {
  return FOUNDING_ASSETS[key];
}

export function isReservedAssetNumber(masterNumber: number): boolean {
  return masterNumber < 3000;
}

export function validateHallmarkNumber(hallmarkNumber: string): boolean {
  if (hallmarkNumber.startsWith('PP-')) {
    return /^PP-\d{8}$/.test(hallmarkNumber);
  }

  if (hallmarkNumber.startsWith('ORBIT-')) {
    return /^ORBIT-\d{8}-[A-Z0-9]{6}$/.test(hallmarkNumber);
  }
  
  if (hallmarkNumber.startsWith('PAINTPROS-')) {
    return /^PAINTPROS-(\d{8}-[A-Z0-9]{6}|\d{9}-\d{2})$/.test(hallmarkNumber);
  }
  
  if (hallmarkNumber.startsWith('NPP-')) {
    return /^NPP-(\d{8}-[A-Z0-9]{6}|\d{9}-\d{2})$/.test(hallmarkNumber);
  }
  
  if (hallmarkNumber.startsWith('#')) {
    return /^#([A-Z]+-)?(\d{9})-(\d{2})$/.test(hallmarkNumber);
  }
  
  return false;
}
