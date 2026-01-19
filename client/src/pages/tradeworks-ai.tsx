import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ColorScanner } from '@/components/color-scanner';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Calculator, Ruler, Palette, Cloud, Store, Wrench, Download, Smartphone, Share2, Copy, Check,
  ScanLine, Droplets, Layers, Clock, DollarSign, Mic, Sun, Thermometer, Wind, MapPin,
  ExternalLink, Flashlight, Fuel, Navigation, ChevronRight, ChevronLeft, Lock, Sparkles,
  Zap, Shield, Star, Home, Activity, TrendingUp, BarChart3, Crown, Briefcase, Users,
  Cable, Droplet, Fan, HardHat, Hammer, Building, Trees, Settings, History, Heart,
  Plus, Search, Phone, Globe, ChevronDown, Volume2, VolumeX, Save, FolderOpen, Tag,
  ArrowRight, RefreshCw, X, Menu, Bookmark, PenTool, Gauge, CircuitBoard, Plug,
  Waves, PipetteIcon, Flame, Snowflake, LayoutGrid, SquareStack, Fence
} from 'lucide-react';

// Premium animated gradient background
function PremiumBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
    </div>
  );
}

// Premium glass panel component
function GlassPanel({ children, className = '', glow = false, onClick }: { 
  children: React.ReactNode; 
  className?: string; 
  glow?: boolean;
  onClick?: () => void;
}) {
  return (
    <div 
      onClick={onClick}
      className={`relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl ${glow ? 'shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/20' : ''} ${onClick ? 'cursor-pointer hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300' : ''} ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent rounded-2xl pointer-events-none" />
      <div className="relative">{children}</div>
    </div>
  );
}

// Trade configuration
const TRADES = [
  { id: 'painting', name: 'Painting', icon: Palette, color: 'from-purple-500 to-pink-500', accent: 'purple' },
  { id: 'electrical', name: 'Electrical', icon: Zap, color: 'from-yellow-500 to-amber-500', accent: 'yellow' },
  { id: 'plumbing', name: 'Plumbing', icon: Droplet, color: 'from-blue-500 to-cyan-500', accent: 'blue' },
  { id: 'hvac', name: 'HVAC', icon: Fan, color: 'from-cyan-500 to-teal-500', accent: 'cyan' },
  { id: 'roofing', name: 'Roofing', icon: Home, color: 'from-orange-500 to-red-500', accent: 'orange' },
  { id: 'carpentry', name: 'Carpentry', icon: Hammer, color: 'from-amber-600 to-yellow-600', accent: 'amber' },
  { id: 'concrete', name: 'Concrete', icon: Building, color: 'from-slate-500 to-zinc-500', accent: 'slate' },
  { id: 'landscaping', name: 'Landscaping', icon: Trees, color: 'from-green-500 to-emerald-500', accent: 'green' },
];

// Calculator definitions by trade
const CALCULATORS: Record<string, Array<{ id: string; name: string; icon: any; desc: string }>> = {
  painting: [
    { id: 'paint_gallon', name: 'Paint Calculator', icon: Droplets, desc: 'Gallons needed' },
    { id: 'primer_calc', name: 'Primer Calculator', icon: Layers, desc: 'Primer coverage' },
    { id: 'cabinet_est', name: 'Cabinet Estimator', icon: LayoutGrid, desc: 'Cabinet pricing' },
    { id: 'drying_time', name: 'Drying Time', icon: Clock, desc: 'Cure times' },
    { id: 'color_match', name: 'Color Scanner', icon: ScanLine, desc: 'AI color match' },
  ],
  electrical: [
    { id: 'voltage_drop', name: 'Voltage Drop', icon: Gauge, desc: 'Wire voltage loss' },
    { id: 'wire_sizing', name: 'Wire Sizing', icon: Cable, desc: 'AWG selection' },
    { id: 'amperage', name: 'Amperage Calc', icon: Zap, desc: 'Amps from watts' },
    { id: 'conduit_fill', name: 'Conduit Fill', icon: CircuitBoard, desc: 'Wire capacity' },
    { id: 'breaker_size', name: 'Breaker Sizing', icon: Plug, desc: 'Circuit breakers' },
  ],
  plumbing: [
    { id: 'pipe_sizing', name: 'Pipe Sizing', icon: PipetteIcon, desc: 'Pipe diameter' },
    { id: 'fixture_units', name: 'Fixture Units', icon: Droplet, desc: 'DFU calculator' },
    { id: 'pipe_offset', name: 'Pipe Offset', icon: Waves, desc: 'Offset lengths' },
    { id: 'water_heater', name: 'Water Heater', icon: Flame, desc: 'Tank sizing' },
  ],
  hvac: [
    { id: 'btu_load', name: 'BTU Calculator', icon: Thermometer, desc: 'Heating/cooling load' },
    { id: 'duct_sizing', name: 'Duct Sizing', icon: Fan, desc: 'CFM to size' },
    { id: 'refrigerant', name: 'Refrigerant', icon: Snowflake, desc: 'Charge calc' },
    { id: 'temp_split', name: 'Temp Split', icon: Activity, desc: 'Supply/return' },
  ],
  roofing: [
    { id: 'roof_pitch', name: 'Roof Pitch', icon: TrendingUp, desc: 'Rise/run calc' },
    { id: 'shingle_calc', name: 'Shingle Calc', icon: SquareStack, desc: 'Bundles needed' },
    { id: 'rafter_length', name: 'Rafter Length', icon: Ruler, desc: 'Rafter sizing' },
  ],
  carpentry: [
    { id: 'stair_stringer', name: 'Stair Stringer', icon: BarChart3, desc: 'Rise/run layout' },
    { id: 'board_feet', name: 'Board Feet', icon: Ruler, desc: 'Lumber calc' },
    { id: 'stud_spacing', name: 'Stud Spacing', icon: LayoutGrid, desc: 'Wall framing' },
  ],
  concrete: [
    { id: 'concrete_yards', name: 'Concrete Yards', icon: Building, desc: 'Cubic yards' },
    { id: 'rebar_spacing', name: 'Rebar Spacing', icon: LayoutGrid, desc: 'Grid layout' },
    { id: 'block_brick', name: 'Block/Brick', icon: SquareStack, desc: 'Unit count' },
  ],
  landscaping: [
    { id: 'mulch_gravel', name: 'Mulch/Gravel', icon: Trees, desc: 'Yards needed' },
    { id: 'sod_calc', name: 'Sod Calculator', icon: LayoutGrid, desc: 'Pallet count' },
    { id: 'fence_posts', name: 'Fence Posts', icon: Fence, desc: 'Post spacing' },
  ],
  universal: [
    { id: 'area_calc', name: 'Area Calculator', icon: SquareStack, desc: 'Square footage' },
    { id: 'volume_calc', name: 'Volume Calculator', icon: Building, desc: 'Cubic feet/yards' },
    { id: 'waste_calc', name: 'Waste Calculator', icon: RefreshCw, desc: 'Add waste %' },
    { id: 'labor_est', name: 'Labor Estimator', icon: DollarSign, desc: 'Quick pricing' },
    { id: 'unit_convert', name: 'Unit Converter', icon: RefreshCw, desc: 'Convert units' },
  ],
};

// Supply store brands
const STORE_BRANDS = [
  { name: 'Sherwin-Williams', type: 'paint', color: '#0066CC' },
  { name: 'Benjamin Moore', type: 'paint', color: '#1A1A1A' },
  { name: 'Home Depot', type: 'general', color: '#F96302' },
  { name: "Lowe's", type: 'general', color: '#004990' },
  { name: 'Ferguson', type: 'plumbing', color: '#0071BC' },
  { name: 'Grainger', type: 'electrical', color: '#D50032' },
  { name: 'Supply House', type: 'hvac', color: '#2E8B57' },
  { name: 'ABC Supply', type: 'roofing', color: '#CC0000' },
];

// Paint Calculator Component
function PaintCalculator({ onSave }: { onSave?: (data: any) => void }) {
  const [sqFt, setSqFt] = useState('');
  const [coats, setCoats] = useState('2');
  const [coverage, setCoverage] = useState('350');
  const [doorCount, setDoorCount] = useState('0');
  const [windowCount, setWindowCount] = useState('0');

  const doorSqFt = parseInt(doorCount || '0') * 20;
  const windowSqFt = parseInt(windowCount || '0') * 15;
  const paintableArea = Math.max(0, parseFloat(sqFt || '0') - doorSqFt - windowSqFt);
  const gallonsNeeded = paintableArea > 0 ? Math.ceil((paintableArea * parseFloat(coats)) / parseFloat(coverage)) : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Wall Area (sq ft)</Label>
          <Input 
            type="number" 
            value={sqFt} 
            onChange={(e) => setSqFt(e.target.value)}
            placeholder="500"
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-12 text-lg"
            data-testid="input-paint-sqft"
          />
        </div>
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Coats</Label>
          <Input 
            type="number" 
            value={coats} 
            onChange={(e) => setCoats(e.target.value)}
            placeholder="2"
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-12 text-lg"
            data-testid="input-paint-coats"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Coverage</Label>
          <Input 
            type="number" 
            value={coverage} 
            onChange={(e) => setCoverage(e.target.value)}
            placeholder="350"
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            data-testid="input-paint-coverage"
          />
        </div>
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Doors</Label>
          <Input 
            type="number" 
            value={doorCount} 
            onChange={(e) => setDoorCount(e.target.value)}
            placeholder="0"
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            data-testid="input-paint-doors"
          />
        </div>
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Windows</Label>
          <Input 
            type="number" 
            value={windowCount} 
            onChange={(e) => setWindowCount(e.target.value)}
            placeholder="0"
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            data-testid="input-paint-windows"
          />
        </div>
      </div>
      {gallonsNeeded > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-xl p-5 text-center border border-purple-500/30"
        >
          <p className="text-5xl font-bold text-purple-400">{gallonsNeeded}</p>
          <p className="text-sm text-slate-400 mt-1">Gallons Needed</p>
          <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs text-slate-500">
            <div>Paintable: {paintableArea.toLocaleString()} sq ft</div>
            <div>@ {coverage} sq ft/gal</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Voltage Drop Calculator
function VoltageDropCalculator() {
  const [wireGauge, setWireGauge] = useState('12');
  const [length, setLength] = useState('');
  const [amps, setAmps] = useState('');
  const [voltage, setVoltage] = useState('120');
  const [wireType, setWireType] = useState('copper');

  const wireResistance: Record<string, Record<string, number>> = {
    copper: { '14': 3.14, '12': 1.98, '10': 1.24, '8': 0.778, '6': 0.491, '4': 0.308, '2': 0.194 },
    aluminum: { '14': 5.17, '12': 3.25, '10': 2.04, '8': 1.28, '6': 0.808, '4': 0.508, '2': 0.319 }
  };

  const resistance = wireResistance[wireType]?.[wireGauge] || 0;
  const voltageDrop = length && amps ? (2 * parseFloat(length) * parseFloat(amps) * resistance) / 1000 : 0;
  const dropPercent = voltage && voltageDrop ? (voltageDrop / parseFloat(voltage)) * 100 : 0;
  const isAcceptable = dropPercent <= 3;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Wire Gauge (AWG)</Label>
          <Select value={wireGauge} onValueChange={setWireGauge}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white h-12" data-testid="select-wire-gauge">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="14">14 AWG</SelectItem>
              <SelectItem value="12">12 AWG</SelectItem>
              <SelectItem value="10">10 AWG</SelectItem>
              <SelectItem value="8">8 AWG</SelectItem>
              <SelectItem value="6">6 AWG</SelectItem>
              <SelectItem value="4">4 AWG</SelectItem>
              <SelectItem value="2">2 AWG</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Wire Type</Label>
          <Select value={wireType} onValueChange={setWireType}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white h-12" data-testid="select-wire-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="copper">Copper</SelectItem>
              <SelectItem value="aluminum">Aluminum</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Length (ft)</Label>
          <Input 
            type="number" 
            value={length} 
            onChange={(e) => setLength(e.target.value)}
            placeholder="100"
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-12"
            data-testid="input-wire-length"
          />
        </div>
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Amps</Label>
          <Input 
            type="number" 
            value={amps} 
            onChange={(e) => setAmps(e.target.value)}
            placeholder="15"
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-12"
            data-testid="input-amps"
          />
        </div>
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Voltage</Label>
          <Input 
            type="number" 
            value={voltage} 
            onChange={(e) => setVoltage(e.target.value)}
            placeholder="120"
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-12"
            data-testid="input-voltage"
          />
        </div>
      </div>
      {dropPercent > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-xl p-5 text-center border ${isAcceptable ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/10 border-green-500/30' : 'bg-gradient-to-br from-red-500/20 to-orange-500/10 border-red-500/30'}`}
        >
          <p className={`text-5xl font-bold ${isAcceptable ? 'text-green-400' : 'text-red-400'}`}>{dropPercent.toFixed(2)}%</p>
          <p className="text-sm text-slate-400 mt-1">Voltage Drop</p>
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-center gap-2">
            {isAcceptable ? (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">NEC Compliant (&lt;3%)</Badge>
            ) : (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Exceeds 3% - Use larger wire</Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-2">Actual drop: {voltageDrop.toFixed(2)}V</p>
        </motion.div>
      )}
    </div>
  );
}

