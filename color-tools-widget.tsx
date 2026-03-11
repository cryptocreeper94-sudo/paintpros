/**
 * =============================================================================
 * PAINTPROS COLOR TOOLS WIDGET — Self-Contained Premium Widget
 * =============================================================================
 *
 * 3 Tools:
 *   1. Color Match — Scan any color via camera/photo, match to 6 paint brands
 *   2. Room Visualizer — Upload a wall photo, preview paint colors on it
 *   3. Square Footage Estimator — Calculate paint needs & cost by room dimensions
 *
 * Brands: Sherwin-Williams, Benjamin Moore, Behr (Home Depot),
 *         Valspar (Lowe's), PPG, Clark+Kensington (Ace Hardware)
 *
 * Dependencies (peer): React 18+, Tailwind CSS 3+, lucide-react
 * No backend required — 100% client-side.
 *
 * To use: Drop into any React + Tailwind project and render <ColorToolsWidget />
 * =============================================================================
 */

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Palette, ScanLine, Paintbrush, Camera, Upload, X, Check, RefreshCw,
  Crosshair, Store, ExternalLink, Download, RotateCcw, ChevronLeft,
  Ruler, Calculator, Home, DoorOpen, Layers, Minus, Plus, Info
} from "lucide-react";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface CatalogColor {
  id: string;
  name: string;
  code: string;
  hex: string;
  brand: string;
  brandDisplay: string;
  collection?: string;
  lrv?: number;
  rgb: { r: number; g: number; b: number };
  lab: { l: number; a: number; b: number };
}

interface ScannedColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
}

interface Room {
  id: string;
  name: string;
  length: string;
  width: string;
  height: string;
  doors: number;
  windows: number;
}

// ─── COLOR SCIENCE ───────────────────────────────────────────────────────────

function hexToRgb(hex: string) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r
    ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) }
    : { r: 0, g: 0, b: 0 };
}

function rgbToLab(r: number, g: number, b: number) {
  let rr = r / 255, gg = g / 255, bb = b / 255;
  rr = rr > 0.04045 ? Math.pow((rr + 0.055) / 1.055, 2.4) : rr / 12.92;
  gg = gg > 0.04045 ? Math.pow((gg + 0.055) / 1.055, 2.4) : gg / 12.92;
  bb = bb > 0.04045 ? Math.pow((bb + 0.055) / 1.055, 2.4) : bb / 12.92;
  let x = (rr * 0.4124564 + gg * 0.3575761 + bb * 0.1804375) / 0.95047;
  let y = rr * 0.2126729 + gg * 0.7151522 + bb * 0.072175;
  let z = (rr * 0.0193339 + gg * 0.119192 + bb * 0.9503041) / 1.08883;
  x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
  y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
  z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
  return { l: 116 * y - 16, a: 500 * (x - y), b: 200 * (y - z) };
}

function deltaE(a: { l: number; a: number; b: number }, b2: { l: number; a: number; b: number }) {
  return Math.sqrt((a.l - b2.l) ** 2 + (a.a - b2.a) ** 2 + (a.b - b2.b) ** 2);
}

function mkColor(id: string, name: string, code: string, hex: string, brand: string, brandDisplay: string, collection?: string, lrv?: number): CatalogColor {
  const rgb = hexToRgb(hex);
  return { id, name, code, hex, brand, brandDisplay, collection, lrv, rgb, lab: rgbToLab(rgb.r, rgb.g, rgb.b) };
}

function matchQuality(d: number) {
  if (d < 3) return { label: "Exact Match", cls: "bg-blue-100 text-blue-700" };
  if (d < 6) return { label: "Very Close", cls: "bg-sky-100 text-sky-700" };
  if (d < 10) return { label: "Close Match", cls: "bg-amber-100 text-amber-700" };
  if (d < 20) return { label: "Similar", cls: "bg-orange-100 text-orange-700" };
  return { label: "Approximate", cls: "bg-red-100 text-red-600" };
}

// ─── PAINT CATALOG (6 Brands, 200+ Colors) ──────────────────────────────────

