import { useState, useEffect, useCallback, useRef } from 'react';
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

// Trade configuration - painting is live, others are special order
const TRADES = [
  { id: 'painting', name: 'Painting', icon: Palette, color: 'from-purple-500 to-pink-500', accent: 'purple', live: true },
  { id: 'electrical', name: 'Electrical', icon: Zap, color: 'from-yellow-500 to-amber-500', accent: 'yellow', specialOrder: true },
  { id: 'plumbing', name: 'Plumbing', icon: Droplet, color: 'from-blue-500 to-cyan-500', accent: 'blue', specialOrder: true },
  { id: 'hvac', name: 'HVAC', icon: Fan, color: 'from-cyan-500 to-teal-500', accent: 'cyan', specialOrder: true },
  { id: 'roofing', name: 'Roofing', icon: Home, color: 'from-orange-500 to-red-500', accent: 'orange', specialOrder: true },
  { id: 'carpentry', name: 'Carpentry', icon: Hammer, color: 'from-amber-600 to-yellow-600', accent: 'amber', specialOrder: true },
  { id: 'concrete', name: 'Concrete', icon: Building, color: 'from-slate-500 to-zinc-500', accent: 'slate', specialOrder: true },
  { id: 'landscaping', name: 'Landscaping', icon: Trees, color: 'from-green-500 to-emerald-500', accent: 'green', specialOrder: true },
];