// BTU Calculator
function BTUCalculator() {
  const [sqFt, setSqFt] = useState('');
  const [ceilingHeight, setCeilingHeight] = useState('8');
  const [climate, setClimate] = useState('moderate');
  const [insulation, setInsulation] = useState('average');
  const [windowCount, setWindowCount] = useState('4');

  const climateMultiplier: Record<string, number> = { hot: 1.3, moderate: 1.0, cold: 0.8 };
  const insulationMultiplier: Record<string, number> = { poor: 1.3, average: 1.0, good: 0.8 };
  
  const baseBTU = parseFloat(sqFt || '0') * 20;
  const ceilingFactor = parseFloat(ceilingHeight) > 8 ? 1 + ((parseFloat(ceilingHeight) - 8) * 0.04) : 1;
  const windowFactor = 1 + (parseInt(windowCount) * 0.01);
  const totalBTU = Math.round(baseBTU * ceilingFactor * windowFactor * climateMultiplier[climate] * insulationMultiplier[insulation]);
  const tons = totalBTU / 12000;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Area (sq ft)</Label>
          <Input 
            type="number" 
            value={sqFt} 
            onChange={(e) => setSqFt(e.target.value)}
            placeholder="1500"
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-12 text-lg"
            data-testid="input-btu-sqft"
          />
        </div>
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Ceiling (ft)</Label>
          <Input 
            type="number" 
            value={ceilingHeight} 
            onChange={(e) => setCeilingHeight(e.target.value)}
            placeholder="8"
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-12"
            data-testid="input-btu-ceiling"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Climate</Label>
          <Select value={climate} onValueChange={setClimate}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white" data-testid="select-climate">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cold">Cold</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="hot">Hot</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Insulation</Label>
          <Select value={insulation} onValueChange={setInsulation}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white" data-testid="select-insulation">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="poor">Poor</SelectItem>
              <SelectItem value="average">Average</SelectItem>
              <SelectItem value="good">Good</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {totalBTU > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-cyan-500/20 to-teal-500/10 rounded-xl p-5 text-center border border-cyan-500/30"
        >
          <p className="text-5xl font-bold text-cyan-400">{totalBTU.toLocaleString()}</p>
          <p className="text-sm text-slate-400 mt-1">BTU Required</p>
          <div className="mt-3 pt-3 border-t border-white/10">
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">{tons.toFixed(1)} Tons</Badge>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Labor Estimator
function LaborEstimator() {
  const [hours, setHours] = useState('');
  const [rate, setRate] = useState('45');
  const [helpers, setHelpers] = useState('0');
  const [helperRate, setHelperRate] = useState('25');
  const [materials, setMaterials] = useState('');
  const [markup, setMarkup] = useState('30');

  const laborCost = parseFloat(hours || '0') * parseFloat(rate || '0');
  const helperCost = parseFloat(hours || '0') * parseInt(helpers || '0') * parseFloat(helperRate || '0');
  const materialsCost = parseFloat(materials || '0');
  const subtotal = laborCost + helperCost + materialsCost;
  const markupAmount = subtotal * (parseFloat(markup) / 100);
  const total = subtotal + markupAmount;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Hours</Label>
          <Input 
            type="number" 
            value={hours} 
            onChange={(e) => setHours(e.target.value)}
            placeholder="8"
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-12 text-lg"
            data-testid="input-labor-hours"
          />
        </div>
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Your Rate ($/hr)</Label>
          <Input 
            type="number" 
            value={rate} 
            onChange={(e) => setRate(e.target.value)}
            placeholder="45"
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-12"
            data-testid="input-labor-rate"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Helpers</Label>
          <Input 
            type="number" 
            value={helpers} 
            onChange={(e) => setHelpers(e.target.value)}
            placeholder="0"
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            data-testid="input-helpers"
          />
        </div>
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Helper Rate</Label>
          <Input 
            type="number" 
            value={helperRate} 
            onChange={(e) => setHelperRate(e.target.value)}
            placeholder="25"
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            data-testid="input-helper-rate"
          />
        </div>
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Markup %</Label>
          <Input 
            type="number" 
            value={markup} 
            onChange={(e) => setMarkup(e.target.value)}
            placeholder="30"
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            data-testid="input-markup"
          />
        </div>
      </div>
      <div>
        <Label className="text-slate-400 text-xs mb-1.5 block">Materials Cost</Label>
        <Input 
          type="number" 
          value={materials} 
          onChange={(e) => setMaterials(e.target.value)}
          placeholder="250"
          className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
          data-testid="input-materials"
        />
      </div>
      {total > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-xl p-5 border border-green-500/30"
        >
          <div className="text-center mb-4">
            <p className="text-5xl font-bold text-green-400">${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-sm text-slate-400 mt-1">Total Quote</p>
          </div>
          <div className="space-y-2 text-sm border-t border-white/10 pt-3">
            <div className="flex justify-between text-slate-400">
              <span>Labor ({hours}h @ ${rate})</span>
              <span>${laborCost.toFixed(2)}</span>
            </div>
            {helperCost > 0 && (
              <div className="flex justify-between text-slate-400">
                <span>Helpers ({helpers} @ ${helperRate}/hr)</span>
                <span>${helperCost.toFixed(2)}</span>
              </div>
            )}
            {materialsCost > 0 && (
              <div className="flex justify-between text-slate-400">
                <span>Materials</span>
                <span>${materialsCost.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400 border-t border-white/10 pt-2">
              <span>Markup ({markup}%)</span>
              <span>${markupAmount.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Store Finder Component
function StoreFinder({ zipcode }: { zipcode: string }) {
  const [searchZip, setSearchZip] = useState(zipcode);
  const [storeType, setStoreType] = useState('all');

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input 
          value={searchZip}
          onChange={(e) => setSearchZip(e.target.value)}
          placeholder="Enter ZIP code"
          className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 flex-1"
          data-testid="input-store-zip"
        />
        <Select value={storeType} onValueChange={setStoreType}>
          <SelectTrigger className="bg-white/5 border-white/10 text-white w-40" data-testid="select-store-type">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stores</SelectItem>
            <SelectItem value="paint">Paint</SelectItem>
            <SelectItem value="electrical">Electrical</SelectItem>
            <SelectItem value="plumbing">Plumbing</SelectItem>
            <SelectItem value="general">General</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        {STORE_BRANDS.filter(s => storeType === 'all' || s.type === storeType).map((store) => (
          <GlassPanel 
            key={store.name}
            className="p-4 hover:bg-white/[0.06] cursor-pointer transition-all"
            onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(store.name + ' near ' + searchZip)}`, '_blank')}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: store.color }}
              >
                {store.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-sm">{store.name}</p>
                <p className="text-xs text-slate-400 capitalize">{store.type} Supply</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white" data-testid={`button-call-${store.name.replace(/\s/g, '-').toLowerCase()}`}>
                  <Phone className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white" data-testid={`button-directions-${store.name.replace(/\s/g, '-').toLowerCase()}`}>
                  <MapPin className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </GlassPanel>
        ))}
      </div>
    </div>
  );
}

// Main TradeWorks AI Component
export default function TradeWorksAI() {
  const [selectedTrade, setSelectedTrade] = useState('painting');
  const [selectedCalculator, setSelectedCalculator] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showStores, setShowStores] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [userZipcode, setUserZipcode] = useState('37211');
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const appUrl = typeof window !== 'undefined' ? `${window.location.origin}/tradeworks` : '';
  const currentTrade = TRADES.find(t => t.id === selectedTrade);
  const TradeIcon = currentTrade?.icon || Wrench;

  useEffect(() => {
    document.title = 'TradeWorks AI - Professional Field Tools';
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      toast({ title: 'Link copied!' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Could not copy', variant: 'destructive' });
    }
  };

  const renderCalculator = () => {
    switch (selectedCalculator) {
      case 'paint_gallon':
      case 'primer_calc':
        return <PaintCalculator />;
      case 'voltage_drop':
        return <VoltageDropCalculator />;
      case 'btu_load':
        return <BTUCalculator />;
      case 'labor_est':
        return <LaborEstimator />;
      case 'color_match':
        setShowScanner(true);
        setSelectedCalculator(null);
        return null;
      default:
        return <LaborEstimator />;
    }
  };

  return (
    <div className="min-h-screen relative">
      <PremiumBackground />
      
      <div className="max-w-lg mx-auto px-4 py-6 pb-32">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">TradeWorks AI</h1>
              <p className="text-xs text-slate-400">Professional Field Tools</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-amber-500/80 to-orange-500/80 text-white border-0 gap-1">
              <Crown className="w-3 h-3" />
              PRO
            </Badge>
            <Button 
              size="icon" 
              variant="ghost" 
              className="text-slate-400 hover:text-white"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              data-testid="button-toggle-voice"
            >
              {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Trade Selector */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Select Trade</h2>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white gap-1 text-xs" onClick={() => setShowStores(true)} data-testid="button-find-stores">
              <Store className="w-3.5 h-3.5" />
              Find Stores
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {TRADES.map((trade) => (
              <motion.button
                key={trade.id}
                onClick={() => {
                  setSelectedTrade(trade.id);
                  setSelectedCalculator(null);
                }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-3 rounded-xl border transition-all ${
                  selectedTrade === trade.id 
                    ? 'bg-white/10 border-white/20' 
                    : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05]'
                }`}
                data-testid={`button-trade-${trade.id}`}
              >
                <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-br ${trade.color} flex items-center justify-center shadow-lg mb-2`}>
                  <trade.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-[10px] text-slate-300 text-center font-medium truncate">{trade.name}</p>
                {selectedTrade === trade.id && (
                  <motion.div
                    layoutId="trade-indicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-white/50"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Calculator Selection or Active Calculator */}
        <AnimatePresence mode="wait">
          {selectedCalculator ? (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedCalculator(null)}
                  className="text-slate-400 hover:text-white gap-1"
                  data-testid="button-back"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
                <div className="flex-1" />
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" data-testid="button-save-calc">
                  <Save className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" data-testid="button-favorite">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
              <GlassPanel className="p-5">
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentTrade?.color} flex items-center justify-center shadow-lg`}>
                    <TradeIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {CALCULATORS[selectedTrade]?.find(c => c.id === selectedCalculator)?.name || 
                       CALCULATORS.universal.find(c => c.id === selectedCalculator)?.name}
                    </h3>
                    <p className="text-xs text-slate-400">{currentTrade?.name}</p>
                  </div>
                </div>
                {renderCalculator()}
              </GlassPanel>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Trade-Specific Calculators */}
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <TradeIcon className="w-4 h-4" />
                  {currentTrade?.name} Tools
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {CALCULATORS[selectedTrade]?.map((calc) => (
                    <GlassPanel
                      key={calc.id}
                      className="p-4"
                      onClick={() => setSelectedCalculator(calc.id)}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentTrade?.color} flex items-center justify-center shadow-lg mb-3`}>
                        <calc.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-sm font-semibold text-white mb-0.5">{calc.name}</h3>
                      <p className="text-xs text-slate-400">{calc.desc}</p>
                      {calc.id === 'color_match' && (
                        <Badge className="mt-2 bg-gradient-to-r from-purple-500/50 to-pink-500/50 text-white border-0 text-[10px]">
                          <Sparkles className="w-2.5 h-2.5 mr-0.5" />
                          AI
                        </Badge>
                      )}
                    </GlassPanel>
                  ))}
                </div>
              </div>

              {/* Universal Tools */}
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Universal Tools
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {CALCULATORS.universal.map((calc) => (
                    <GlassPanel
                      key={calc.id}
                      className="p-4"
                      onClick={() => setSelectedCalculator(calc.id)}
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-lg mb-3">
                        <calc.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-sm font-semibold text-white mb-0.5">{calc.name}</h3>
                      <p className="text-xs text-slate-400">{calc.desc}</p>
                    </GlassPanel>
                  ))}
                </div>
              </div>

              {/* Voice Assistant CTA */}
              <GlassPanel glow className="p-5 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
                    <Mic className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white">Voice Assistant</h3>
                      <Badge className="bg-gradient-to-r from-blue-500/50 to-purple-500/50 text-white border-0 text-[10px]">
                        <Sparkles className="w-2.5 h-2.5 mr-0.5" />
                        AI
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400">Hands-free calculations with ElevenLabs</p>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  onClick={() => setShowVoice(true)}
                  data-testid="button-voice-assistant"
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Start Voice Session
                </Button>
              </GlassPanel>

              {/* PaintPros.io Integration */}
              <Link href="/">
                <GlassPanel className="p-4 mb-6 border-green-500/20 bg-green-500/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">Grow Your Business</h3>
                      <p className="text-xs text-slate-400">Get leads from PaintPros.io marketplace</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-green-400" />
                  </div>
                </GlassPanel>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Powered By Footer */}
        <div className="text-center pt-4">
          <p className="text-xs text-slate-500">Powered by</p>
          <Link href="/">
            <span className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">PaintPros.io</span>
          </Link>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-around">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-400 hover:text-white flex-col gap-1 h-auto py-2"
              onClick={() => setSelectedCalculator(null)}
              data-testid="button-nav-home"
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px]">Home</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-400 hover:text-white flex-col gap-1 h-auto py-2"
              data-testid="button-nav-history"
            >
              <History className="w-5 h-5" />
              <span className="text-[10px]">History</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-400 hover:text-white flex-col gap-1 h-auto py-2"
              onClick={() => setShowStores(true)}
              data-testid="button-nav-stores"
            >
              <Store className="w-5 h-5" />
              <span className="text-[10px]">Stores</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-400 hover:text-white flex-col gap-1 h-auto py-2"
              onClick={() => setShareOpen(true)}
              data-testid="button-nav-share"
            >
              <Share2 className="w-5 h-5" />
              <span className="text-[10px]">Share</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Color Scanner Modal */}
      <ColorScanner 
        open={showScanner}
        onOpenChange={setShowScanner}
      />

      {/* Store Finder Dialog */}
      <Dialog open={showStores} onOpenChange={setShowStores}>
        <DialogContent className="bg-slate-900/95 backdrop-blur-xl border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Store className="w-5 h-5" />
              Find Supply Stores
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Locate nearby suppliers for your trade
            </DialogDescription>
          </DialogHeader>
          <StoreFinder zipcode={userZipcode} />
        </DialogContent>
      </Dialog>

      {/* Voice Assistant Dialog */}
      <Dialog open={showVoice} onOpenChange={setShowVoice}>
        <DialogContent className="bg-slate-900/95 backdrop-blur-xl border-white/10 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Mic className="w-5 h-5" />
              Voice Assistant
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-8">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 mb-6"
            >
              <Mic className="w-10 h-10 text-white" />
            </motion.div>
            <p className="text-slate-400 text-center mb-4">
              "Calculate paint for a 12 by 15 room with 9 foot ceilings"
            </p>
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
              Coming Soon - ElevenLabs Integration
            </Badge>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="bg-slate-900/95 backdrop-blur-xl border-white/10 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white text-center">Share TradeWorks AI</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="bg-white p-4 rounded-xl">
              <QRCodeSVG value={appUrl} size={180} level="H" includeMargin />
            </div>
            <div className="w-full flex gap-2">
              <div className="flex-1 bg-white/5 rounded-lg px-3 py-2 text-sm text-slate-300 truncate border border-white/10">
                {appUrl}
              </div>
              <Button onClick={handleCopyLink} size="icon" variant="outline" className="border-white/10" data-testid="button-copy-link">
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}