const C = mkColor;
const CATALOG: CatalogColor[] = [
  // SHERWIN-WILLIAMS
  C("sw-7006","Extra White","SW 7006","#F1EDE3","sherwin-williams","Sherwin-Williams","Whites",86),
  C("sw-7008","Alabaster","SW 7008","#F3EDE0","sherwin-williams","Sherwin-Williams","Whites",82),
  C("sw-7012","Creamy","SW 7012","#F4EBD7","sherwin-williams","Sherwin-Williams","Whites",81),
  C("sw-7015","Repose Gray","SW 7015","#C2BDB6","sherwin-williams","Sherwin-Williams","Neutrals",58),
  C("sw-7016","Mindful Gray","SW 7016","#BCB7AE","sherwin-williams","Sherwin-Williams","Neutrals",48),
  C("sw-7029","Agreeable Gray","SW 7029","#D0CBC2","sherwin-williams","Sherwin-Williams","Neutrals",60),
  C("sw-7036","Accessible Beige","SW 7036","#D2C8B7","sherwin-williams","Sherwin-Williams","Neutrals",58),
  C("sw-7043","Worldly Gray","SW 7043","#B5AFA5","sherwin-williams","Sherwin-Williams","Neutrals",43),
  C("sw-7048","Urbane Bronze","SW 7048","#594A3C","sherwin-williams","Sherwin-Williams","Neutrals",8),
  C("sw-6119","Antique White","SW 6119","#F5EAD6","sherwin-williams","Sherwin-Williams","Whites",79),
  C("sw-6126","Navajo White","SW 6126","#F5DFC4","sherwin-williams","Sherwin-Williams","Oranges",71),
  C("sw-6128","Blonde","SW 6128","#F4DDB4","sherwin-williams","Sherwin-Williams","Yellows",71),
  C("sw-6140","Moderate White","SW 6140","#EDE8D9","sherwin-williams","Sherwin-Williams","Whites",75),
  C("sw-6148","Wool Skein","SW 6148","#E2D9C6","sherwin-williams","Sherwin-Williams","Neutrals",63),
  C("sw-6204","Sea Salt","SW 6204","#CDD6CF","sherwin-williams","Sherwin-Williams","Greens",63),
  C("sw-6211","Rainwashed","SW 6211","#C3D4CD","sherwin-williams","Sherwin-Williams","Greens",59),
  C("sw-6217","Topsail","SW 6217","#E2EBE6","sherwin-williams","Sherwin-Williams","Greens",78),
  C("sw-6230","Rainstorm","SW 6230","#1E4A5C","sherwin-williams","Sherwin-Williams","Blues",7),
  C("sw-6243","Distance","SW 6243","#6B90A1","sherwin-williams","Sherwin-Williams","Blues",27),
  C("sw-6244","Naval","SW 6244","#21314D","sherwin-williams","Sherwin-Williams","Blues",4),
  C("sw-6258","Tricorn Black","SW 6258","#2B2B2B","sherwin-williams","Sherwin-Williams","Blacks",3),
  C("sw-6476","Glimmer","SW 6476","#D3E6E2","sherwin-williams","Sherwin-Williams","Greens",69),
  C("sw-6478","Watery","SW 6478","#BDD9D3","sherwin-williams","Sherwin-Williams","Greens",57),
  C("sw-7069","Iron Ore","SW 7069","#434343","sherwin-williams","Sherwin-Williams","Blacks",6),
  C("sw-9170","Acacia Haze","SW 9170","#A7B4A3","sherwin-williams","Sherwin-Williams","Greens",40),
  C("sw-9176","Livable Green","SW 9176","#C5CFBD","sherwin-williams","Sherwin-Williams","Greens",55),
  C("sw-7064","Passive","SW 7064","#C9C9C5","sherwin-williams","Sherwin-Williams","Neutrals",55),
  C("sw-6990","Caviar","SW 6990","#343434","sherwin-williams","Sherwin-Williams","Blacks",4),
  C("sw-7014","Eider White","SW 7014","#E7E3DA","sherwin-williams","Sherwin-Williams","Whites",73),
  C("sw-7631","City Loft","SW 7631","#DDD8CB","sherwin-williams","Sherwin-Williams","Neutrals",64),
  C("sw-7641","Colonnade Gray","SW 7641","#BEB9AC","sherwin-williams","Sherwin-Williams","Neutrals",48),
  C("sw-7674","Peppercorn","SW 7674","#5A5653","sherwin-williams","Sherwin-Williams","Neutrals",10),
  C("sw-0055","Light French Gray","SW 0055","#C7C4BE","sherwin-williams","Sherwin-Williams","Neutrals",53),
  C("sw-6385","Dover White","SW 6385","#F0E8D4","sherwin-williams","Sherwin-Williams","Whites",78),

  // BENJAMIN MOORE
  C("bm-oc-17","White Dove","OC-17","#F3EEE0","benjamin-moore","Benjamin Moore","Whites",85),
  C("bm-oc-20","Pale Oak","OC-20","#E6DDD0","benjamin-moore","Benjamin Moore","Neutrals",69),
  C("bm-oc-45","Swiss Coffee","OC-45","#F2EBDD","benjamin-moore","Benjamin Moore","Whites",81),
  C("bm-oc-65","Chantilly Lace","OC-65","#F5F2EA","benjamin-moore","Benjamin Moore","Whites",90),
  C("bm-oc-130","Cloud White","OC-130","#F2EDE0","benjamin-moore","Benjamin Moore","Whites",85),
  C("bm-hc-172","Revere Pewter","HC-172","#CCC6B5","benjamin-moore","Benjamin Moore","Neutrals",55),
  C("bm-hc-80","Bleeker Beige","HC-80","#CFC5AE","benjamin-moore","Benjamin Moore","Neutrals",54),
  C("bm-hc-170","Stonington Gray","HC-170","#BAB9B5","benjamin-moore","Benjamin Moore","Grays",49),
  C("bm-hc-168","Chelsea Gray","HC-168","#918E86","benjamin-moore","Benjamin Moore","Grays",28),
  C("bm-hc-173","Edgecomb Gray","HC-173","#D7CFC1","benjamin-moore","Benjamin Moore","Grays",63),
  C("bm-hc-163","Kendall Charcoal","HC-163","#6B6B68","benjamin-moore","Benjamin Moore","Grays",15),
  C("bm-2163-10","Black","2163-10","#323232","benjamin-moore","Benjamin Moore","Blacks",4),
  C("bm-2164-10","Wrought Iron","2164-10","#474742","benjamin-moore","Benjamin Moore","Blacks",7),
  C("bm-2124-10","Hale Navy","2124-10","#3D4655","benjamin-moore","Benjamin Moore","Blues",7),
  C("bm-1479","Quiet Moments","1479","#CAD4D0","benjamin-moore","Benjamin Moore","Greens",58),
  C("bm-1571","Sea Foam","1571","#D5E5DF","benjamin-moore","Benjamin Moore","Greens",71),
  C("bm-1582","Palladian Blue","1582","#C3D3CE","benjamin-moore","Benjamin Moore","Greens",56),
  C("bm-af-685","Thunder","AF-685","#646260","benjamin-moore","Benjamin Moore","Grays",13),
  C("bm-2167-50","Gray Owl","2167-50","#BEC3BC","benjamin-moore","Benjamin Moore","Grays",51),
  C("bm-2137-70","Balboa Mist","2137-70","#DDD9CD","benjamin-moore","Benjamin Moore","Neutrals",67),
  C("bm-2163-40","Iron Mountain","2163-40","#78756F","benjamin-moore","Benjamin Moore","Grays",20),
  C("bm-2116-70","Horizon","2116-70","#D7DDD8","benjamin-moore","Benjamin Moore","Greens",68),
  C("bm-2062-70","Collingwood","2062-70","#DCD4C7","benjamin-moore","Benjamin Moore","Neutrals",63),

  // BEHR (Home Depot)
  C("behr-n520-1","White Metal","N520-1","#E4E3DE","behr","Behr","Neutrals",76),
  C("behr-n520-2","Silver Drop","N520-2","#D0CFCA","behr","Behr","Neutrals",62),
  C("behr-ppu24-14","Dolphin Fin","PPU24-14","#C9C4BC","behr","Behr","Neutrals",53),
  C("behr-ppu18-08","Cracked Pepper","PPU18-08","#605E5E","behr","Behr","Grays",12),
  C("behr-n530-3","Pewter","N530-3","#ABA9A6","behr","Behr","Grays",39),
  C("behr-s380-1","Moss Mist","S380-1","#E5E4DB","behr","Behr","Greens",74),
  C("behr-s430-3","Garden Vista","S430-3","#A4B3A9","behr","Behr","Greens",42),
  C("behr-s540-7","Navy Blue","S540-7","#3D5271","behr","Behr","Blues",10),
  C("behr-ppu10-14","Ivory Keys","PPU10-14","#EBE4D6","behr","Behr","Whites",75),
  C("behr-ppu7-09","Toasted Pecan","PPU7-09","#C8B89F","behr","Behr","Neutrals",48),
  C("behr-ppu7-10","Cafe Latte","PPU7-10","#C3B49E","behr","Behr","Neutrals",46),
  C("behr-750e-2","Smoked Oyster","750E-2","#D4CEC5","behr","Behr","Neutrals",60),
  C("behr-ppu26-10","French Silver","PPU26-10","#C5C5C3","behr","Behr","Grays",53),
  C("behr-ppu26-18","Graceful Gray","PPU26-18","#DFDEDC","behr","Behr","Grays",72),
  C("behr-ppu18-06","Elephant Skin","PPU18-06","#7E7B78","behr","Behr","Grays",20),
  C("behr-n170-1","Mocha Foam","N170-1","#ECDFD2","behr","Behr","Neutrals",74),
  C("behr-ecc-10-2","Jet Black","ECC-10-2","#2E2E2E","behr","Behr","Blacks",3),
  C("behr-bxc-02","Frost","BXC-02","#ECEAE5","behr","Behr","Whites",80),
  C("behr-m240-7","Cascade","M240-7","#2B4A67","behr","Behr","Blues",8),
  C("behr-m530-6","Sophisticated Navy","M530-6","#3B536C","behr","Behr","Blues",10),
  C("behr-m530-4","Washed Denim","M530-4","#8199AD","behr","Behr","Blues",30),
  C("behr-s520-4","Breezy Blue","S520-4","#90ABB7","behr","Behr","Blues",36),
  C("behr-s500-2","Breathless","S500-2","#CDD8D7","behr","Behr","Greens",62),
  C("behr-s400-3","Minted Lemon","S400-3","#B9C5A8","behr","Behr","Greens",50),
  C("behr-s190-4","Spiced Brandy","S190-4","#C5A489","behr","Behr","Oranges",40),
  C("behr-s170-4","Retro Pink","S170-4","#C9A197","behr","Behr","Reds",39),
  C("behr-dc-003","Blank Canvas","DC-003","#F3EEE2","behr","Behr","Whites",84),
  C("behr-ppu25-12","Dusty Lilac","PPU25-12","#C0B9BD","behr","Behr","Purples",47),
  C("behr-ppu13-12","Lemon Balm","PPU13-12","#DFD9A8","behr","Behr","Yellows",65),
  C("behr-s110-3","Coral Sunset","S110-3","#D8B1A1","behr","Behr","Reds",48),
  C("behr-w-b-110","Cider Spice","W-B-110","#C4A072","behr","Behr","Oranges",38),

  // PPG
  C("ppg-1025-1","Gypsum","PPG1025-1","#F0EBE2","ppg","PPG","Neutrals",81),
  C("ppg-1025-3","Whiskers","PPG1025-3","#D1CBC0","ppg","PPG","Neutrals",57),
  C("ppg-1001-3","Thin Ice","PPG1001-3","#D1D1CD","ppg","PPG","Grays",60),
  C("ppg-1001-5","Dover Gray","PPG1001-5","#A1A29E","ppg","PPG","Grays",35),
  C("ppg-1001-6","Atlantic Fog","PPG1001-6","#8C8D89","ppg","PPG","Grays",26),
  C("ppg-1040-3","Pine Frost","PPG1040-3","#C5D0C7","ppg","PPG","Greens",55),
  C("ppg-1040-4","Lime Daiquiri","PPG1040-4","#A8BAA9","ppg","PPG","Greens",44),
  C("ppg-1033-1","Delicate White","PPG1033-1","#F4EFE4","ppg","PPG","Whites",85),

  // VALSPAR (Lowe's)
  C("val-7002-1","Du Jour","7002-1","#F2EDE3","valspar","Valspar","Neutrals",82),
  C("val-7003-1","Swiss Cream","7003-1","#F5F0E4","valspar","Valspar","Whites",85),
  C("val-7003-3","Oatbran","7003-3","#D8D0C1","valspar","Valspar","Neutrals",61),
  C("val-7004-1","Filtered Shade","7004-1","#E7E6E2","valspar","Valspar","Grays",76),
  C("val-7004-3","Harbor Mist","7004-3","#BEBDBA","valspar","Valspar","Grays",49),
  C("val-5002-1b","Light Blue","5002-1B","#E0E9EA","valspar","Valspar","Blues",77),
  C("val-5002-2a","Seaspray","5002-2A","#C5D5D7","valspar","Valspar","Blues",62),
  C("val-5003-1b","Moonlight Hush","5003-1B","#E3E9E7","valspar","Valspar","Greens",77),
  C("val-6002-2a","Seafoam Storm","6002-2A","#C1D2CE","valspar","Valspar","Greens",59),
  C("val-6003-3a","Pine Forest","6003-3A","#6E8C74","valspar","Valspar","Greens",24),
  C("val-5001-3b","Stormy Cove","5001-3B","#8F9EA5","valspar","Valspar","Blues",33),
  C("val-5001-5b","Deep Twilight","5001-5B","#354E62","valspar","Valspar","Blues",8),
  C("val-5004-2a","Gentle Wave","5004-2A","#B6C8CE","valspar","Valspar","Blues",53),
  C("val-3007-3a","La Fonda Mango","3007-3A","#D4A76D","valspar","Valspar","Oranges",42),
  C("val-2007-3a","Berry Blush","2007-3A","#C59C9A","valspar","Valspar","Reds",39),
  C("val-2003-3b","Dusty Rose","2003-3B","#C8A6A4","valspar","Valspar","Reds",42),
  C("val-4005-2b","Sable Calm","4005-2B","#474544","valspar","Valspar","Blacks",6),
  C("val-3005-1b","Honeymilk","3005-1B","#F3EAD7","valspar","Valspar","Whites",81),
  C("val-6006-1b","Sage Brush","6006-1B","#D4D7C9","valspar","Valspar","Greens",63),
  C("val-8003-2b","Lilac Lane","8003-2B","#C9BFD0","valspar","Valspar","Purples",50),
  C("val-3001-3a","Warm Butterscotch","3001-3A","#C7A96E","valspar","Valspar","Yellows",42),

  // ACE HARDWARE (Clark+Kensington)
  C("ace-n-c1","Cake Batter","N-C1","#F5F0E5","ace","Clark+Kensington","Whites",85),
  C("ace-n-c3","Antique Linen","N-C3","#E3DBC8","ace","Clark+Kensington","Neutrals",68),
  C("ace-n-c5","Worn Leather","N-C5","#B4A78F","ace","Clark+Kensington","Neutrals",40),
  C("ace-n-c7","Dark Roast","N-C7","#5C5043","ace","Clark+Kensington","Neutrals",9),
  C("ace-gn1","Whisper of Sage","GN-1","#D5DBC9","ace","Clark+Kensington","Greens",63),
  C("ace-gn2","Meadow Mist","GN-2","#BAC7AC","ace","Clark+Kensington","Greens",50),
  C("ace-gn3","Toscana","GN-3","#8CA07A","ace","Clark+Kensington","Greens",33),
  C("ace-gn4","Forest Retreat","GN-4","#5F7757","ace","Clark+Kensington","Greens",18),
  C("ace-bl1","Morning Mist","BL-1","#D9E3E6","ace","Clark+Kensington","Blues",73),
  C("ace-bl2","Serene Stream","BL-2","#B4C8D0","ace","Clark+Kensington","Blues",54),
  C("ace-bl3","Coastal Fog","BL-3","#8BA7B5","ace","Clark+Kensington","Blues",37),
  C("ace-bl4","Ocean Floor","BL-4","#4D6D7E","ace","Clark+Kensington","Blues",16),
  C("ace-bl5","Midnight Navy","BL-5","#2E4251","ace","Clark+Kensington","Blues",6),
  C("ace-gr1","Silver Screen","GR-1","#E2E2E0","ace","Clark+Kensington","Grays",73),
  C("ace-gr3","Charcoal Heather","GR-3","#9C9A97","ace","Clark+Kensington","Grays",32),
  C("ace-gr5","Black Sesame","GR-5","#3C3A38","ace","Clark+Kensington","Blacks",4),
  C("ace-rd1","Blushing Peach","RD-1","#E5C4B6","ace","Clark+Kensington","Reds",55),
  C("ace-rd2","Terra Cotta","RD-2","#C08B73","ace","Clark+Kensington","Reds",30),
  C("ace-rd3","Autumn Leaves","RD-3","#A66049","ace","Clark+Kensington","Reds",16),
  C("ace-yw1","Soft Buttercream","YW-1","#F2E8CC","ace","Clark+Kensington","Yellows",78),
  C("ace-yw2","Honey Wheat","YW-2","#DECE9E","ace","Clark+Kensington","Yellows",62),
  C("ace-yw3","Amber Gold","YW-3","#C7AD6E","ace","Clark+Kensington","Yellows",43),
  C("ace-pr1","Lavender Sachet","PR-1","#D8CEE0","ace","Clark+Kensington","Purples",58),
  C("ace-pr2","Plum Shadow","PR-2","#7E6484","ace","Clark+Kensington","Purples",15),
];

