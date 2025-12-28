interface MaterialItem {
  category: "paint" | "primer" | "supplies" | "equipment";
  itemName: string;
  quantity: number;
  unit: string;
  brand?: string;
  unitPrice?: number;
  totalPrice?: number;
  supplierName?: string;
  supplierUrl?: string;
  notes?: string;
}

interface MaterialCalculationInput {
  squareFootage: number;
  includeWalls: boolean;
  includeCeilings: boolean;
  includeTrim: boolean;
  doorCount: number;
  roomCount?: number;
  ceilingHeight?: number;
  surfaceCondition?: "good" | "fair" | "poor" | "damaged";
  paintQuality?: "standard" | "premium" | "ultra_premium";
}

interface MaterialCalculationResult {
  materials: MaterialItem[];
  totals: {
    paintGallons: number;
    primerGallons: number;
    totalMaterialCost: number;
  };
  laborEstimate: {
    totalHours: number;
    crewSize: number;
    estimatedDays: number;
  };
}

const COVERAGE_RATES = {
  paint: 350,
  primer: 300,
};

const SUPPLIER_LINKS = {
  sherwinWilliams: {
    name: "Sherwin-Williams",
    baseUrl: "https://www.sherwin-williams.com",
  },
  benjaminMoore: {
    name: "Benjamin Moore",
    baseUrl: "https://www.benjaminmoore.com",
  },
  homeDepot: {
    name: "Home Depot",
    baseUrl: "https://www.homedepot.com",
  },
  lowes: {
    name: "Lowe's",
    baseUrl: "https://www.lowes.com",
  },
};

const MATERIAL_PRICES = {
  paint: {
    standard: 35,
    premium: 55,
    ultra_premium: 75,
  },
  primer: 28,
  dropCloth: 8,
  paintersTape: 6,
  rollerCover: 8,
  rollerFrame: 12,
  brushSet: 25,
  paintTray: 5,
  sandpaper: 8,
  caulk: 6,
  patchKit: 15,
};

const LABOR_RATES = {
  prepPerSqFt: 0.015,
  primePerSqFt: 0.008,
  paintPerSqFt: 0.012,
  trimPerLinearFt: 0.05,
  doorEach: 0.5,
  cleanupBase: 1,
};

const DIFFICULTY_MULTIPLIERS = {
  good: 1.0,
  fair: 1.2,
  poor: 1.5,
  damaged: 2.0,
};