// Calculator definitions by trade - COMPREHENSIVE
const CALCULATORS: Record<string, Array<{ id: string; name: string; icon: any; desc: string; pro?: boolean }>> = {
  painting: [
    { id: 'paint_gallon', name: 'Paint Calculator', icon: Droplets, desc: 'Gallons needed' },
    { id: 'primer_calc', name: 'Primer Calculator', icon: Layers, desc: 'Primer coverage' },
    { id: 'stain_calc', name: 'Stain Calculator', icon: Droplets, desc: 'Deck/fence stain' },
    { id: 'cabinet_est', name: 'Cabinet Estimator', icon: LayoutGrid, desc: 'Cabinet pricing' },
    { id: 'trim_calc', name: 'Trim/Baseboard', icon: Ruler, desc: 'Linear ft pricing' },
    { id: 'door_calc', name: 'Door Calculator', icon: LayoutGrid, desc: 'Per-door pricing' },
    { id: 'ceiling_calc', name: 'Ceiling Calculator', icon: SquareStack, desc: 'Ceiling coverage' },
    { id: 'wallpaper_calc', name: 'Wallpaper', icon: Layers, desc: 'Rolls needed' },
    { id: 'drying_time', name: 'Drying Time', icon: Clock, desc: 'Cure times' },
    { id: 'color_match', name: 'Color Scanner', icon: ScanLine, desc: 'AI color match', pro: true },
  ],
  electrical: [
    { id: 'voltage_drop', name: 'Voltage Drop', icon: Gauge, desc: 'Wire voltage loss' },
    { id: 'wire_sizing', name: 'Wire Sizing', icon: Cable, desc: 'AWG selection' },
    { id: 'amperage', name: 'Amperage Calc', icon: Zap, desc: 'Amps from watts' },
    { id: 'conduit_fill', name: 'Conduit Fill', icon: CircuitBoard, desc: 'Wire capacity' },
    { id: 'breaker_size', name: 'Breaker Sizing', icon: Plug, desc: 'Circuit breakers' },
    { id: 'outlet_spacing', name: 'Outlet Spacing', icon: LayoutGrid, desc: 'NEC requirements' },
    { id: 'led_resistor', name: 'LED Resistor', icon: Zap, desc: 'Resistor values' },
    { id: 'power_factor', name: 'Power Factor', icon: Activity, desc: 'kW to kVA' },
    { id: 'transformer', name: 'Transformer', icon: Gauge, desc: 'Sizing calc' },
    { id: 'ground_rod', name: 'Ground Rod', icon: Cable, desc: 'Grounding calc' },
  ],
  plumbing: [
    { id: 'pipe_sizing', name: 'Pipe Sizing', icon: PipetteIcon, desc: 'Pipe diameter' },
    { id: 'fixture_units', name: 'Fixture Units', icon: Droplet, desc: 'DFU calculator' },
    { id: 'pipe_offset', name: 'Pipe Offset', icon: Waves, desc: 'Offset lengths' },
    { id: 'water_heater', name: 'Water Heater', icon: Flame, desc: 'Tank sizing' },
    { id: 'drain_slope', name: 'Drain Slope', icon: TrendingUp, desc: '1/4" per foot' },
    { id: 'water_pressure', name: 'Water Pressure', icon: Gauge, desc: 'PSI calculator' },
    { id: 'pipe_material', name: 'Pipe Materials', icon: Ruler, desc: 'Material estimator' },
    { id: 'septic_size', name: 'Septic Sizing', icon: Building, desc: 'Tank capacity' },
    { id: 'gas_pipe', name: 'Gas Pipe Sizing', icon: Flame, desc: 'BTU to pipe size' },
  ],
  hvac: [
    { id: 'btu_load', name: 'BTU Calculator', icon: Thermometer, desc: 'Heating/cooling load' },
    { id: 'duct_sizing', name: 'Duct Sizing', icon: Fan, desc: 'CFM to size' },
    { id: 'refrigerant', name: 'Refrigerant', icon: Snowflake, desc: 'Charge calc' },
    { id: 'temp_split', name: 'Temp Split', icon: Activity, desc: 'Supply/return delta' },
    { id: 'airflow_calc', name: 'Airflow CFM', icon: Wind, desc: 'Room airflow' },
    { id: 'static_pressure', name: 'Static Pressure', icon: Gauge, desc: 'Duct pressure' },
    { id: 'heat_pump', name: 'Heat Pump Size', icon: Thermometer, desc: 'Tonnage calc' },
    { id: 'humidifier', name: 'Humidifier Size', icon: Droplet, desc: 'GPD needed' },
    { id: 'filter_size', name: 'Filter Sizing', icon: LayoutGrid, desc: 'MERV ratings' },
  ],
  roofing: [
    { id: 'roof_pitch', name: 'Roof Pitch', icon: TrendingUp, desc: 'Rise/run calc' },
    { id: 'shingle_calc', name: 'Shingle Calc', icon: SquareStack, desc: 'Bundles needed' },
    { id: 'rafter_length', name: 'Rafter Length', icon: Ruler, desc: 'Rafter sizing' },
    { id: 'roof_square', name: 'Roof Squares', icon: SquareStack, desc: 'Squares from sqft' },
    { id: 'underlayment', name: 'Underlayment', icon: Layers, desc: 'Rolls needed' },
    { id: 'ridge_cap', name: 'Ridge Cap', icon: TrendingUp, desc: 'Linear feet' },
    { id: 'drip_edge', name: 'Drip Edge', icon: Ruler, desc: 'Perimeter calc' },
    { id: 'valley_calc', name: 'Valley Length', icon: TrendingUp, desc: 'Valley material' },
    { id: 'gutter_calc', name: 'Gutter Sizing', icon: Waves, desc: 'Downspout calc' },
  ],
  carpentry: [
    { id: 'stair_stringer', name: 'Stair Stringer', icon: BarChart3, desc: 'Rise/run layout' },
    { id: 'board_feet', name: 'Board Feet', icon: Ruler, desc: 'Lumber calc' },
    { id: 'stud_spacing', name: 'Stud Spacing', icon: LayoutGrid, desc: 'Wall framing' },
    { id: 'joist_span', name: 'Joist Span', icon: Ruler, desc: 'Max span tables' },
    { id: 'deck_boards', name: 'Deck Boards', icon: LayoutGrid, desc: 'Board count' },
    { id: 'crown_molding', name: 'Crown Molding', icon: Ruler, desc: 'Angle cuts' },
    { id: 'miter_angle', name: 'Miter Angles', icon: TrendingUp, desc: 'Corner angles' },
    { id: 'header_size', name: 'Header Sizing', icon: Ruler, desc: 'Load bearing' },
    { id: 'plywood_calc', name: 'Plywood/OSB', icon: SquareStack, desc: 'Sheets needed' },
    { id: 'fastener_calc', name: 'Fastener Calc', icon: Wrench, desc: 'Nails/screws' },
  ],
  concrete: [
    { id: 'concrete_yards', name: 'Concrete Yards', icon: Building, desc: 'Cubic yards' },
    { id: 'rebar_spacing', name: 'Rebar Spacing', icon: LayoutGrid, desc: 'Grid layout' },
    { id: 'block_brick', name: 'Block/Brick', icon: SquareStack, desc: 'Unit count' },
    { id: 'footing_calc', name: 'Footing Size', icon: Building, desc: 'Foundation calc' },
    { id: 'slab_calc', name: 'Slab Calculator', icon: SquareStack, desc: 'Thickness calc' },
    { id: 'mortar_calc', name: 'Mortar Mix', icon: Droplets, desc: 'Bags needed' },
    { id: 'paver_calc', name: 'Paver Calculator', icon: LayoutGrid, desc: 'Paver count' },
    { id: 'cure_time', name: 'Cure Time', icon: Clock, desc: 'Curing schedule' },
    { id: 'retaining_wall', name: 'Retaining Wall', icon: Building, desc: 'Block count' },
  ],
  landscaping: [
    { id: 'mulch_gravel', name: 'Mulch/Gravel', icon: Trees, desc: 'Yards needed' },
    { id: 'sod_calc', name: 'Sod Calculator', icon: LayoutGrid, desc: 'Pallet count' },
    { id: 'fence_posts', name: 'Fence Posts', icon: Fence, desc: 'Post spacing' },
    { id: 'topsoil', name: 'Topsoil', icon: Trees, desc: 'Yards for depth' },
    { id: 'seed_calc', name: 'Grass Seed', icon: Trees, desc: 'Pounds needed' },
    { id: 'irrigation', name: 'Irrigation', icon: Droplet, desc: 'GPM zones' },
    { id: 'retaining', name: 'Landscape Blocks', icon: SquareStack, desc: 'Block count' },
    { id: 'tree_spacing', name: 'Tree Spacing', icon: Trees, desc: 'Planting grid' },
    { id: 'lawn_fertilizer', name: 'Fertilizer', icon: Trees, desc: 'Application rate' },
  ],
  universal: [
    { id: 'area_calc', name: 'Area Calculator', icon: SquareStack, desc: 'Square footage' },
    { id: 'volume_calc', name: 'Volume Calculator', icon: Building, desc: 'Cubic feet/yards' },
    { id: 'perimeter_calc', name: 'Perimeter', icon: Ruler, desc: 'Linear footage' },
    { id: 'circle_calc', name: 'Circle/Arc', icon: RefreshCw, desc: 'Radius/diameter' },
    { id: 'triangle_calc', name: 'Triangle', icon: TrendingUp, desc: 'Pythagorean' },
    { id: 'waste_calc', name: 'Waste Factor', icon: RefreshCw, desc: 'Add waste %' },
    { id: 'labor_est', name: 'Labor Estimator', icon: DollarSign, desc: 'Quick pricing' },
    { id: 'markup_calc', name: 'Markup/Margin', icon: TrendingUp, desc: 'Profit calc' },
    { id: 'unit_convert', name: 'Unit Converter', icon: RefreshCw, desc: 'Convert units' },
    { id: 'material_cost', name: 'Material Cost', icon: DollarSign, desc: 'Total materials' },
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

// Concrete Yards Calculator
function ConcreteCalculator() {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [depth, setDepth] = useState('4');
  const [wasteFactor, setWasteFactor] = useState('10');

  const cubicFeet = (parseFloat(length || '0') * parseFloat(width || '0') * (parseFloat(depth || '0') / 12));
  const cubicYards = cubicFeet / 27;
  const withWaste = cubicYards * (1 + parseFloat(wasteFactor) / 100);
  const bags80lb = Math.ceil(cubicFeet / 0.6); // 80lb bag = 0.6 cu ft

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Length (ft)</Label>
          <Input type="number" value={length} onChange={(e) => setLength(e.target.value)} placeholder="20" className="bg-white/5 border-white/10 text-white h-12 text-lg" data-testid="input-concrete-length" />
        </div>
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Width (ft)</Label>
          <Input type="number" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="10" className="bg-white/5 border-white/10 text-white h-12 text-lg" data-testid="input-concrete-width" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Depth (inches)</Label>
          <Input type="number" value={depth} onChange={(e) => setDepth(e.target.value)} placeholder="4" className="bg-white/5 border-white/10 text-white" data-testid="input-concrete-depth" />
        </div>
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Waste %</Label>
          <Input type="number" value={wasteFactor} onChange={(e) => setWasteFactor(e.target.value)} placeholder="10" className="bg-white/5 border-white/10 text-white" data-testid="input-concrete-waste" />
        </div>
      </div>
      {withWaste > 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-slate-500/20 to-zinc-500/10 rounded-xl p-5 text-center border border-slate-500/30">
          <p className="text-5xl font-bold text-slate-300">{withWaste.toFixed(2)}</p>
          <p className="text-sm text-slate-400 mt-1">Cubic Yards (with {wasteFactor}% waste)</p>
          <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs text-slate-500">
            <div>Raw: {cubicYards.toFixed(2)} cu yd</div>
            <div>~{bags80lb} bags (80lb)</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Roof Pitch Calculator
function RoofPitchCalculator() {
  const [rise, setRise] = useState('');
  const [run, setRun] = useState('12');

  const pitch = parseFloat(rise || '0') / parseFloat(run || '12');
  const angle = Math.atan(pitch) * (180 / Math.PI);
  const multiplier = Math.sqrt(1 + pitch * pitch);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Rise (inches)</Label>
          <Input type="number" value={rise} onChange={(e) => setRise(e.target.value)} placeholder="6" className="bg-white/5 border-white/10 text-white h-12 text-lg" data-testid="input-roof-rise" />
        </div>
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Run (inches)</Label>
          <Input type="number" value={run} onChange={(e) => setRun(e.target.value)} placeholder="12" className="bg-white/5 border-white/10 text-white h-12 text-lg" data-testid="input-roof-run" />
        </div>
      </div>
      {parseFloat(rise) > 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-orange-500/20 to-red-500/10 rounded-xl p-5 text-center border border-orange-500/30">
          <p className="text-5xl font-bold text-orange-400">{rise}/{run}</p>
          <p className="text-sm text-slate-400 mt-1">Roof Pitch</p>
          <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs text-slate-500">
            <div>Angle: {angle.toFixed(1)}°</div>
            <div>Multiplier: {multiplier.toFixed(3)}</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Stair Stringer Calculator
function StairCalculator() {
  const [totalRise, setTotalRise] = useState('');
  const [riserHeight, setRiserHeight] = useState('7.5');

  const numSteps = Math.round(parseFloat(totalRise || '0') / parseFloat(riserHeight || '7.5'));
  const actualRiser = parseFloat(totalRise || '0') / numSteps;
  const treadDepth = 10.5; // Standard tread
  const totalRun = (numSteps - 1) * treadDepth;
  const stringerLength = Math.sqrt(Math.pow(parseFloat(totalRise || '0'), 2) + Math.pow(totalRun, 2));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Total Rise (inches)</Label>
          <Input type="number" value={totalRise} onChange={(e) => setTotalRise(e.target.value)} placeholder="96" className="bg-white/5 border-white/10 text-white h-12 text-lg" data-testid="input-stair-rise" />
        </div>
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Target Riser (inches)</Label>
          <Input type="number" value={riserHeight} onChange={(e) => setRiserHeight(e.target.value)} placeholder="7.5" className="bg-white/5 border-white/10 text-white h-12" data-testid="input-stair-riser" />
        </div>
      </div>
      {numSteps > 0 && parseFloat(totalRise) > 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-amber-500/20 to-yellow-500/10 rounded-xl p-5 border border-amber-500/30">
          <div className="text-center mb-4">
            <p className="text-5xl font-bold text-amber-400">{numSteps}</p>
            <p className="text-sm text-slate-400 mt-1">Steps Needed</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm border-t border-white/10 pt-3">
            <div className="text-slate-400">Actual Riser: <span className="text-white">{actualRiser.toFixed(2)}"</span></div>
            <div className="text-slate-400">Tread Depth: <span className="text-white">{treadDepth}"</span></div>
            <div className="text-slate-400">Total Run: <span className="text-white">{(totalRun / 12).toFixed(1)} ft</span></div>
            <div className="text-slate-400">Stringer: <span className="text-white">{(stringerLength / 12).toFixed(1)} ft</span></div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Shingle Calculator
function ShingleCalculator() {
  const [sqFt, setSqFt] = useState('');
  const [pitch, setPitch] = useState('6');
  const [wasteFactor, setWasteFactor] = useState('15');

  const pitchMultipliers: Record<string, number> = { '3': 1.03, '4': 1.05, '5': 1.08, '6': 1.12, '7': 1.16, '8': 1.20, '9': 1.25, '10': 1.30, '12': 1.41 };
  const multiplier = pitchMultipliers[pitch] || 1.12;
  const roofArea = parseFloat(sqFt || '0') * multiplier;
  const squares = roofArea / 100;
  const withWaste = squares * (1 + parseFloat(wasteFactor) / 100);
  const bundles = Math.ceil(withWaste * 3); // 3 bundles per square

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Footprint (sq ft)</Label>
          <Input type="number" value={sqFt} onChange={(e) => setSqFt(e.target.value)} placeholder="1500" className="bg-white/5 border-white/10 text-white h-12 text-lg" data-testid="input-shingle-sqft" />
        </div>
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Pitch (x/12)</Label>
          <Select value={pitch} onValueChange={setPitch}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white h-12" data-testid="select-shingle-pitch">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(pitchMultipliers).map(p => <SelectItem key={p} value={p}>{p}/12</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      {withWaste > 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-orange-500/20 to-red-500/10 rounded-xl p-5 text-center border border-orange-500/30">
          <p className="text-5xl font-bold text-orange-400">{bundles}</p>
          <p className="text-sm text-slate-400 mt-1">Bundles Needed</p>
          <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs text-slate-500">
            <div>{withWaste.toFixed(1)} squares</div>
            <div>{roofArea.toFixed(0)} sq ft actual</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Mulch/Gravel Calculator
function MulchCalculator() {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [depth, setDepth] = useState('3');

  const sqFt = parseFloat(length || '0') * parseFloat(width || '0');
  const cubicFeet = sqFt * (parseFloat(depth || '0') / 12);
  const cubicYards = cubicFeet / 27;
  const bags2cuft = Math.ceil(cubicFeet / 2);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Length (ft)</Label>
          <Input type="number" value={length} onChange={(e) => setLength(e.target.value)} placeholder="20" className="bg-white/5 border-white/10 text-white h-12 text-lg" data-testid="input-mulch-length" />
        </div>
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Width (ft)</Label>
          <Input type="number" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="10" className="bg-white/5 border-white/10 text-white h-12 text-lg" data-testid="input-mulch-width" />
        </div>
      </div>
      <div>
        <Label className="text-slate-400 text-xs mb-1.5 block">Depth (inches)</Label>
        <Input type="number" value={depth} onChange={(e) => setDepth(e.target.value)} placeholder="3" className="bg-white/5 border-white/10 text-white" data-testid="input-mulch-depth" />
      </div>
      {cubicYards > 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-xl p-5 text-center border border-green-500/30">
          <p className="text-5xl font-bold text-green-400">{cubicYards.toFixed(2)}</p>
          <p className="text-sm text-slate-400 mt-1">Cubic Yards</p>
          <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs text-slate-500">
            <div>{sqFt.toFixed(0)} sq ft coverage</div>
            <div>~{bags2cuft} bags (2 cu ft)</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Wire Sizing Calculator
function WireSizingCalculator() {
  const [amps, setAmps] = useState('');
  const [distance, setDistance] = useState('');
  const [voltage, setVoltage] = useState('120');

  const wireSizes = [
    { awg: '14', amps: 15, resistance: 3.14 },
    { awg: '12', amps: 20, resistance: 1.98 },
    { awg: '10', amps: 30, resistance: 1.24 },
    { awg: '8', amps: 40, resistance: 0.778 },
    { awg: '6', amps: 55, resistance: 0.491 },
    { awg: '4', amps: 70, resistance: 0.308 },
    { awg: '2', amps: 95, resistance: 0.194 },
  ];

  const amperage = parseFloat(amps || '0');
  const suitable = wireSizes.filter(w => w.amps >= amperage);
  const recommended = suitable.length > 0 ? suitable[0] : null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Amperage</Label>
          <Input type="number" value={amps} onChange={(e) => setAmps(e.target.value)} placeholder="20" className="bg-white/5 border-white/10 text-white h-12 text-lg" data-testid="input-wire-amps" />
        </div>
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Distance (ft)</Label>
          <Input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="50" className="bg-white/5 border-white/10 text-white h-12 text-lg" data-testid="input-wire-distance" />
        </div>
      </div>
      {recommended && amperage > 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-yellow-500/20 to-amber-500/10 rounded-xl p-5 text-center border border-yellow-500/30">
          <p className="text-5xl font-bold text-yellow-400">{recommended.awg} AWG</p>
          <p className="text-sm text-slate-400 mt-1">Recommended Wire Size</p>
          <div className="mt-3 pt-3 border-t border-white/10 text-xs text-slate-500">
            <p>Rated for {recommended.amps}A (copper)</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Pipe Offset Calculator
function PipeOffsetCalculator() {
  const [offset, setOffset] = useState('');
  const [angle, setAngle] = useState('45');

  const angleMultipliers: Record<string, number> = { '22.5': 2.613, '30': 2.0, '45': 1.414, '60': 1.155 };
  const multiplier = angleMultipliers[angle] || 1.414;
  const travel = parseFloat(offset || '0') * multiplier;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Offset (inches)</Label>
          <Input type="number" value={offset} onChange={(e) => setOffset(e.target.value)} placeholder="12" className="bg-white/5 border-white/10 text-white h-12 text-lg" data-testid="input-pipe-offset" />
        </div>
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Fitting Angle</Label>
          <Select value={angle} onValueChange={setAngle}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white h-12" data-testid="select-pipe-angle">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="22.5">22.5°</SelectItem>
              <SelectItem value="30">30°</SelectItem>
              <SelectItem value="45">45°</SelectItem>
              <SelectItem value="60">60°</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {travel > 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-xl p-5 text-center border border-blue-500/30">
          <p className="text-5xl font-bold text-blue-400">{travel.toFixed(2)}"</p>
          <p className="text-sm text-slate-400 mt-1">Travel Length</p>
          <div className="mt-3 pt-3 border-t border-white/10 text-xs text-slate-500">
            <p>Using {angle}° fittings (x{multiplier})</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Duct Sizing Calculator
function DuctSizingCalculator() {
  const [cfm, setCfm] = useState('');
  const [velocity, setVelocity] = useState('700');

  const cfmVal = parseFloat(cfm || '0');
  const velVal = parseFloat(velocity || '700');
  const areaNeeded = cfmVal / velVal; // sq ft
  const areaInches = areaNeeded * 144; // sq inches
  const roundDiameter = Math.sqrt((4 * areaInches) / Math.PI);
  const rectWidth = Math.ceil(Math.sqrt(areaInches * 1.5));
  const rectHeight = Math.ceil(areaInches / rectWidth);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">CFM Required</Label>
          <Input type="number" value={cfm} onChange={(e) => setCfm(e.target.value)} placeholder="400" className="bg-white/5 border-white/10 text-white h-12 text-lg" data-testid="input-duct-cfm" />
        </div>
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Velocity (FPM)</Label>
          <Input type="number" value={velocity} onChange={(e) => setVelocity(e.target.value)} placeholder="700" className="bg-white/5 border-white/10 text-white h-12" data-testid="input-duct-velocity" />
        </div>
      </div>
      {roundDiameter > 0 && cfmVal > 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-cyan-500/20 to-teal-500/10 rounded-xl p-5 text-center border border-cyan-500/30">
          <p className="text-5xl font-bold text-cyan-400">{Math.ceil(roundDiameter)}"</p>
          <p className="text-sm text-slate-400 mt-1">Round Duct Diameter</p>
          <div className="mt-3 pt-3 border-t border-white/10 text-xs text-slate-500">
            <p>Or rectangular: {rectWidth}" x {rectHeight}"</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Area Calculator
function AreaCalculator() {
  const [shape, setShape] = useState('rectangle');
  const [dim1, setDim1] = useState('');
  const [dim2, setDim2] = useState('');

  let area = 0;
  if (shape === 'rectangle') {
    area = parseFloat(dim1 || '0') * parseFloat(dim2 || '0');
  } else if (shape === 'triangle') {
    area = (parseFloat(dim1 || '0') * parseFloat(dim2 || '0')) / 2;
  } else if (shape === 'circle') {
    area = Math.PI * Math.pow(parseFloat(dim1 || '0'), 2);
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-slate-400 text-xs mb-1.5 block">Shape</Label>
        <Select value={shape} onValueChange={setShape}>
          <SelectTrigger className="bg-white/5 border-white/10 text-white" data-testid="select-area-shape">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rectangle">Rectangle</SelectItem>
            <SelectItem value="triangle">Triangle</SelectItem>
            <SelectItem value="circle">Circle</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">{shape === 'circle' ? 'Radius (ft)' : 'Length (ft)'}</Label>
          <Input type="number" value={dim1} onChange={(e) => setDim1(e.target.value)} placeholder="10" className="bg-white/5 border-white/10 text-white h-12 text-lg" data-testid="input-area-dim1" />
        </div>
        {shape !== 'circle' && (
          <div>
            <Label className="text-slate-400 text-xs mb-1.5 block">{shape === 'triangle' ? 'Height (ft)' : 'Width (ft)'}</Label>
            <Input type="number" value={dim2} onChange={(e) => setDim2(e.target.value)} placeholder="10" className="bg-white/5 border-white/10 text-white h-12 text-lg" data-testid="input-area-dim2" />
          </div>
        )}
      </div>
      {area > 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-slate-500/20 to-zinc-500/10 rounded-xl p-5 text-center border border-slate-500/30">
          <p className="text-5xl font-bold text-slate-300">{area.toFixed(2)}</p>
          <p className="text-sm text-slate-400 mt-1">Square Feet</p>
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

// Voice Assistant Component with ElevenLabs
function VoiceAssistant({ 
  onClose, 
  onCalculation 
}: { 
  onClose: () => void;
  onCalculation?: (type: string, result: any) => void;
}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speakResponse = async (text: string) => {
    setIsSpeaking(true);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'nova' }),
      });
      
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        audioRef.current = new Audio(url);
        audioRef.current.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(url);
        };
        await audioRef.current.play();
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
    }
  };

  const processCommand = async (command: string) => {
    setIsProcessing(true);
    const lowerCommand = command.toLowerCase();
    
    // Parse paint calculations
    const paintMatch = lowerCommand.match(/paint.*?(\d+)\s*(?:by|x|times)\s*(\d+)/i);
    const voltageMatch = lowerCommand.match(/voltage.*?(\d+)\s*(?:feet|ft)/i);
    const btuMatch = lowerCommand.match(/btu.*?(\d+)\s*(?:square|sq)/i);
    
    let responseText = '';
    
    if (paintMatch) {
      const length = parseInt(paintMatch[1]);
      const width = parseInt(paintMatch[2]);
      const perimeter = 2 * (length + width);
      const wallArea = perimeter * 8; // Assume 8ft ceilings
      const gallons = Math.ceil((wallArea * 2) / 350); // 2 coats, 350 sqft coverage
      responseText = `For a ${length} by ${width} room, you'll need approximately ${gallons} gallons of paint. That's based on ${wallArea} square feet of wall space with 2 coats.`;
      if (onCalculation) {
        onCalculation('paint_gallon', { sqFt: wallArea, gallons });
      }
    } else if (voltageMatch) {
      const feet = parseInt(voltageMatch[1]);
      const voltageDrop = (2 * feet * 15 * 1.98) / 1000; // 15 amps, 12 AWG copper
      const percent = (voltageDrop / 120) * 100;
      responseText = `For ${feet} feet of 12 gauge copper wire at 15 amps, the voltage drop is ${percent.toFixed(2)}%. ${percent <= 3 ? 'This is within NEC guidelines.' : 'Consider using a larger wire gauge.'}`;
    } else if (btuMatch) {
      const sqFt = parseInt(btuMatch[1]);
      const btu = sqFt * 20;
      const tons = btu / 12000;
      responseText = `For ${sqFt} square feet, you'll need approximately ${btu.toLocaleString()} BTUs, or about ${tons.toFixed(1)} tons of cooling capacity.`;
    } else {
      responseText = "I can help with paint calculations, voltage drop, and BTU sizing. Try saying something like 'calculate paint for a 12 by 15 room'.";
    }
    
    setResponse(responseText);
    setIsProcessing(false);
    await speakResponse(responseText);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({ title: 'Speech recognition not supported', variant: 'destructive' });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current];
      setTranscript(result[0].transcript);
      
      if (result.isFinal) {
        processCommand(result[0].transcript);
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        toast({ title: 'Microphone access denied', variant: 'destructive' });
      }
    };

    recognitionRef.current.start();
    setIsListening(true);
    setTranscript('');
    setResponse('');
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center py-6">
      <motion.button
        onClick={isListening ? stopListening : startListening}
        disabled={isProcessing || isSpeaking}
        animate={{ 
          scale: isListening ? [1, 1.1, 1] : 1,
          boxShadow: isListening ? '0 0 40px rgba(147, 51, 234, 0.5)' : '0 0 20px rgba(147, 51, 234, 0.3)'
        }}
        transition={{ repeat: isListening ? Infinity : 0, duration: 1.5 }}
        className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all ${
          isListening 
            ? 'bg-gradient-to-br from-red-500 via-pink-500 to-purple-500' 
            : isSpeaking
            ? 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500'
            : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'
        } ${isProcessing ? 'opacity-50' : ''}`}
        data-testid="button-voice-mic"
      >
        {isProcessing ? (
          <RefreshCw className="w-10 h-10 text-white animate-spin" />
        ) : isSpeaking ? (
          <Volume2 className="w-10 h-10 text-white" />
        ) : (
          <Mic className="w-10 h-10 text-white" />
        )}
      </motion.button>
      
      <div className="text-center mb-4 min-h-[60px]">
        {isListening && (
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Listening...
          </div>
        )}
        {transcript && (
          <p className="text-white font-medium mb-2">"{transcript}"</p>
        )}
        {response && !isListening && (
          <p className="text-slate-400 text-sm">{response}</p>
        )}
        {!transcript && !isListening && !response && (
          <p className="text-slate-500 text-sm">
            Tap the mic and say something like:<br />
            "Calculate paint for a 12 by 15 room"
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 gap-1">
          <Sparkles className="w-3 h-3" />
          Powered by ElevenLabs
        </Badge>
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
      // Painting
      case 'paint_gallon':
      case 'primer_calc':
      case 'stain_calc':
      case 'ceiling_calc':
      case 'wallpaper_calc':
        return <PaintCalculator />;
      case 'color_match':
        setShowScanner(true);
        setSelectedCalculator(null);
        return null;
      
      // Electrical
      case 'voltage_drop':
        return <VoltageDropCalculator />;
      case 'wire_sizing':
      case 'amperage':
      case 'breaker_size':
        return <WireSizingCalculator />;
      
      // Plumbing
      case 'pipe_offset':
        return <PipeOffsetCalculator />;
      
      // HVAC
      case 'btu_load':
      case 'heat_pump':
        return <BTUCalculator />;
      case 'duct_sizing':
      case 'airflow_calc':
        return <DuctSizingCalculator />;
      
      // Roofing
      case 'roof_pitch':
      case 'rafter_length':
        return <RoofPitchCalculator />;
      case 'shingle_calc':
      case 'roof_square':
      case 'underlayment':
        return <ShingleCalculator />;
      
      // Carpentry
      case 'stair_stringer':
        return <StairCalculator />;
      
      // Concrete
      case 'concrete_yards':
      case 'slab_calc':
      case 'footing_calc':
        return <ConcreteCalculator />;
      
      // Landscaping
      case 'mulch_gravel':
      case 'topsoil':
        return <MulchCalculator />;
      
      // Universal
      case 'area_calc':
      case 'perimeter_calc':
      case 'circle_calc':
      case 'triangle_calc':
        return <AreaCalculator />;
      case 'labor_est':
      case 'markup_calc':
      case 'material_cost':
        return <LaborEstimator />;
      
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
            {TRADES.map((trade: any) => (
              <motion.button
                key={trade.id}
                onClick={() => {
                  if (!trade.specialOrder) {
                    setSelectedTrade(trade.id);
                    setSelectedCalculator(null);
                  }
                }}
                whileTap={trade.specialOrder ? {} : { scale: 0.95 }}
                className={`relative p-3 rounded-xl border transition-all ${
                  trade.specialOrder 
                    ? 'bg-white/[0.02] border-white/[0.03] opacity-50 cursor-not-allowed'
                    : selectedTrade === trade.id 
                      ? 'bg-white/10 border-white/20' 
                      : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05]'
                }`}
                data-testid={`button-trade-${trade.id}`}
              >
                {trade.specialOrder && (
                  <div className="absolute -top-1 -right-1 bg-amber-500/90 text-[6px] font-bold text-black px-1 py-0.5 rounded-md uppercase">
                    Soon
                  </div>
                )}
                <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-br ${trade.color} flex items-center justify-center shadow-lg mb-2 ${trade.specialOrder ? 'grayscale' : ''}`}>
                  <trade.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-[10px] text-slate-300 text-center font-medium truncate">{trade.name}</p>
                {selectedTrade === trade.id && !trade.specialOrder && (
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
              onClick={() => setSelectedCalculator(null)}
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
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
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
          <VoiceAssistant 
            onClose={() => setShowVoice(false)}
            onCalculation={(type, result) => {
              toast({ 
                title: 'Calculation Complete', 
                description: `${type}: ${JSON.stringify(result)}` 
              });
            }}
          />
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