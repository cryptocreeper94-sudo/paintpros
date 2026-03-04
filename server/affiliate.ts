import { db } from "./db";
import { eq, and, sql, desc, count, sum } from "drizzle-orm";
import { users, affiliateReferrals, affiliateCommissions } from "@shared/schema";
import crypto from "crypto";

const TIERS = [
  { name: "Base", minReferrals: 0, rate: 0.10 },
  { name: "Silver", minReferrals: 5, rate: 0.125 },
  { name: "Gold", minReferrals: 15, rate: 0.15 },
  { name: "Platinum", minReferrals: 30, rate: 0.175 },
  { name: "Diamond", minReferrals: 50, rate: 0.20 },
];

function calculateTier(convertedCount: number) {
  let tier = TIERS[0];
  for (const t of TIERS) {
    if (convertedCount >= t.minReferrals) {
      tier = t;
    }
  }
  return tier;
}

export async function ensureUniqueHash(userId: string): Promise<string> {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (user?.uniqueHash) {
    return user.uniqueHash;
  }
  const hash = crypto.randomBytes(16).toString("hex");
  await db.update(users).set({ uniqueHash: hash }).where(eq(users.id, userId));
  return hash;
}

export async function getAffiliateDashboard(userId: string) {
  const uniqueHash = await ensureUniqueHash(userId);

  const referrals = await db
    .select()
    .from(affiliateReferrals)
    .where(eq(affiliateReferrals.referrerId, userId))
    .orderBy(desc(affiliateReferrals.createdAt));

  const totalReferrals = referrals.length;
  const convertedReferrals = referrals.filter((r) => r.status === "converted").length;
  const pendingReferrals = referrals.filter((r) => r.status === "pending").length;

  const commissions = await db
    .select()
    .from(affiliateCommissions)
    .where(eq(affiliateCommissions.referrerId, userId))
    .orderBy(desc(affiliateCommissions.createdAt));

  const pendingEarnings = commissions
    .filter((c) => c.status === "pending")
    .reduce((sum, c) => sum + parseFloat(c.amount), 0);

  const paidEarnings = commissions
    .filter((c) => c.status === "paid")
    .reduce((sum, c) => sum + parseFloat(c.amount), 0);

  const tier = calculateTier(convertedReferrals);

  return {
    userId,
    uniqueHash,
    tier: {
      name: tier.name,
      rate: tier.rate,
      convertedCount: convertedReferrals,
      nextTier: TIERS.find((t) => t.minReferrals > convertedReferrals) || null,
    },
    stats: {
      totalReferrals,
      convertedReferrals,
      pendingReferrals,
      pendingEarnings: pendingEarnings.toFixed(2),
      paidEarnings: paidEarnings.toFixed(2),
    },
    referrals: referrals.slice(0, 20),
    commissions: commissions.slice(0, 20),
    tiers: TIERS,
  };
}

export const ECOSYSTEM_REGISTRY = [
  { id: 1, name: "Trust Layer Hub", prefix: "TH", genesis: "TH-00000001", domain: "trusthub.tlid.io" },
  { id: 2, name: "Trust Layer (L1)", prefix: "TL", genesis: "TL-00000001", domain: "dwtl.io" },
  { id: 3, name: "TrustHome", prefix: "TR", genesis: "TR-00000001", domain: "trusthome.tlid.io" },
  { id: 4, name: "TrustVault", prefix: "TV", genesis: "TV-00000001", domain: "trustvault.tlid.io" },
  { id: 5, name: "TLID.io", prefix: "TI", genesis: "TI-00000001", domain: "tlid.io" },
  { id: 6, name: "THE VOID", prefix: "VO", genesis: "VO-00000001", domain: "thevoid.tlid.io" },
  { id: 7, name: "Signal Chat", prefix: "SC", genesis: "SC-00000001", domain: "signalchat.tlid.io" },
  { id: 8, name: "DarkWave Studio", prefix: "DS", genesis: "DS-00000001", domain: "darkwavestudio.tlid.io" },
  { id: 9, name: "Guardian Shield", prefix: "GS", genesis: "GS-00000001", domain: "guardianshield.tlid.io" },
  { id: 10, name: "Guardian Scanner", prefix: "GN", genesis: "GN-00000001", domain: "guardianscanner.tlid.io" },
  { id: 11, name: "Guardian Screener", prefix: "GR", genesis: "GR-00000001", domain: "guardianscreener.tlid.io" },
  { id: 12, name: "TradeWorks AI", prefix: "TW", genesis: "TW-00000001", domain: "tradeworks.tlid.io" },
  { id: 13, name: "StrikeAgent", prefix: "SA", genesis: "SA-00000001", domain: "strikeagent.tlid.io" },
  { id: 14, name: "Pulse", prefix: "PU", genesis: "PU-00000001", domain: "pulse.tlid.io" },
  { id: 15, name: "Chronicles", prefix: "CH", genesis: "CH-00000001", domain: "chronicles.tlid.io" },
  { id: 16, name: "The Arcade", prefix: "AR", genesis: "AR-00000001", domain: "thearcade.tlid.io" },
  { id: 17, name: "Bomber", prefix: "BO", genesis: "BO-00000001", domain: "bomber.tlid.io" },
  { id: 18, name: "Trust Golf", prefix: "TG", genesis: "TG-00000001", domain: "trustgolf.tlid.io" },
  { id: 19, name: "ORBIT Staffing OS", prefix: "OR", genesis: "OR-00000001", domain: "orbit.tlid.io" },
  { id: 20, name: "Orby Commander", prefix: "OC", genesis: "OC-00000001", domain: "orby.tlid.io" },
  { id: 21, name: "GarageBot", prefix: "GB", genesis: "GB-00000001", domain: "garagebot.tlid.io" },
  { id: 22, name: "Lot Ops Pro", prefix: "LO", genesis: "LO-00000001", domain: "lotops.tlid.io" },
  { id: 23, name: "TORQUE", prefix: "TQ", genesis: "TQ-00000001", domain: "torque.tlid.io" },
  { id: 24, name: "TL Driver Connect", prefix: "DC", genesis: "DC-00000001", domain: "driverconnect.tlid.io" },
  { id: 25, name: "VedaSolus", prefix: "VS", genesis: "VS-00000001", domain: "vedasolus.tlid.io" },
  { id: 26, name: "Verdara", prefix: "VD", genesis: "VD-00000001", domain: "verdara.tlid.io" },
  { id: 27, name: "Arbora", prefix: "AB", genesis: "AB-00000001", domain: "arbora.tlid.io" },
  { id: 28, name: "PaintPros", prefix: "PP", genesis: "PP-00000001", domain: "paintpros.tlid.io" },
  { id: 29, name: "Nashville Painting Professionals", prefix: "NP", genesis: "NP-00000001", domain: "nashvillepainting.tlid.io" },
  { id: 30, name: "Trust Book", prefix: "TB", genesis: "TB-00000001", domain: "trustbook.tlid.io" },
  { id: 31, name: "DarkWave Academy", prefix: "DA", genesis: "DA-00000001", domain: "darkwaveacademy.tlid.io" },
  { id: 32, name: "Happy Eats", prefix: "HE", genesis: "HE-00000001", domain: "happyeats.tlid.io" },
  { id: 33, name: "Brew & Board Coffee", prefix: "BB", genesis: "BB-00000001", domain: "brewandboard.tlid.io" },
] as const;