export function calculateMaterials(input: MaterialCalculationInput): MaterialCalculationResult {
  const {
    squareFootage,
    includeWalls,
    includeCeilings,
    includeTrim,
    doorCount,
    roomCount = 1,
    ceilingHeight = 9,
    surfaceCondition = "good",
    paintQuality = "premium",
  } = input;

  const materials: MaterialItem[] = [];
  let totalPaintArea = 0;
  let totalPrimerArea = 0;

  const wallPerimeter = Math.sqrt(squareFootage) * 4;
  const wallArea = wallPerimeter * ceilingHeight;
  const windowDoorDeduction = (doorCount * 21) + (roomCount * 2 * 15);
  const netWallArea = Math.max(0, wallArea - windowDoorDeduction);

  if (includeWalls) {
    totalPaintArea += netWallArea;
    if (surfaceCondition !== "good") {
      totalPrimerArea += netWallArea;
    }
  }

  if (includeCeilings) {
    totalPaintArea += squareFootage;
    totalPrimerArea += squareFootage * 0.5;
  }

  const trimLinearFeet = includeTrim ? (wallPerimeter * 2) + (doorCount * 17) : 0;
  const trimArea = trimLinearFeet * 0.5;
  totalPaintArea += trimArea;

  const coats = surfaceCondition === "good" ? 2 : surfaceCondition === "fair" ? 2 : 3;
  const paintGallons = Math.ceil((totalPaintArea * coats) / COVERAGE_RATES.paint);
  const primerGallons = Math.ceil(totalPrimerArea / COVERAGE_RATES.primer);

  const paintPrice = MATERIAL_PRICES.paint[paintQuality];
  materials.push({
    category: "paint",
    itemName: `Interior ${paintQuality === "ultra_premium" ? "Ultra Premium" : paintQuality === "premium" ? "Premium" : "Standard"} Paint`,
    quantity: paintGallons,
    unit: "gallon",
    unitPrice: paintPrice,
    totalPrice: paintGallons * paintPrice,
    supplierName: SUPPLIER_LINKS.sherwinWilliams.name,
    supplierUrl: SUPPLIER_LINKS.sherwinWilliams.baseUrl,
  });

  if (primerGallons > 0) {
    materials.push({
      category: "primer",
      itemName: "Interior Primer/Sealer",
      quantity: primerGallons,
      unit: "gallon",
      unitPrice: MATERIAL_PRICES.primer,
      totalPrice: primerGallons * MATERIAL_PRICES.primer,
      supplierName: SUPPLIER_LINKS.sherwinWilliams.name,
      supplierUrl: SUPPLIER_LINKS.sherwinWilliams.baseUrl,
    });
  }

  const dropClothCount = Math.ceil(roomCount * 1.5);
  materials.push({
    category: "supplies",
    itemName: "Drop Cloths (9x12 Canvas)",
    quantity: dropClothCount,
    unit: "each",
    unitPrice: MATERIAL_PRICES.dropCloth,
    totalPrice: dropClothCount * MATERIAL_PRICES.dropCloth,
    supplierName: SUPPLIER_LINKS.homeDepot.name,
    supplierUrl: SUPPLIER_LINKS.homeDepot.baseUrl,
  });

  const tapeRolls = Math.ceil(wallPerimeter / 60);
  materials.push({
    category: "supplies",
    itemName: "Painter's Tape (1.88\" x 60yd)",
    quantity: tapeRolls,
    unit: "roll",
    unitPrice: MATERIAL_PRICES.paintersTape,
    totalPrice: tapeRolls * MATERIAL_PRICES.paintersTape,
    supplierName: SUPPLIER_LINKS.homeDepot.name,
    supplierUrl: SUPPLIER_LINKS.homeDepot.baseUrl,
  });

  const rollerCovers = Math.max(2, Math.ceil(paintGallons / 3));
  materials.push({
    category: "supplies",
    itemName: "Roller Covers (9\" Premium)",
    quantity: rollerCovers,
    unit: "each",
    unitPrice: MATERIAL_PRICES.rollerCover,
    totalPrice: rollerCovers * MATERIAL_PRICES.rollerCover,
    supplierName: SUPPLIER_LINKS.homeDepot.name,
    supplierUrl: SUPPLIER_LINKS.homeDepot.baseUrl,
  });

  materials.push({
    category: "equipment",
    itemName: "Roller Frame with Extension Pole",
    quantity: 1,
    unit: "set",
    unitPrice: MATERIAL_PRICES.rollerFrame,
    totalPrice: MATERIAL_PRICES.rollerFrame,
    supplierName: SUPPLIER_LINKS.homeDepot.name,
    supplierUrl: SUPPLIER_LINKS.homeDepot.baseUrl,
  });

  materials.push({
    category: "equipment",
    itemName: "Paint Brush Set (2\", 3\", Angled)",
    quantity: 1,
    unit: "set",
    unitPrice: MATERIAL_PRICES.brushSet,
    totalPrice: MATERIAL_PRICES.brushSet,
    supplierName: SUPPLIER_LINKS.homeDepot.name,
    supplierUrl: SUPPLIER_LINKS.homeDepot.baseUrl,
  });

  const paintTrays = Math.ceil(roomCount / 2);
  materials.push({
    category: "supplies",
    itemName: "Paint Tray with Liner",
    quantity: paintTrays,
    unit: "each",
    unitPrice: MATERIAL_PRICES.paintTray,
    totalPrice: paintTrays * MATERIAL_PRICES.paintTray,
    supplierName: SUPPLIER_LINKS.homeDepot.name,
    supplierUrl: SUPPLIER_LINKS.homeDepot.baseUrl,
  });

  if (surfaceCondition !== "good") {
    materials.push({
      category: "supplies",
      itemName: "Sandpaper Variety Pack",
      quantity: 1,
      unit: "pack",
      unitPrice: MATERIAL_PRICES.sandpaper,
      totalPrice: MATERIAL_PRICES.sandpaper,
      supplierName: SUPPLIER_LINKS.homeDepot.name,
      supplierUrl: SUPPLIER_LINKS.homeDepot.baseUrl,
    });

    materials.push({
      category: "supplies",
      itemName: "Wall Patch & Repair Kit",
      quantity: 1,
      unit: "kit",
      unitPrice: MATERIAL_PRICES.patchKit,
      totalPrice: MATERIAL_PRICES.patchKit,
      supplierName: SUPPLIER_LINKS.homeDepot.name,
      supplierUrl: SUPPLIER_LINKS.homeDepot.baseUrl,
    });
  }

  const caulkTubes = Math.ceil(trimLinearFeet / 50);
  if (caulkTubes > 0) {
    materials.push({
      category: "supplies",
      itemName: "Paintable Caulk",
      quantity: caulkTubes,
      unit: "tube",
      unitPrice: MATERIAL_PRICES.caulk,
      totalPrice: caulkTubes * MATERIAL_PRICES.caulk,
      supplierName: SUPPLIER_LINKS.homeDepot.name,
      supplierUrl: SUPPLIER_LINKS.homeDepot.baseUrl,
    });
  }

  const totalMaterialCost = materials.reduce((sum, m) => sum + (m.totalPrice || 0), 0);

  const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[surfaceCondition];
  
  let laborHours = 0;
  laborHours += totalPaintArea * LABOR_RATES.prepPerSqFt * difficultyMultiplier;
  if (primerGallons > 0) {
    laborHours += totalPrimerArea * LABOR_RATES.primePerSqFt;
  }
  laborHours += totalPaintArea * LABOR_RATES.paintPerSqFt * coats;
  laborHours += trimLinearFeet * LABOR_RATES.trimPerLinearFt;
  laborHours += doorCount * LABOR_RATES.doorEach;
  laborHours += LABOR_RATES.cleanupBase * roomCount;

  const crewSize = squareFootage > 2000 ? 3 : 2;
  const hoursPerDay = 8;
  const estimatedDays = Math.ceil(laborHours / (crewSize * hoursPerDay));

  return {
    materials,
    totals: {
      paintGallons,
      primerGallons,
      totalMaterialCost,
    },
    laborEstimate: {
      totalHours: Math.round(laborHours * 10) / 10,
      crewSize,
      estimatedDays,
    },
  };
}

