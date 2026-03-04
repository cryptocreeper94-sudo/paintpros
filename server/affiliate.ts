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

export async function getAffiliateLink(userId: string) {
  const uniqueHash = await ensureUniqueHash(userId);
  const baseUrl = process.env.REPLIT_DEV_DOMAIN
    ? `https://${process.env.REPLIT_DEV_DOMAIN}`
    : "https://paintpros.tlid.io";

  return {
    referralHash: uniqueHash,
    link: `${baseUrl}/ref/${uniqueHash}`,
    platforms: {
      paintpros: `${baseUrl}/ref/${uniqueHash}?platform=paintpros`,
      tradeworks: `${baseUrl}/ref/${uniqueHash}?platform=tradeworks`,
      trustlayer: `${baseUrl}/ref/${uniqueHash}?platform=trustlayer`,
    },
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
