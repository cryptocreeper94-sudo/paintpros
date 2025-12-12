import { EDITION_PREFIXES } from "@shared/schema";

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

  if (parsed.prefix === 'PT') {
    return { tier: 'Platinum', color: '#e5e7eb', icon: '🏆', glow: '0 0 20px #e5e7eb', edition: 'Platinum Tier' };
  }
  
  if (parsed.prefix === 'DW') {
    return { tier: 'DarkWave', color: '#14b8a6', icon: '🌊', glow: '0 0 15px #14b8a6', edition: 'DarkWave Studios' };
  }

  if (parsed.prefix === 'PP') {
    return { tier: 'Paint Pros', color: '#d4a853', icon: '🎨', glow: '0 0 15px #d4a853', edition: 'Paint Pros Edition' };
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

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function truncateHash(hash: string, length: number = 8): string {
  if (hash.length <= length * 2) return hash;
  return `${hash.slice(0, length)}...${hash.slice(-length)}`;
}
