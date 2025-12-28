import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  PaintBucket, 
  Package, 
  Wrench, 
  ShoppingCart,
  ExternalLink,
  Clock,
  Users,
  Calendar,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  calculateMaterials, 
  type MaterialCalculationInput,
  type MaterialItem 
} from "@/lib/material-calculator";

interface MaterialBreakdownProps {
  input: MaterialCalculationInput;
  showPricing?: boolean;
  showLabor?: boolean;
  className?: string;
}

const categoryIcons = {
  paint: PaintBucket,
  primer: PaintBucket,
  supplies: Package,
  equipment: Wrench,
};

const categoryColors = {
  paint: "bg-blue-100 text-blue-700 border-blue-200",
  primer: "bg-purple-100 text-purple-700 border-purple-200",
  supplies: "bg-green-100 text-green-700 border-green-200",
  equipment: "bg-amber-100 text-amber-700 border-amber-200",
};

function MaterialRow({ item, showPricing, index }: { 
  item: MaterialItem; 
  showPricing: boolean;
  index: number;
}) {
  const Icon = categoryIcons[item.category];
  const colorClass = categoryColors[item.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-md flex items-center justify-center ${colorClass}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="font-medium text-sm">{item.itemName}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{item.quantity} {item.unit}{item.quantity > 1 ? "s" : ""}</span>
            {item.brand && (
              <>
                <span>•</span>
                <span>{item.brand}</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {showPricing && item.totalPrice && (
          <span className="font-semibold text-sm">${item.totalPrice.toFixed(2)}</span>
        )}
        {item.supplierUrl && (
          <Button
            size="icon"
            variant="ghost"
            className="w-7 h-7"
            onClick={() => window.open(item.supplierUrl, "_blank")}
            data-testid={`button-buy-${item.category}-${index}`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}

export function MaterialBreakdown({ 
  input, 
  showPricing = true,
  showLabor = true,
  className = "" 
}: MaterialBreakdownProps) {
  const result = useMemo(() => calculateMaterials(input), [input]);

  const paintItems = result.materials.filter(m => m.category === "paint" || m.category === "primer");
  const supplyItems = result.materials.filter(m => m.category === "supplies");
  const equipmentItems = result.materials.filter(m => m.category === "equipment");

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="overflow-hidden border-2 border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-3">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Material Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
              <PaintBucket className="w-4 h-4" />
              Paint & Primer
            </h4>
            <div className="space-y-1">
              {paintItems.map((item, idx) => (
                <MaterialRow key={idx} item={item} showPricing={showPricing} index={idx} />
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Supplies
            </h4>
            <div className="space-y-1">
              {supplyItems.map((item, idx) => (
                <MaterialRow key={idx} item={item} showPricing={showPricing} index={idx + paintItems.length} />
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Equipment
            </h4>
            <div className="space-y-1">
              {equipmentItems.map((item, idx) => (
                <MaterialRow key={idx} item={item} showPricing={showPricing} index={idx + paintItems.length + supplyItems.length} />
              ))}
            </div>
          </div>
          
          {showPricing && (
            <>
              <Separator />
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Estimated Material Cost</span>
                </div>
                <span className="text-xl font-bold text-primary">
                  ${result.totals.totalMaterialCost.toFixed(2)}
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {showLabor && (
        <Card className="border-2 border-amber-200">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 pb-3">
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <Clock className="w-5 h-5" />
              Labor Estimate
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center p-4 rounded-lg bg-amber-50 border border-amber-200"
              >
                <Clock className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                <p className="text-2xl font-bold text-amber-800">{result.laborEstimate.totalHours}</p>
                <p className="text-xs text-amber-600">Total Hours</p>
              </motion.div>
              
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-center p-4 rounded-lg bg-amber-50 border border-amber-200"
              >
                <Users className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                <p className="text-2xl font-bold text-amber-800">{result.laborEstimate.crewSize}</p>
                <p className="text-xs text-amber-600">Crew Size</p>
              </motion.div>
              
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center p-4 rounded-lg bg-amber-50 border border-amber-200"
              >
                <Calendar className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                <p className="text-2xl font-bold text-amber-800">{result.laborEstimate.estimatedDays}</p>
                <p className="text-xs text-amber-600">Days</p>
              </motion.div>
            </div>
            
            <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200">
              <p className="text-sm text-amber-800 text-center">
                Based on a {result.laborEstimate.crewSize}-person professional crew working 8-hour days
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline" className="text-xs">
          {result.totals.paintGallons} gal paint
        </Badge>
        {result.totals.primerGallons > 0 && (
          <Badge variant="outline" className="text-xs">
            {result.totals.primerGallons} gal primer
          </Badge>
        )}
        <Badge variant="outline" className="text-xs">
          {result.materials.length} items
        </Badge>
      </div>
    </div>
  );
}

export function MaterialBreakdownCompact({ 
  input,
  className = "" 
}: { 
  input: MaterialCalculationInput;
  className?: string;
}) {
  const result = useMemo(() => calculateMaterials(input), [input]);

  return (
    <div className={`p-4 rounded-lg border bg-card ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-primary" />
          Materials Summary
        </h4>
        <Badge variant="secondary">{result.materials.length} items</Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <PaintBucket className="w-4 h-4 text-blue-600" />
          <span>{result.totals.paintGallons} gallons paint</span>
        </div>
        {result.totals.primerGallons > 0 && (
          <div className="flex items-center gap-2">
            <PaintBucket className="w-4 h-4 text-purple-600" />
            <span>{result.totals.primerGallons} gallons primer</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>~{result.laborEstimate.estimatedDays} days</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-green-600" />
          <span>{result.laborEstimate.crewSize}-person crew</span>
        </div>
      </div>
      
      <Separator className="my-3" />
      
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">Est. Material Cost:</span>
        <span className="font-bold text-lg">${result.totals.totalMaterialCost.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default MaterialBreakdown;