export function formatMaterialList(result: MaterialCalculationResult): string {
  const { materials, totals, laborEstimate } = result;
  
  const lines: string[] = [
    "=== MATERIAL LIST ===",
    "",
    "PAINT & PRIMER:",
  ];
  
  materials.filter(m => m.category === "paint" || m.category === "primer").forEach(m => {
    lines.push(`  ${m.quantity} ${m.unit}(s) - ${m.itemName} @ $${m.unitPrice?.toFixed(2)} = $${m.totalPrice?.toFixed(2)}`);
  });
  
  lines.push("", "SUPPLIES:");
  materials.filter(m => m.category === "supplies").forEach(m => {
    lines.push(`  ${m.quantity} ${m.unit}(s) - ${m.itemName} @ $${m.unitPrice?.toFixed(2)} = $${m.totalPrice?.toFixed(2)}`);
  });
  
  lines.push("", "EQUIPMENT:");
  materials.filter(m => m.category === "equipment").forEach(m => {
    lines.push(`  ${m.quantity} ${m.unit}(s) - ${m.itemName} @ $${m.unitPrice?.toFixed(2)} = $${m.totalPrice?.toFixed(2)}`);
  });
  
  lines.push(
    "",
    "=== TOTALS ===",
    `Paint: ${totals.paintGallons} gallons`,
    `Primer: ${totals.primerGallons} gallons`,
    `Material Cost: $${totals.totalMaterialCost.toFixed(2)}`,
    "",
    "=== LABOR ESTIMATE ===",
    `Total Hours: ${laborEstimate.totalHours}`,
    `Crew Size: ${laborEstimate.crewSize} painters`,
    `Estimated Days: ${laborEstimate.estimatedDays}`,
  );
  
  return lines.join("\n");
}

export type { MaterialItem, MaterialCalculationInput, MaterialCalculationResult };
