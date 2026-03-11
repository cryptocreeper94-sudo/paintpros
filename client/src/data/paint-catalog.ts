export interface CatalogColor {
  id: string;
  name: string;
  code: string;
  hex: string;
  brand: "sherwin-williams" | "benjamin-moore" | "behr" | "ppg" | "valspar" | "ace";
  brandDisplay: string;
  collection?: string;
  lrv?: number;
  rgb: { r: number; g: number; b: number };
  lab: { l: number; a: number; b: number };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

function rgbToLab(r: number, g: number, b: number): { l: number; a: number; b: number } {
  let rr = r / 255, gg = g / 255, bb = b / 255;
  
  rr = rr > 0.04045 ? Math.pow((rr + 0.055) / 1.055, 2.4) : rr / 12.92;
  gg = gg > 0.04045 ? Math.pow((gg + 0.055) / 1.055, 2.4) : gg / 12.92;
  bb = bb > 0.04045 ? Math.pow((bb + 0.055) / 1.055, 2.4) : bb / 12.92;
  
  let x = (rr * 0.4124564 + gg * 0.3575761 + bb * 0.1804375) / 0.95047;
  let y = (rr * 0.2126729 + gg * 0.7151522 + bb * 0.0721750);
  let z = (rr * 0.0193339 + gg * 0.1191920 + bb * 0.9503041) / 1.08883;
  
  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;
  
  return {
    l: (116 * y) - 16,
    a: 500 * (x - y),
    b: 200 * (y - z)
  };
}

function createColor(
  id: string,
  name: string,
  code: string,
  hex: string,
  brand: CatalogColor["brand"],
  brandDisplay: string,
  collection?: string,
  lrv?: number
): CatalogColor {
  const rgb = hexToRgb(hex);
  const lab = rgbToLab(rgb.r, rgb.g, rgb.b);
  return { id, name, code, hex, brand, brandDisplay, collection, lrv, rgb, lab };
}

export const PAINT_CATALOG: CatalogColor[] = [
  // SHERWIN-WILLIAMS - Popular Colors
  createColor("sw-7006", "Extra White", "SW 7006", "#F1EDE3", "sherwin-williams", "Sherwin-Williams", "Whites", 86),
  createColor("sw-7008", "Alabaster", "SW 7008", "#F3EDE0", "sherwin-williams", "Sherwin-Williams", "Whites", 82),
  createColor("sw-7012", "Creamy", "SW 7012", "#F4EBD7", "sherwin-williams", "Sherwin-Williams", "Whites", 81),
  createColor("sw-7015", "Repose Gray", "SW 7015", "#C2BDB6", "sherwin-williams", "Sherwin-Williams", "Neutrals", 58),
  createColor("sw-7016", "Mindful Gray", "SW 7016", "#BCB7AE", "sherwin-williams", "Sherwin-Williams", "Neutrals", 48),
  createColor("sw-7029", "Agreeable Gray", "SW 7029", "#D0CBC2", "sherwin-williams", "Sherwin-Williams", "Neutrals", 60),
  createColor("sw-7036", "Accessible Beige", "SW 7036", "#D2C8B7", "sherwin-williams", "Sherwin-Williams", "Neutrals", 58),
  createColor("sw-7043", "Worldly Gray", "SW 7043", "#B5AFA5", "sherwin-williams", "Sherwin-Williams", "Neutrals", 43),
  createColor("sw-7044", "Amazing Gray", "SW 7044", "#A9A49B", "sherwin-williams", "Sherwin-Williams", "Neutrals", 37),
  createColor("sw-7048", "Urbane Bronze", "SW 7048", "#594A3C", "sherwin-williams", "Sherwin-Williams", "Neutrals", 8),
  createColor("sw-6119", "Antique White", "SW 6119", "#F5EAD6", "sherwin-williams", "Sherwin-Williams", "Whites", 79),
  createColor("sw-6126", "Navajo White", "SW 6126", "#F5DFC4", "sherwin-williams", "Sherwin-Williams", "Oranges", 71),
  createColor("sw-6128", "Blonde", "SW 6128", "#F4DDB4", "sherwin-williams", "Sherwin-Williams", "Yellows", 71),
  createColor("sw-6140", "Moderate White", "SW 6140", "#EDE8D9", "sherwin-williams", "Sherwin-Williams", "Whites", 75),
  createColor("sw-6148", "Wool Skein", "SW 6148", "#E2D9C6", "sherwin-williams", "Sherwin-Williams", "Neutrals", 63),
  createColor("sw-6204", "Sea Salt", "SW 6204", "#CDD6CF", "sherwin-williams", "Sherwin-Williams", "Greens", 63),
  createColor("sw-6211", "Rainwashed", "SW 6211", "#C3D4CD", "sherwin-williams", "Sherwin-Williams", "Greens", 59),
  createColor("sw-6217", "Topsail", "SW 6217", "#E2EBE6", "sherwin-williams", "Sherwin-Williams", "Greens", 78),
  createColor("sw-6230", "Rainstorm", "SW 6230", "#1E4A5C", "sherwin-williams", "Sherwin-Williams", "Blues", 7),
  createColor("sw-6243", "Distance", "SW 6243", "#6B90A1", "sherwin-williams", "Sherwin-Williams", "Blues", 27),
  createColor("sw-6244", "Naval", "SW 6244", "#21314D", "sherwin-williams", "Sherwin-Williams", "Blues", 4),
  createColor("sw-6258", "Tricorn Black", "SW 6258", "#2B2B2B", "sherwin-williams", "Sherwin-Williams", "Blacks", 3),
  createColor("sw-6476", "Glimmer", "SW 6476", "#D3E6E2", "sherwin-williams", "Sherwin-Williams", "Greens", 69),
  createColor("sw-6478", "Watery", "SW 6478", "#BDD9D3", "sherwin-williams", "Sherwin-Williams", "Greens", 57),
  createColor("sw-7069", "Iron Ore", "SW 7069", "#434343", "sherwin-williams", "Sherwin-Williams", "Neutrals", 6),
  createColor("sw-9170", "Acacia Haze", "SW 9170", "#A7B4A3", "sherwin-williams", "Sherwin-Williams", "Greens", 40),
  createColor("sw-9171", "Felted Wool", "SW 9171", "#B5B4A5", "sherwin-williams", "Sherwin-Williams", "Neutrals", 43),
  createColor("sw-9176", "Livable Green", "SW 9176", "#C5CFBD", "sherwin-williams", "Sherwin-Williams", "Greens", 55),
  createColor("sw-7064", "Passive", "SW 7064", "#C9C9C5", "sherwin-williams", "Sherwin-Williams", "Neutrals", 55),
  createColor("sw-6990", "Caviar", "SW 6990", "#343434", "sherwin-williams", "Sherwin-Williams", "Blacks", 4),
  createColor("sw-7014", "Eider White", "SW 7014", "#E7E3DA", "sherwin-williams", "Sherwin-Williams", "Whites", 73),
  createColor("sw-7631", "City Loft", "SW 7631", "#DDD8CB", "sherwin-williams", "Sherwin-Williams", "Neutrals", 64),
  createColor("sw-7641", "Colonnade Gray", "SW 7641", "#BEB9AC", "sherwin-williams", "Sherwin-Williams", "Neutrals", 48),
  createColor("sw-7642", "Pavestone", "SW 7642", "#A29D92", "sherwin-williams", "Sherwin-Williams", "Neutrals", 33),
  createColor("sw-7674", "Peppercorn", "SW 7674", "#5A5653", "sherwin-williams", "Sherwin-Williams", "Neutrals", 10),
  createColor("sw-0055", "Light French Gray", "SW 0055", "#C7C4BE", "sherwin-williams", "Sherwin-Williams", "Neutrals", 53),
  createColor("sw-9109", "Natural Linen", "SW 9109", "#E8DFD1", "sherwin-williams", "Sherwin-Williams", "Neutrals", 68),
  createColor("sw-6106", "Kilim Beige", "SW 6106", "#D3C3A7", "sherwin-williams", "Sherwin-Williams", "Neutrals", 51),
  createColor("sw-6385", "Dover White", "SW 6385", "#F0E8D4", "sherwin-williams", "Sherwin-Williams", "Whites", 78),
  createColor("sw-7070", "Site White", "SW 7070", "#EFEADB", "sherwin-williams", "Sherwin-Williams", "Whites", 76),
  
  // BENJAMIN MOORE - Popular Colors
  createColor("bm-oc-17", "White Dove", "OC-17", "#F3EEE0", "benjamin-moore", "Benjamin Moore", "Off-White", 85),
  createColor("bm-oc-20", "Pale Oak", "OC-20", "#E6DDD0", "benjamin-moore", "Benjamin Moore", "Off-White", 69),
  createColor("bm-oc-45", "Swiss Coffee", "OC-45", "#F2EBDD", "benjamin-moore", "Benjamin Moore", "Off-White", 81),
  createColor("bm-oc-65", "Chantilly Lace", "OC-65", "#F5F2EA", "benjamin-moore", "Benjamin Moore", "Whites", 90),
  createColor("bm-oc-130", "Cloud White", "OC-130", "#F2EDE0", "benjamin-moore", "Benjamin Moore", "Whites", 85),
  createColor("bm-oc-152", "Super White", "OC-152", "#FFFDF5", "benjamin-moore", "Benjamin Moore", "Whites", 93),
  createColor("bm-hc-172", "Revere Pewter", "HC-172", "#CCC6B5", "benjamin-moore", "Benjamin Moore", "Neutrals", 55),
  createColor("bm-hc-80", "Bleeker Beige", "HC-80", "#CFC5AE", "benjamin-moore", "Benjamin Moore", "Neutrals", 54),
  createColor("bm-hc-170", "Stonington Gray", "HC-170", "#BAB9B5", "benjamin-moore", "Benjamin Moore", "Grays", 49),
  createColor("bm-hc-168", "Chelsea Gray", "HC-168", "#918E86", "benjamin-moore", "Benjamin Moore", "Grays", 28),
  createColor("bm-hc-173", "Edgecomb Gray", "HC-173", "#D7CFC1", "benjamin-moore", "Benjamin Moore", "Grays", 63),
  createColor("bm-hc-163", "Kendall Charcoal", "HC-163", "#6B6B68", "benjamin-moore", "Benjamin Moore", "Grays", 15),
  createColor("bm-2163-10", "Black", "2163-10", "#323232", "benjamin-moore", "Benjamin Moore", "Blacks", 4),
  createColor("bm-2164-10", "Wrought Iron", "2164-10", "#474742", "benjamin-moore", "Benjamin Moore", "Blacks", 7),
  createColor("bm-2124-10", "Hale Navy", "2124-10", "#3D4655", "benjamin-moore", "Benjamin Moore", "Blues", 7),
  createColor("bm-1479", "Quiet Moments", "1479", "#CAD4D0", "benjamin-moore", "Benjamin Moore", "Greens", 58),
  createColor("bm-1571", "Sea Foam", "1571", "#D5E5DF", "benjamin-moore", "Benjamin Moore", "Greens", 71),
  createColor("bm-1582", "Palladian Blue", "1582", "#C3D3CE", "benjamin-moore", "Benjamin Moore", "Greens", 56),
  createColor("bm-af-685", "Thunder", "AF-685", "#646260", "benjamin-moore", "Benjamin Moore", "Grays", 13),
  createColor("bm-af-700", "Storm", "AF-700", "#9A9593", "benjamin-moore", "Benjamin Moore", "Grays", 32),
  createColor("bm-2155-70", "Barely There", "2155-70", "#E5DDD3", "benjamin-moore", "Benjamin Moore", "Neutrals", 69),
  createColor("bm-2108-70", "Calm", "2108-70", "#E3DFD5", "benjamin-moore", "Benjamin Moore", "Neutrals", 70),
  createColor("bm-2167-50", "Gray Owl", "2167-50", "#BEC3BC", "benjamin-moore", "Benjamin Moore", "Grays", 51),
  createColor("bm-2137-70", "Balboa Mist", "2137-70", "#DDD9CD", "benjamin-moore", "Benjamin Moore", "Neutrals", 67),
  createColor("bm-2163-40", "Iron Mountain", "2163-40", "#78756F", "benjamin-moore", "Benjamin Moore", "Grays", 20),
  createColor("bm-2111-70", "White Wisp", "2111-70", "#E8E5DC", "benjamin-moore", "Benjamin Moore", "Whites", 74),
  createColor("bm-2116-70", "Horizon", "2116-70", "#D7DDD8", "benjamin-moore", "Benjamin Moore", "Greens", 68),
  createColor("bm-2057-60", "Silver Gray", "2057-60", "#BFBAB2", "benjamin-moore", "Benjamin Moore", "Grays", 49),
  createColor("bm-2121-30", "Charcoal Slate", "2121-30", "#5C6163", "benjamin-moore", "Benjamin Moore", "Grays", 12),
  createColor("bm-2062-70", "Collingwood", "2062-70", "#DCD4C7", "benjamin-moore", "Benjamin Moore", "Neutrals", 63),
  
  // BEHR (Home Depot) - Popular Colors
  createColor("behr-n520-1", "White Metal", "N520-1", "#E4E3DE", "behr", "Behr", "Neutrals", 76),
  createColor("behr-n520-2", "Silver Drop", "N520-2", "#D0CFCA", "behr", "Behr", "Neutrals", 62),
  createColor("behr-ppu24-14", "Dolphin Fin", "PPU24-14", "#C9C4BC", "behr", "Behr", "Neutrals", 53),
  createColor("behr-ppu24-19", "Misty Morn", "PPU24-19", "#D5D1C8", "behr", "Behr", "Neutrals", 62),
  createColor("behr-ppu18-08", "Cracked Pepper", "PPU18-08", "#605E5E", "behr", "Behr", "Grays", 12),
  createColor("behr-ppu18-12", "Burnished Clay", "PPU18-12", "#AB9D92", "behr", "Behr", "Neutrals", 37),
  createColor("behr-n530-3", "Pewter", "N530-3", "#ABA9A6", "behr", "Behr", "Grays", 39),
  createColor("behr-n530-4", "Polished Stone", "N530-4", "#9B9895", "behr", "Behr", "Grays", 32),
  createColor("behr-s380-1", "Moss Mist", "S380-1", "#E5E4DB", "behr", "Behr", "Greens", 74),
  createColor("behr-s430-3", "Garden Vista", "S430-3", "#A4B3A9", "behr", "Behr", "Greens", 42),
  createColor("behr-s450-3", "Spring Stream", "S450-3", "#9AADAB", "behr", "Behr", "Greens", 40),
  createColor("behr-s540-7", "Navy Blue", "S540-7", "#3D5271", "behr", "Behr", "Blues", 10),
  createColor("behr-ppu10-12", "Pale Honey", "PPU10-12", "#E4D9C7", "behr", "Behr", "Neutrals", 66),
  createColor("behr-ppu10-14", "Ivory Keys", "PPU10-14", "#EBE4D6", "behr", "Behr", "Neutrals", 75),
  createColor("behr-ppu4-04", "Natural Almond", "PPU4-04", "#E0D5C1", "behr", "Behr", "Neutrals", 64),
  createColor("behr-ppu7-08", "Aged Beige", "PPU7-08", "#D4C6B2", "behr", "Behr", "Neutrals", 54),
  createColor("behr-ppu7-09", "Toasted Pecan", "PPU7-09", "#C8B89F", "behr", "Behr", "Neutrals", 48),
  createColor("behr-ppu7-10", "Cafe Latte", "PPU7-10", "#C3B49E", "behr", "Behr", "Neutrals", 46),
  createColor("behr-n550-2", "Looking Glass", "N550-2", "#D8DBDB", "behr", "Behr", "Grays", 67),
  createColor("behr-n550-4", "Sea Fog", "N550-4", "#A6ACAE", "behr", "Behr", "Grays", 38),
  createColor("behr-750e-2", "Smoked Oyster", "750E-2", "#D4CEC5", "behr", "Behr", "Neutrals", 60),
  createColor("behr-ppu26-10", "French Silver", "PPU26-10", "#C5C5C3", "behr", "Behr", "Grays", 53),
  createColor("behr-ppu26-16", "Classic Silver", "PPU26-16", "#D5D5D3", "behr", "Behr", "Grays", 64),
  createColor("behr-ppu26-18", "Graceful Gray", "PPU26-18", "#DFDEDC", "behr", "Behr", "Grays", 72),
  createColor("behr-ppu18-06", "Elephant Skin", "PPU18-06", "#7E7B78", "behr", "Behr", "Grays", 20),
  createColor("behr-ppu18-14", "Cathedral Gray", "PPU18-14", "#ACA8A3", "behr", "Behr", "Grays", 38),
  createColor("behr-n170-1", "Mocha Foam", "N170-1", "#ECDFD2", "behr", "Behr", "Neutrals", 74),
  createColor("behr-n210-2", "Cappuccino Froth", "N210-2", "#DCCFBE", "behr", "Behr", "Neutrals", 63),
  createColor("behr-n310-2", "Sand Dust", "N310-2", "#DBD5C2", "behr", "Behr", "Neutrals", 63),
  createColor("behr-ppu5-09", "Barnwood", "PPU5-09", "#AB9B88", "behr", "Behr", "Neutrals", 35),
  createColor("behr-ppu5-12", "Almond Wisp", "PPU5-12", "#C8BBA7", "behr", "Behr", "Neutrals", 49),
  createColor("behr-ppu5-14", "Mesa Taupe", "PPU5-14", "#B4A894", "behr", "Behr", "Neutrals", 40),
  createColor("behr-ecc-10-2", "Jet Black", "ECC-10-2", "#2E2E2E", "behr", "Behr", "Blacks", 3),
  createColor("behr-bxc-02", "Frost", "BXC-02", "#ECEAE5", "behr", "Behr", "Whites", 80),
  createColor("behr-w-b-110", "Cider Spice", "W-B-110", "#C4A072", "behr", "Behr", "Oranges", 38),
  createColor("behr-m240-7", "Cascade", "M240-7", "#2B4A67", "behr", "Behr", "Blues", 8),
  createColor("behr-m530-6", "Sophisticated Navy", "M530-6", "#3B536C", "behr", "Behr", "Blues", 10),
  createColor("behr-m530-4", "Washed Denim", "M530-4", "#8199AD", "behr", "Behr", "Blues", 30),
  createColor("behr-s520-4", "Breezy Blue", "S520-4", "#90ABB7", "behr", "Behr", "Blues", 36),
  createColor("behr-s500-2", "Breathless", "S500-2", "#CDD8D7", "behr", "Behr", "Greens", 62),
  createColor("behr-s400-3", "Minted Lemon", "S400-3", "#B9C5A8", "behr", "Behr", "Greens", 50),
  createColor("behr-s190-4", "Spiced Brandy", "S190-4", "#C5A489", "behr", "Behr", "Oranges", 40),
  createColor("behr-s170-4", "Retro Pink", "S170-4", "#C9A197", "behr", "Behr", "Reds", 39),
  createColor("behr-dc-008", "Crisp Linen", "DC-008", "#F0E8D8", "behr", "Behr", "Whites", 78),
  createColor("behr-dc-003", "Blank Canvas", "DC-003", "#F3EEE2", "behr", "Behr", "Whites", 84),
  createColor("behr-rd-w07", "Creamy Mushroom", "RD-W07", "#E6DDD0", "behr", "Behr", "Neutrals", 69),
  createColor("behr-ppu25-12", "Dusty Lilac", "PPU25-12", "#C0B9BD", "behr", "Behr", "Purples", 47),
  createColor("behr-ppu13-12", "Lemon Balm", "PPU13-12", "#DFD9A8", "behr", "Behr", "Yellows", 65),
  createColor("behr-s110-3", "Coral Sunset", "S110-3", "#D8B1A1", "behr", "Behr", "Reds", 48),

  // PPG - Popular Colors
  createColor("ppg-1025-1", "Gypsum", "PPG1025-1", "#F0EBE2", "ppg", "PPG", "Neutrals", 81),
  createColor("ppg-1025-2", "Dusty Miller", "PPG1025-2", "#E2DDD2", "ppg", "PPG", "Neutrals", 70),
  createColor("ppg-1025-3", "Whiskers", "PPG1025-3", "#D1CBC0", "ppg", "PPG", "Neutrals", 57),
  createColor("ppg-1001-3", "Thin Ice", "PPG1001-3", "#D1D1CD", "ppg", "PPG", "Grays", 60),
  createColor("ppg-1001-4", "Stepping Stone", "PPG1001-4", "#B5B5B1", "ppg", "PPG", "Grays", 45),
  createColor("ppg-1001-5", "Dover Gray", "PPG1001-5", "#A1A29E", "ppg", "PPG", "Grays", 35),
  createColor("ppg-1001-6", "Atlantic Fog", "PPG1001-6", "#8C8D89", "ppg", "PPG", "Grays", 26),
  createColor("ppg-1040-3", "Pine Frost", "PPG1040-3", "#C5D0C7", "ppg", "PPG", "Greens", 55),
  createColor("ppg-1040-4", "Lime Daiquiri", "PPG1040-4", "#A8BAA9", "ppg", "PPG", "Greens", 44),
  createColor("ppg-1033-1", "Delicate White", "PPG1033-1", "#F4EFE4", "ppg", "PPG", "Whites", 85),

  // VALSPAR (Lowe's) - Popular Colors
  createColor("val-7002-1", "Du Jour", "7002-1", "#F2EDE3", "valspar", "Valspar", "Neutrals", 82),
  createColor("val-7003-1", "Swiss Cream", "7003-1", "#F5F0E4", "valspar", "Valspar", "Whites", 85),
  createColor("val-7003-2", "Woodlawn Snow", "7003-2", "#E8E2D5", "valspar", "Valspar", "Neutrals", 73),
  createColor("val-7003-3", "Oatbran", "7003-3", "#D8D0C1", "valspar", "Valspar", "Neutrals", 61),
  createColor("val-7004-1", "Filtered Shade", "7004-1", "#E7E6E2", "valspar", "Valspar", "Grays", 76),
  createColor("val-7004-2", "Silver Leaf", "7004-2", "#D5D4CF", "valspar", "Valspar", "Grays", 63),
  createColor("val-7004-3", "Harbor Mist", "7004-3", "#BEBDBA", "valspar", "Valspar", "Grays", 49),
  createColor("val-5002-1b", "Light Blue", "5002-1B", "#E0E9EA", "valspar", "Valspar", "Blues", 77),
  createColor("val-5002-2a", "Seaspray", "5002-2A", "#C5D5D7", "valspar", "Valspar", "Blues", 62),
  createColor("val-5003-1b", "Moonlight Hush", "5003-1B", "#E3E9E7", "valspar", "Valspar", "Greens", 77),
  createColor("val-7006-2", "Coastal Dune", "7006-2", "#D8CFC0", "valspar", "Valspar", "Neutrals", 60),
  createColor("val-7006-4", "Bark Dust", "7006-4", "#AA9D8C", "valspar", "Valspar", "Neutrals", 35),
  createColor("val-4001-1a", "Gravity", "4001-1A", "#DBD9D6", "valspar", "Valspar", "Grays", 66),
  createColor("val-4001-2a", "Notre Dame", "4001-2A", "#C8C6C3", "valspar", "Valspar", "Grays", 54),
  createColor("val-4001-3b", "Coastal Villa", "4001-3B", "#AFB0AD", "valspar", "Valspar", "Grays", 42),
  createColor("val-4001-5b", "Signature Fog", "4001-5B", "#8E908E", "valspar", "Valspar", "Grays", 27),
  createColor("val-4003-2a", "Dove White", "4003-2A", "#E0DDD5", "valspar", "Valspar", "Neutrals", 70),
  createColor("val-4003-3b", "Montpelier", "4003-3B", "#D0CBC0", "valspar", "Valspar", "Neutrals", 57),
  createColor("val-6001-1b", "Snow Cap", "6001-1B", "#E7ECE8", "valspar", "Valspar", "Greens", 79),
  createColor("val-6002-2a", "Seafoam Storm", "6002-2A", "#C1D2CE", "valspar", "Valspar", "Greens", 59),
  createColor("val-6003-3a", "Pine Forest", "6003-3A", "#6E8C74", "valspar", "Valspar", "Greens", 24),
  createColor("val-5001-3b", "Stormy Cove", "5001-3B", "#8F9EA5", "valspar", "Valspar", "Blues", 33),
  createColor("val-5001-5b", "Deep Twilight", "5001-5B", "#354E62", "valspar", "Valspar", "Blues", 8),
  createColor("val-5004-2a", "Gentle Wave", "5004-2A", "#B6C8CE", "valspar", "Valspar", "Blues", 53),
  createColor("val-5005-1b", "Winter Calm", "5005-1B", "#DDE4E6", "valspar", "Valspar", "Blues", 74),
  createColor("val-3007-3a", "La Fonda Mango", "3007-3A", "#D4A76D", "valspar", "Valspar", "Oranges", 42),
  createColor("val-2007-3a", "Berry Blush", "2007-3A", "#C59C9A", "valspar", "Valspar", "Reds", 39),
  createColor("val-2003-3b", "Dusty Rose", "2003-3B", "#C8A6A4", "valspar", "Valspar", "Reds", 42),
  createColor("val-1009-2", "Tempered Gray", "1009-2", "#B9B5AD", "valspar", "Valspar", "Neutrals", 46),
  createColor("val-4004-1c", "Soft Charcoal", "4004-1C", "#6A6865", "valspar", "Valspar", "Grays", 14),
  createColor("val-4005-2b", "Sable Calm", "4005-2B", "#474544", "valspar", "Valspar", "Blacks", 6),
  createColor("val-3005-1b", "Honeymilk", "3005-1B", "#F3EAD7", "valspar", "Valspar", "Whites", 81),
  createColor("val-6006-1b", "Sage Brush", "6006-1B", "#D4D7C9", "valspar", "Valspar", "Greens", 63),
  createColor("val-8003-2b", "Lilac Lane", "8003-2B", "#C9BFD0", "valspar", "Valspar", "Purples", 50),
  createColor("val-3001-3a", "Warm Butterscotch", "3001-3A", "#C7A96E", "valspar", "Valspar", "Yellows", 42),

  // ACE HARDWARE (Clark+Kensington) - Popular Colors
  createColor("ace-ck-n-c1", "Cake Batter", "N-C1", "#F5F0E5", "ace", "Clark+Kensington", "Whites", 85),
  createColor("ace-ck-n-c2", "Feather Down", "N-C2", "#EBE5D9", "ace", "Clark+Kensington", "Whites", 77),
  createColor("ace-ck-n-c3", "Antique Linen", "N-C3", "#E3DBC8", "ace", "Clark+Kensington", "Neutrals", 68),
  createColor("ace-ck-n-c4", "Sandstone Cliff", "N-C4", "#D5CDB9", "ace", "Clark+Kensington", "Neutrals", 58),
  createColor("ace-ck-n-c5", "Worn Leather", "N-C5", "#B4A78F", "ace", "Clark+Kensington", "Neutrals", 40),
  createColor("ace-ck-n-c6", "Cabin Fever", "N-C6", "#8D7F6E", "ace", "Clark+Kensington", "Neutrals", 24),
  createColor("ace-ck-n-c7", "Dark Roast", "N-C7", "#5C5043", "ace", "Clark+Kensington", "Neutrals", 9),
  createColor("ace-ck-n-c8", "Espresso Shot", "N-C8", "#44382E", "ace", "Clark+Kensington", "Neutrals", 5),
  createColor("ace-ck-gn1", "Whisper of Sage", "GN-1", "#D5DBC9", "ace", "Clark+Kensington", "Greens", 63),
  createColor("ace-ck-gn2", "Meadow Mist", "GN-2", "#BAC7AC", "ace", "Clark+Kensington", "Greens", 50),
  createColor("ace-ck-gn3", "Toscana", "GN-3", "#8CA07A", "ace", "Clark+Kensington", "Greens", 33),
  createColor("ace-ck-gn4", "Forest Retreat", "GN-4", "#5F7757", "ace", "Clark+Kensington", "Greens", 18),
  createColor("ace-ck-bl1", "Morning Mist", "BL-1", "#D9E3E6", "ace", "Clark+Kensington", "Blues", 73),
  createColor("ace-ck-bl2", "Serene Stream", "BL-2", "#B4C8D0", "ace", "Clark+Kensington", "Blues", 54),
  createColor("ace-ck-bl3", "Coastal Fog", "BL-3", "#8BA7B5", "ace", "Clark+Kensington", "Blues", 37),
  createColor("ace-ck-bl4", "Ocean Floor", "BL-4", "#4D6D7E", "ace", "Clark+Kensington", "Blues", 16),
  createColor("ace-ck-bl5", "Midnight Navy", "BL-5", "#2E4251", "ace", "Clark+Kensington", "Blues", 6),
  createColor("ace-ck-gr1", "Silver Screen", "GR-1", "#E2E2E0", "ace", "Clark+Kensington", "Grays", 73),
  createColor("ace-ck-gr2", "Stone Path", "GR-2", "#CBC9C5", "ace", "Clark+Kensington", "Grays", 56),
  createColor("ace-ck-gr3", "Charcoal Heather", "GR-3", "#9C9A97", "ace", "Clark+Kensington", "Grays", 32),
  createColor("ace-ck-gr4", "Graphite", "GR-4", "#6B6967", "ace", "Clark+Kensington", "Grays", 15),
  createColor("ace-ck-gr5", "Black Sesame", "GR-5", "#3C3A38", "ace", "Clark+Kensington", "Blacks", 4),
  createColor("ace-ck-rd1", "Blushing Peach", "RD-1", "#E5C4B6", "ace", "Clark+Kensington", "Reds", 55),
  createColor("ace-ck-rd2", "Terra Cotta", "RD-2", "#C08B73", "ace", "Clark+Kensington", "Reds", 30),
  createColor("ace-ck-rd3", "Autumn Leaves", "RD-3", "#A66049", "ace", "Clark+Kensington", "Reds", 16),
  createColor("ace-ck-yw1", "Soft Buttercream", "YW-1", "#F2E8CC", "ace", "Clark+Kensington", "Yellows", 78),
  createColor("ace-ck-yw2", "Honey Wheat", "YW-2", "#DECE9E", "ace", "Clark+Kensington", "Yellows", 62),
  createColor("ace-ck-yw3", "Amber Gold", "YW-3", "#C7AD6E", "ace", "Clark+Kensington", "Yellows", 43),
  createColor("ace-ck-wm1", "Warm Porcelain", "WM-1", "#EFE6D6", "ace", "Clark+Kensington", "Neutrals", 75),
  createColor("ace-ck-wm2", "Toasted Cashew", "WM-2", "#D5C4A9", "ace", "Clark+Kensington", "Neutrals", 54),
  createColor("ace-ck-wm3", "Caramel Drizzle", "WM-3", "#BEA882", "ace", "Clark+Kensington", "Neutrals", 41),
  createColor("ace-ck-pr1", "Lavender Sachet", "PR-1", "#D8CEE0", "ace", "Clark+Kensington", "Purples", 58),
  createColor("ace-ck-pr2", "Plum Shadow", "PR-2", "#7E6484", "ace", "Clark+Kensington", "Purples", 15),
];

export function deltaE(lab1: { l: number; a: number; b: number }, lab2: { l: number; a: number; b: number }): number {
  const dL = lab1.l - lab2.l;
  const da = lab1.a - lab2.a;
  const db = lab1.b - lab2.b;
  return Math.sqrt(dL * dL + da * da + db * db);
}

export function findClosestColors(
  targetHex: string,
  catalog: CatalogColor[] = PAINT_CATALOG,
  limit: number = 10,
  brand?: CatalogColor["brand"]
): (CatalogColor & { distance: number })[] {
  const targetRgb = hexToRgb(targetHex);
  const targetLab = rgbToLab(targetRgb.r, targetRgb.g, targetRgb.b);
  
  let filteredCatalog = catalog;
  if (brand) {
    filteredCatalog = catalog.filter(c => c.brand === brand);
  }
  
  const withDistance = filteredCatalog.map(color => ({
    ...color,
    distance: deltaE(targetLab, color.lab)
  }));
  
  withDistance.sort((a, b) => a.distance - b.distance);
  
  return withDistance.slice(0, limit);
}

export function findClosestByBrand(
  targetHex: string,
  limit: number = 3
): Record<string, (CatalogColor & { distance: number })[]> {
  const brands: CatalogColor["brand"][] = ["sherwin-williams", "benjamin-moore", "behr", "ppg", "valspar", "ace"];
  const result: Record<string, (CatalogColor & { distance: number })[]> = {};
  
  for (const brand of brands) {
    result[brand] = findClosestColors(targetHex, PAINT_CATALOG, limit, brand);
  }
  
  return result;
}

export function getMatchQuality(distance: number): { label: string; color: string } {
  if (distance < 3) return { label: "Exact Match", color: "text-blue-500" };
  if (distance < 6) return { label: "Very Close", color: "text-sky-500" };
  if (distance < 10) return { label: "Close Match", color: "text-yellow-500" };
  if (distance < 20) return { label: "Similar", color: "text-orange-500" };
  return { label: "Approximate", color: "text-red-400" };
}