export async function getAffiliateLink(userId: string) {
  const uniqueHash = await ensureUniqueHash(userId);
  const baseUrl = process.env.REPLIT_DEV_DOMAIN
    ? `https://${process.env.REPLIT_DEV_DOMAIN}`
    : "https://paintpros.tlid.io";

  const platforms: Record<string, string> = {};
  for (const app of ECOSYSTEM_REGISTRY) {
    platforms[app.prefix.toLowerCase()] = `https://${app.domain}/ref/${uniqueHash}`;
  }

  return {
    referralHash: uniqueHash,
    link: `${baseUrl}/ref/${uniqueHash}`,
    platforms,
    ecosystem: ECOSYSTEM_REGISTRY,
  };
}

export async function trackReferral(referralHash: string, platform: string = "paintpros") {
  const [referrer] = await db
    .select()
    .from(users)
    .where(eq(users.uniqueHash, referralHash))
    .limit(1);

  if (!referrer) {
    throw new Error("Invalid referral hash");
  }

  const [referral] = await db
    .insert(affiliateReferrals)
    .values({
      referrerId: referrer.id,
      referralHash,
      platform,
      status: "pending",
    })
    .returning();

  return referral;
}

export async function convertReferral(referredUserId: string) {
  const pendingReferrals = await db
    .select()
    .from(affiliateReferrals)
    .where(eq(affiliateReferrals.status, "pending"))
    .orderBy(desc(affiliateReferrals.createdAt))
    .limit(1);

  if (pendingReferrals.length === 0) {
    return null;
  }

  const referral = pendingReferrals[0];

  const [updated] = await db
    .update(affiliateReferrals)
    .set({
      referredUserId,
      status: "converted",
      convertedAt: new Date(),
    })
    .where(eq(affiliateReferrals.id, referral.id))
    .returning();

  return updated;
}

export async function createCommission(
  referrerId: string,
  referralId: number,
  amount: string
) {
  const convertedCount = await db
    .select({ count: count() })
    .from(affiliateReferrals)
    .where(
      and(
        eq(affiliateReferrals.referrerId, referrerId),
        eq(affiliateReferrals.status, "converted")
      )
    );

  const tier = calculateTier(convertedCount[0]?.count || 0);
  const commissionAmount = (parseFloat(amount) * tier.rate).toFixed(2);

  const [commission] = await db
    .insert(affiliateCommissions)
    .values({
      referrerId,
      referralId,
      amount: commissionAmount,
      currency: "SIG",
      tier: tier.name.toLowerCase(),
      status: "pending",
    })
    .returning();

  return commission;
}

export async function requestPayout(userId: string) {
  const pendingCommissions = await db
    .select()
    .from(affiliateCommissions)
    .where(
      and(
        eq(affiliateCommissions.referrerId, userId),
        eq(affiliateCommissions.status, "pending")
      )
    );

  const totalPending = pendingCommissions.reduce(
    (sum, c) => sum + parseFloat(c.amount),
    0
  );

  if (totalPending < 10) {
    throw new Error(
      `Minimum payout is 10 SIG. Current pending balance: ${totalPending.toFixed(2)} SIG`
    );
  }

  const ids = pendingCommissions.map((c) => c.id);

  for (const id of ids) {
    await db
      .update(affiliateCommissions)
      .set({ status: "processing" })
      .where(eq(affiliateCommissions.id, id));
  }

  return {
    totalAmount: totalPending.toFixed(2),
    currency: "SIG",
    commissionsProcessed: ids.length,
    status: "processing",
  };
}