const BRANDS: Record<string, { name: string; store: string }> = {
  "sherwin-williams": { name: "Sherwin-Williams", store: "https://www.sherwin-williams.com/en-us/color/" },
  "benjamin-moore": { name: "Benjamin Moore", store: "https://www.benjaminmoore.com/en-us/paint-colors/" },
  "behr": { name: "Behr (Home Depot)", store: "https://www.behr.com/consumer/colors/paint-colors/" },
  "ppg": { name: "PPG", store: "https://www.ppgpaints.com/color/" },
  "valspar": { name: "Valspar (Lowe's)", store: "https://www.valspar.com/en/colors/" },
  "ace": { name: "Clark+Kensington (Ace)", store: "https://www.acehardware.com/departments/paint-and-supplies/" },
};

function findByBrand(hex: string, limit = 3) {
  const tRgb = hexToRgb(hex);
  const tLab = rgbToLab(tRgb.r, tRgb.g, tRgb.b);
  const result: Record<string, (CatalogColor & { distance: number })[]> = {};
  for (const brand of Object.keys(BRANDS)) {
    const matches = CATALOG
      .filter(c => c.brand === brand)
      .map(c => ({ ...c, distance: deltaE(tLab, c.lab) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
    result[brand] = matches;
  }
  return result;
}

// ─── COLOR FAMILIES (for Visualizer palette) ─────────────────────────────────

const COLOR_FAMILIES = [
  { name: "Whites", filter: (c: CatalogColor) => c.collection === "Whites" || c.collection === "Off-White" },
  { name: "Grays", filter: (c: CatalogColor) => c.collection === "Grays" },
  { name: "Neutrals", filter: (c: CatalogColor) => c.collection === "Neutrals" },
  { name: "Blues", filter: (c: CatalogColor) => c.collection === "Blues" },
  { name: "Greens", filter: (c: CatalogColor) => c.collection === "Greens" },
  { name: "Reds", filter: (c: CatalogColor) => c.collection === "Reds" },
  { name: "Yellows", filter: (c: CatalogColor) => c.collection === "Yellows" },
  { name: "Oranges", filter: (c: CatalogColor) => c.collection === "Oranges" },
  { name: "Purples", filter: (c: CatalogColor) => c.collection === "Purples" },
  { name: "Blacks", filter: (c: CatalogColor) => c.collection === "Blacks" },
].map(f => ({ name: f.name, colors: CATALOG.filter(f.filter) })).filter(f => f.colors.length > 0);

// ═══════════════════════════════════════════════════════════════════════════════
// TOOL 1: COLOR MATCH
// ═══════════════════════════════════════════════════════════════════════════════

function ColorMatchTool({ onSelectColor, onBack }: { onSelectColor?: (c: CatalogColor) => void; onBack: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [scanned, setScanned] = useState<ScannedColor | null>(null);
  const [matches, setMatches] = useState<Record<string, (CatalogColor & { distance: number })[]> | null>(null);
  const [brandFilter, setBrandFilter] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [crosshair, setCrosshair] = useState({ x: 50, y: 50 });

  const startCam = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", width: 640, height: 480 } });
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); setStreaming(true); }
    } catch { setError("Camera access denied. Upload an image instead."); }
  }, []);

  const stopCam = useCallback(() => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null; setStreaming(false);
    }
  }, []);

  const extractColor = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number): ScannedColor => {
    const d = ctx.getImageData(x - 5, y - 5, 10, 10).data;
    let r = 0, g = 0, b = 0, n = 0;
    for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; n++; }
    r = Math.round(r / n); g = Math.round(g / n); b = Math.round(b / n);
    return { hex: `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`.toUpperCase(), rgb: { r, g, b } };
  }, []);

  const capture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current, cv = canvasRef.current, ctx = cv.getContext("2d");
    if (!ctx) return;
    cv.width = v.videoWidth; cv.height = v.videoHeight; ctx.drawImage(v, 0, 0);
    const color = extractColor(ctx, Math.round((crosshair.x / 100) * cv.width), Math.round((crosshair.y / 100) * cv.height));
    setScanned(color); setMatches(findByBrand(color.hex)); setBrandFilter(null);
  }, [crosshair, extractColor]);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const img = new Image();
    img.onload = () => {
      if (!canvasRef.current) return;
      const cv = canvasRef.current, ctx = cv.getContext("2d"); if (!ctx) return;
      cv.width = img.width; cv.height = img.height; ctx.drawImage(img, 0, 0);
      const color = extractColor(ctx, Math.round(img.width / 2), Math.round(img.height / 2));
      setScanned(color); setMatches(findByBrand(color.hex)); setBrandFilter(null); stopCam();
    };
    img.src = URL.createObjectURL(file);
  }, [extractColor, stopCam]);

  const reset = useCallback(() => { setScanned(null); setMatches(null); setBrandFilter(null); if (fileRef.current) fileRef.current.value = ""; }, []);

  useEffect(() => { if (!scanned) startCam(); return () => stopCam(); }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center"><ChevronLeft className="w-5 h-5 text-slate-600" /></button>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center"><ScanLine className="w-5 h-5 text-amber-600" /></div>
          <h2 className="text-lg font-bold text-slate-900">Color Match</h2>
        </div>
      </div>

      {!scanned ? (
        <>
          <div className="relative bg-black rounded-2xl overflow-hidden aspect-video cursor-crosshair" onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setCrosshair({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); }}>
            <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
            {streaming && <div className="absolute pointer-events-none" style={{ left: `${crosshair.x}%`, top: `${crosshair.y}%`, transform: "translate(-50%, -50%)" }}><Crosshair className="w-12 h-12 text-white drop-shadow-lg animate-pulse" /></div>}
            {!streaming && !error && <div className="absolute inset-0 flex items-center justify-center"><RefreshCw className="w-8 h-8 text-white animate-spin" /></div>}
            {error && <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/50 p-4 text-center"><Camera className="w-12 h-12 text-slate-400 mb-3" /><p className="text-sm text-slate-300">{error}</p></div>}
          </div>
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex gap-3">
            <button onClick={capture} disabled={!streaming} className="flex-1 h-11 rounded-xl bg-slate-900 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40"><Camera className="w-4 h-4" />Capture Color</button>
            <button onClick={() => fileRef.current?.click()} className="flex-1 h-11 rounded-xl border-2 border-slate-200 text-slate-700 text-sm font-semibold flex items-center justify-center gap-2"><Upload className="w-4 h-4" />Upload Image</button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </div>
          <p className="text-xs text-slate-400 text-center">Point your camera at any color and tap to position the crosshair, then capture. We'll match it to paint from top brands.</p>
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="w-16 h-16 rounded-xl shadow-lg border-4 border-white" style={{ backgroundColor: scanned.hex }} />
            <div className="flex-1">
              <p className="text-xs text-slate-400">Scanned Color</p>
              <p className="text-xl font-mono font-bold text-slate-900">{scanned.hex}</p>
              <p className="text-xs text-slate-400">RGB({scanned.rgb.r}, {scanned.rgb.g}, {scanned.rgb.b})</p>
            </div>
            <button onClick={reset} className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center"><RefreshCw className="w-4 h-4 text-slate-600" /></button>
          </div>

          {matches && (
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2"><Palette className="w-4 h-4 text-indigo-500" />Matches by Store</h3>
              <div className="flex flex-wrap gap-2">
                {Object.keys(BRANDS).map(b => (
                  <button key={b} onClick={() => setBrandFilter(brandFilter === b ? null : b)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${brandFilter === b ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>
                    {BRANDS[b].name.split(" ")[0]}
                  </button>
                ))}
              </div>
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {Object.entries(matches).filter(([b]) => !brandFilter || b === brandFilter).map(([brand, colors]) => (
                  <div key={brand} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-500">{BRANDS[brand].name}</p>
                      <a href={BRANDS[brand].store} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-500 flex items-center gap-1"><Store className="w-3 h-3" />Store<ExternalLink className="w-2.5 h-2.5" /></a>
                    </div>
                    {colors.map(color => {
                      const q = matchQuality(color.distance);
                      return (
                        <div key={color.id} onClick={() => onSelectColor?.(color)} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                          <div className="w-11 h-11 rounded-lg shadow border-2 border-white flex-shrink-0" style={{ backgroundColor: color.hex }} />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 text-sm truncate">{color.name}</p>
                            <p className="text-xs text-slate-400">{color.code}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${q.cls}`}>{q.label}</span>
                            <p className="text-[10px] text-slate-400 mt-0.5">{color.distance.toFixed(1)} ΔE</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={reset} className="flex-1 h-11 rounded-xl border-2 border-slate-200 text-slate-700 text-sm font-semibold flex items-center justify-center gap-2"><Camera className="w-4 h-4" />Scan Another</button>
            <button onClick={onBack} className="flex-1 h-11 rounded-xl bg-slate-900 text-white text-sm font-semibold flex items-center justify-center gap-2"><Check className="w-4 h-4" />Done</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOOL 2: ROOM VISUALIZER
// ═══════════════════════════════════════════════════════════════════════════════

function RoomVisualizerTool({ initialColor, onBack }: { initialColor?: { hex: string; name: string }; onBack: () => void }) {
  const [uploaded, setUploaded] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ hex: string; name: string } | null>(initialColor || null);
  const [intensity, setIntensity] = useState(50);
  const [processed, setProcessed] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setUploaded(ev.target?.result as string); setProcessed(null); };
    reader.readAsDataURL(file);
  };

  const apply = () => {
    if (!canvasRef.current || !uploaded || !selected) return;
    const cv = canvasRef.current, ctx = cv.getContext("2d"); if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      cv.width = img.width; cv.height = img.height;
      ctx.drawImage(img, 0, 0);
      ctx.globalCompositeOperation = "multiply"; ctx.globalAlpha = intensity / 100;
      ctx.fillStyle = selected.hex; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
      setProcessed(cv.toDataURL("image/jpeg", 0.9));
    };
    img.src = uploaded;
  };

  useEffect(() => { if (uploaded && selected && processed) apply(); }, [intensity]);

  const download = () => {
    if (!processed) return;
    const a = document.createElement("a"); a.download = `color-preview-${selected?.name || "custom"}.jpg`; a.href = processed; a.click();
  };

  const reset = () => { setUploaded(null); setProcessed(null); setSelected(initialColor || null); setIntensity(50); };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center"><ChevronLeft className="w-5 h-5 text-slate-600" /></button>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center"><Paintbrush className="w-5 h-5 text-indigo-600" /></div>
          <h2 className="text-lg font-bold text-slate-900">Room Visualizer</h2>
        </div>
      </div>

      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-300">
        {processed ? <img src={processed} alt="Preview" className="w-full h-full object-cover" />
          : uploaded ? <img src={uploaded} alt="Wall" className="w-full h-full object-cover" />
          : <div className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer" onClick={() => fileRef.current?.click()}>
              <Camera className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">Upload a photo of your wall</p>
              <p className="text-slate-400 text-sm mt-1">Tap to browse</p>
            </div>}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />

      {uploaded && (
        <div className="flex gap-2">
          <button onClick={() => fileRef.current?.click()} className="flex-1 h-10 rounded-xl border-2 border-slate-200 text-slate-600 text-sm font-semibold flex items-center justify-center gap-2"><Upload className="w-4 h-4" />Change</button>
          <button onClick={reset} className="w-10 h-10 rounded-xl border-2 border-slate-200 flex items-center justify-center"><RotateCcw className="w-4 h-4 text-slate-600" /></button>
          {processed && <button onClick={download} className="w-10 h-10 rounded-xl border-2 border-slate-200 flex items-center justify-center"><Download className="w-4 h-4 text-slate-600" /></button>}
        </div>
      )}

      {selected && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200">
          <div className="w-10 h-10 rounded-lg shadow border border-slate-200" style={{ backgroundColor: selected.hex }} />
          <div className="flex-1"><p className="font-medium text-slate-900 text-sm">{selected.name}</p><p className="text-xs text-slate-400">{selected.hex}</p></div>
        </div>
      )}

      {uploaded && selected && (
        <>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-slate-600 font-medium">Intensity</span><span className="text-slate-400">{intensity}%</span></div>
            <input type="range" min={10} max={90} step={5} value={intensity} onChange={e => setIntensity(Number(e.target.value))} className="w-full accent-indigo-600" />
          </div>
          <button onClick={apply} className="w-full h-11 rounded-xl bg-indigo-600 text-white text-sm font-semibold flex items-center justify-center gap-2"><Paintbrush className="w-4 h-4" />Apply Color</button>
        </>
      )}

      <div className="space-y-3">
        <h3 className="font-medium text-slate-900 flex items-center gap-2 text-sm"><Palette className="w-4 h-4" />Select a Color<span className="text-xs text-slate-400 ml-auto">{CATALOG.length} colors</span></h3>
        <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
          {COLOR_FAMILIES.map(fam => (
            <div key={fam.name} className="space-y-1.5">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{fam.name}</p>
              <div className="flex flex-wrap gap-1">
                {fam.colors.map(c => (
                  <button key={c.id} onClick={() => setSelected({ hex: c.hex, name: `${c.name} — ${c.brandDisplay}` })}
                    className={`w-8 h-8 rounded-lg shadow-sm border-2 transition-all hover:scale-110 ${selected?.hex === c.hex ? "border-indigo-500 ring-2 ring-indigo-300" : "border-slate-200"}`}
                    style={{ backgroundColor: c.hex }} title={`${c.name} — ${c.brandDisplay}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOOL 3: SQUARE FOOTAGE ESTIMATOR
// ═══════════════════════════════════════════════════════════════════════════════

const COVERAGE_PER_GALLON = 350;
const PRICE_PER_GALLON = 45;

function SqftEstimatorTool({ onBack }: { onBack: () => void }) {
  const [rooms, setRooms] = useState<Room[]>([
    { id: "1", name: "Room 1", length: "", width: "", height: "8", doors: 1, windows: 1 },
  ]);
  const [coats, setCoats] = useState(2);
  const [includeCeiling, setIncludeCeiling] = useState(false);

  const addRoom = () => {
    setRooms(prev => [...prev, { id: String(Date.now()), name: `Room ${prev.length + 1}`, length: "", width: "", height: "8", doors: 1, windows: 1 }]);
  };

  const removeRoom = (id: string) => { if (rooms.length > 1) setRooms(prev => prev.filter(r => r.id !== id)); };

  const updateRoom = (id: string, field: keyof Room, value: string | number) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const calc = rooms.map(room => {
    const l = parseFloat(room.length) || 0;
    const w = parseFloat(room.width) || 0;
    const h = parseFloat(room.height) || 0;
    const wallArea = 2 * (l + w) * h;
    const doorDeduction = room.doors * 21;
    const windowDeduction = room.windows * 15;
    const paintableWall = Math.max(0, wallArea - doorDeduction - windowDeduction);
    const ceilingArea = includeCeiling ? l * w : 0;
    const totalArea = paintableWall + ceilingArea;
    const withCoats = totalArea * coats;
    const gallons = withCoats > 0 ? Math.ceil(withCoats / COVERAGE_PER_GALLON) : 0;
    return { ...room, wallArea, paintableWall, ceilingArea, totalArea, withCoats, gallons, sqft: l * w };
  });

  const totals = {
    sqft: calc.reduce((s, r) => s + r.sqft, 0),
    paintableArea: calc.reduce((s, r) => s + r.totalArea, 0),
    withCoats: calc.reduce((s, r) => s + r.withCoats, 0),
    gallons: calc.reduce((s, r) => s + r.gallons, 0),
    cost: calc.reduce((s, r) => s + r.gallons, 0) * PRICE_PER_GALLON,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center"><ChevronLeft className="w-5 h-5 text-slate-600" /></button>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center"><Calculator className="w-5 h-5 text-violet-600" /></div>
          <h2 className="text-lg font-bold text-slate-900">Paint Estimator</h2>
        </div>
      </div>

      <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Coats:</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setCoats(Math.max(1, coats - 1))} className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center"><Minus className="w-3 h-3" /></button>
            <span className="w-6 text-center font-bold text-slate-900">{coats}</span>
            <button onClick={() => setCoats(Math.min(4, coats + 1))} className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center"><Plus className="w-3 h-3" /></button>
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={includeCeiling} onChange={e => setIncludeCeiling(e.target.checked)} className="w-4 h-4 rounded accent-violet-600" />
          <span className="text-slate-500">Include ceilings</span>
        </label>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {rooms.map((room, idx) => (
          <div key={room.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-violet-500" />
                <input value={room.name} onChange={e => updateRoom(room.id, "name", e.target.value)}
                  className="font-semibold text-slate-900 text-sm bg-transparent border-0 outline-none w-32" />
              </div>
              {rooms.length > 1 && <button onClick={() => removeRoom(room.id)} className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center"><X className="w-3.5 h-3.5 text-red-400" /></button>}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Length (ft)</label>
                <input type="number" value={room.length} onChange={e => updateRoom(room.id, "length", e.target.value)} placeholder="0" className="w-full h-9 rounded-lg border border-slate-200 px-2 text-sm text-center font-medium" />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Width (ft)</label>
                <input type="number" value={room.width} onChange={e => updateRoom(room.id, "width", e.target.value)} placeholder="0" className="w-full h-9 rounded-lg border border-slate-200 px-2 text-sm text-center font-medium" />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Height (ft)</label>
                <input type="number" value={room.height} onChange={e => updateRoom(room.id, "height", e.target.value)} placeholder="8" className="w-full h-9 rounded-lg border border-slate-200 px-2 text-sm text-center font-medium" />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <DoorOpen className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-400">Doors</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => updateRoom(room.id, "doors", Math.max(0, room.doors - 1))} className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-xs">-</button>
                  <span className="w-5 text-center text-sm font-medium">{room.doors}</span>
                  <button onClick={() => updateRoom(room.id, "doors", room.doors + 1)} className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-xs">+</button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-400">Windows</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => updateRoom(room.id, "windows", Math.max(0, room.windows - 1))} className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-xs">-</button>
                  <span className="w-5 text-center text-sm font-medium">{room.windows}</span>
                  <button onClick={() => updateRoom(room.id, "windows", room.windows + 1)} className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-xs">+</button>
                </div>
              </div>
            </div>

            {calc[idx].totalArea > 0 && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <span>{Math.round(calc[idx].sqft)} sq ft floor</span>
                <span>{Math.round(calc[idx].paintableWall)} sq ft walls</span>
                <span className="font-semibold text-violet-600">{calc[idx].gallons} gal</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={addRoom} className="w-full h-10 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 text-sm font-semibold flex items-center justify-center gap-2"><Plus className="w-4 h-4" />Add Another Room</button>

      {totals.paintableArea > 0 && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 space-y-3">
          <h3 className="font-bold text-slate-900 flex items-center gap-2"><Calculator className="w-4 h-4 text-violet-600" />Estimate Summary</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white/80 text-center">
              <p className="text-2xl font-bold text-slate-900">{Math.round(totals.sqft)}</p>
              <p className="text-[11px] text-slate-500">Total Sq Ft (floor)</p>
            </div>
            <div className="p-3 rounded-xl bg-white/80 text-center">
              <p className="text-2xl font-bold text-slate-900">{Math.round(totals.paintableArea)}</p>
              <p className="text-[11px] text-slate-500">Paintable Area (sq ft)</p>
            </div>
            <div className="p-3 rounded-xl bg-white/80 text-center">
              <p className="text-2xl font-bold text-violet-600">{totals.gallons}</p>
              <p className="text-[11px] text-slate-500">Gallons Needed</p>
            </div>
            <div className="p-3 rounded-xl bg-white/80 text-center">
              <p className="text-2xl font-bold text-violet-600">${totals.cost}</p>
              <p className="text-[11px] text-slate-500">Est. Paint Cost</p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-2 rounded-lg bg-white/60 text-xs text-slate-500">
            <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-slate-400" />
            <span>{coats} coat{coats > 1 ? "s" : ""} at {COVERAGE_PER_GALLON} sq ft/gal coverage. Paint ~${PRICE_PER_GALLON}/gal (mid-range). Doors deducted at 21 sq ft, windows at 15 sq ft each.{includeCeiling ? " Includes ceilings." : ""}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN WIDGET (Home Screen + Tool Router)
// ═══════════════════════════════════════════════════════════════════════════════

type ToolView = "home" | "match" | "visualizer" | "estimator";

export default function ColorToolsWidget() {
  const [view, setView] = useState<ToolView>("home");
  const [passedColor, setPassedColor] = useState<{ hex: string; name: string } | undefined>();

  const handleColorFromScanner = (color: CatalogColor) => {
    setPassedColor({ hex: color.hex, name: color.name });
    setView("visualizer");
  };

  if (view === "match") return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto px-4 py-6"><ColorMatchTool onSelectColor={handleColorFromScanner} onBack={() => setView("home")} /></div>
    </div>
  );

  if (view === "visualizer") return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto px-4 py-6"><RoomVisualizerTool initialColor={passedColor} onBack={() => { setView("home"); setPassedColor(undefined); }} /></div>
    </div>
  );

  if (view === "estimator") return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto px-4 py-6"><SqftEstimatorTool onBack={() => setView("home")} /></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-lg mx-auto px-4 py-10 space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <Palette className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Color Tools</h1>
          <p className="text-sm text-slate-500">Find your perfect color, visualize it, and estimate your project</p>
        </div>

        <div className="space-y-3">
          {[
            { key: "match" as ToolView, icon: ScanLine, iconBg: "bg-amber-50", iconColor: "text-amber-600", title: "Color Match", desc: "Scan any color with your camera or upload a photo to find matching paint from Behr, Valspar, Ace, and more" },
            { key: "visualizer" as ToolView, icon: Paintbrush, iconBg: "bg-indigo-50", iconColor: "text-indigo-600", title: "Room Visualizer", desc: "Upload a photo of your wall and preview how different paint colors would look in your space" },
            { key: "estimator" as ToolView, icon: Calculator, iconBg: "bg-violet-50", iconColor: "text-violet-600", title: "Paint Estimator", desc: "Enter your room dimensions to calculate square footage, gallons needed, and estimated paint cost" },
          ].map(tool => (
            <button key={tool.key} onClick={() => setView(tool.key)} className="w-full p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow text-left flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl ${tool.iconBg} flex items-center justify-center shrink-0`}>
                <tool.icon className={`w-6 h-6 ${tool.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold text-slate-900">{tool.title}</h2>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">{tool.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400">Powered by PaintPros.io</p>
      </div>
    </div>
  );
}
