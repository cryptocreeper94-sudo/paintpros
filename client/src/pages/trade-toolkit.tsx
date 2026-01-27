import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/lib/i18n';
import { LanguageToggle } from '@/components/language-toggle';
import { 
  Calculator, 
  Ruler, 
  Palette, 
  FileText, 
  Cloud, 
  Store, 
  Wrench,
  Download, 
  Smartphone, 
  Share2, 
  Copy, 
  Check,
  Camera,
  ScanLine,
  Droplets,
  Layers,
  Clock,
  DollarSign,
  Mic,
  Image,
  Sun,
  Thermometer,
  Wind,
  MapPin,
  ExternalLink,
  Flashlight,
  Compass,
  Receipt,
  Fuel,
  Navigation,
  ChevronRight,
  ChevronLeft,
  Lock,
  Sparkles,
  Zap,
  Shield,
  Star,
  Menu,
  X,
  Home,
  Activity,
  TrendingUp,
  BarChart3,
  Target,
  Award,
  Crown
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ColorScanner } from '@/components/color-scanner';
import { ColorVisualizer } from '@/components/color-visualizer';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Shared estimate data across all tools
interface EstimateData {
  // From Measure Panel
  roomLength: string;
  roomWidth: string;
  ceilingHeight: string;
  floorSqFt: number;
  wallSqFt: number;
  // From Color Match
  selectedColors: Array<{ name: string; hex: string; brand?: string }>;
  // From Visualizer  
  roomImageUrl?: string;
  // Pricing
  pricePerSqFt: number;
  laborHours: string;
  hourlyRate: string;
}

// Premium animated gradient background
function PremiumBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-600/5 rounded-full blur-3xl animate-pulse delay-500" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
    </div>
  );
}

// Premium glass card component
function GlassPanel({ children, className = '', glow = false }: { children: React.ReactNode; className?: string; glow?: boolean }) {
  return (
    <div className={`relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl ${glow ? 'shadow-lg shadow-blue-500/10' : ''} ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl pointer-events-none" />
      <div className="relative">{children}</div>
    </div>
  );
}

// Quick stat display
function QuickStat({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-lg font-bold text-white">{value}</p>
        <p className="text-xs text-slate-400">{label}</p>
      </div>
    </div>
  );
}

// Feature tile for dashboard
function FeatureTile({ 
  icon: Icon, 
  label, 
  sublabel, 
  color, 
  onClick, 
  badge,
  live 
}: { 
  icon: any; 
  label: string; 
  sublabel: string; 
  color: string; 
  onClick: () => void; 
  badge?: string;
  live?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="relative group text-left w-full"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <GlassPanel className="p-4 transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/10">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {badge && (
            <Badge className="bg-gradient-to-r from-amber-500/80 to-orange-500/80 text-white text-[10px] border-0">
              {badge}
            </Badge>
          )}
          {live && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-[10px] text-green-400">LIVE</span>
            </div>
          )}
        </div>
        <h3 className="font-semibold text-white text-sm mb-1">{label}</h3>
        <p className="text-xs text-slate-400">{sublabel}</p>
        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      </GlassPanel>
    </motion.button>
  );
}

// Measure Panel
function MeasurePanel({ onBack }: { onBack: () => void }) {
  const [roomLength, setRoomLength] = useState('');
  const [roomWidth, setRoomWidth] = useState('');
  const [ceilingHeight, setCeilingHeight] = useState('8');
  const [ladderHeight, setLadderHeight] = useState('');
  const [wastePercent, setWastePercent] = useState('10');
  const [materialQty, setMaterialQty] = useState('');
  const { t } = useI18n();

  const floorSqFt = roomLength && roomWidth ? parseFloat(roomLength) * parseFloat(roomWidth) : 0;
  const wallSqFt = roomLength && roomWidth && ceilingHeight 
    ? 2 * (parseFloat(roomLength) + parseFloat(roomWidth)) * parseFloat(ceilingHeight) 
    : 0;
  const totalSqFt = wallSqFt + floorSqFt;
  const recommendedLadder = ladderHeight ? Math.ceil(parseFloat(ladderHeight) + 4) : 0;
  const materialWithWaste = materialQty && wastePercent 
    ? parseFloat(materialQty) * (1 + parseFloat(wastePercent) / 100) 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4">
        <ChevronLeft className="w-4 h-4" />
        <span className="text-sm">{t('common.back')}</span>
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Ruler className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{t('toolkit.measure')}</h2>
          <p className="text-sm text-slate-400">{t('toolkit.measureDesc')}</p>
        </div>
      </div>

      <GlassPanel className="p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-blue-400" />
          {t('room.title')}
        </h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <Label className="text-slate-400 text-xs mb-1.5 block">{t('room.length')}</Label>
            <Input 
              type="number" 
              value={roomLength} 
              onChange={(e) => setRoomLength(e.target.value)}
              placeholder="12"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-12 text-lg"
              data-testid="input-room-length"
            />
          </div>
          <div>
            <Label className="text-slate-400 text-xs mb-1.5 block">{t('room.width')}</Label>
            <Input 
              type="number" 
              value={roomWidth} 
              onChange={(e) => setRoomWidth(e.target.value)}
              placeholder="10"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-12 text-lg"
              data-testid="input-room-width"
            />
          </div>
        </div>
        <div className="mb-4">
          <Label className="text-slate-400 text-xs mb-1.5 block">{t('room.height')}</Label>
          <Input 
            type="number" 
            value={ceilingHeight} 
            onChange={(e) => setCeilingHeight(e.target.value)}
            placeholder="8"
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-12 text-lg"
            data-testid="input-ceiling-height"
          />
        </div>
        {floorSqFt > 0 && (
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl p-4 text-center border border-blue-500/20">
              <p className="text-2xl font-bold text-blue-400">{floorSqFt.toLocaleString()}</p>
              <p className="text-xs text-slate-400">{t('toolkit.floorSF')}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl p-4 text-center border border-purple-500/20">
              <p className="text-2xl font-bold text-purple-400">{wallSqFt.toLocaleString()}</p>
              <p className="text-xs text-slate-400">{t('toolkit.wallSF')}</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 rounded-xl p-4 text-center border border-cyan-500/20">
              <p className="text-2xl font-bold text-cyan-400">{totalSqFt.toLocaleString()}</p>
              <p className="text-xs text-slate-400">{t('toolkit.totalSF')}</p>
            </div>
          </div>
        )}
      </GlassPanel>

      <div className="grid grid-cols-2 gap-3">
        <GlassPanel className="p-4">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm">
            <Layers className="w-4 h-4 text-orange-400" />
            Ladder Height
          </h3>
          <Input 
            type="number" 
            value={ladderHeight} 
            onChange={(e) => setLadderHeight(e.target.value)}
            placeholder="Working height"
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 mb-2"
            data-testid="input-ladder-height"
          />
          {recommendedLadder > 0 && (
            <div className="bg-orange-500/10 rounded-lg p-2 text-center border border-orange-500/20">
              <p className="text-xl font-bold text-orange-400">{recommendedLadder}ft</p>
              <p className="text-[10px] text-slate-400">Recommended</p>
            </div>
          )}
        </GlassPanel>

        <GlassPanel className="p-4">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm">
            <Calculator className="w-4 h-4 text-green-400" />
            Waste Calc
          </h3>
          <div className="space-y-2">
            <Input 
              type="number" 
              value={materialQty} 
              onChange={(e) => setMaterialQty(e.target.value)}
              placeholder="Material qty"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            />
            <Input 
              type="number" 
              value={wastePercent} 
              onChange={(e) => setWastePercent(e.target.value)}
              placeholder="Waste %"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            />
          </div>
          {materialWithWaste > 0 && (
            <div className="bg-green-500/10 rounded-lg p-2 text-center border border-green-500/20 mt-2">
              <p className="text-lg font-bold text-green-400">{materialWithWaste.toFixed(1)}</p>
              <p className="text-[10px] text-slate-400">With Waste</p>
            </div>
          )}
        </GlassPanel>
      </div>
    </motion.div>
  );
}

// Paint Panel
function PaintPanel({ onBack, onOpenScanner }: { onBack: () => void; onOpenScanner: () => void }) {
  const [gallonCoverage] = useState(350);
  const [sqFtToPaint, setSqFtToPaint] = useState('');
  const [coats, setCoats] = useState('2');
  
  const gallonsNeeded = sqFtToPaint && coats 
    ? Math.ceil((parseFloat(sqFtToPaint) * parseFloat(coats)) / gallonCoverage) 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4">
        <ChevronLeft className="w-4 h-4" />
        <span className="text-sm">Back to Dashboard</span>
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
          <Palette className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Paint Tools</h2>
          <p className="text-sm text-slate-400">Color matching & calculations</p>
        </div>
      </div>

      <motion.button
        onClick={onOpenScanner}
        className="w-full"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 p-[1px]">
          <div className="bg-slate-900/90 backdrop-blur rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <ScanLine className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white">Color Match Scanner</h3>
                  <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] border-0">
                    <Sparkles className="w-2.5 h-2.5 mr-0.5" />
                    PRO
                  </Badge>
                </div>
                <p className="text-sm text-slate-300">Scan any surface to find matching paint colors</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </div>
      </motion.button>

      <GlassPanel className="p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Droplets className="w-4 h-4 text-purple-400" />
          Paint Calculator
        </h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <Label className="text-slate-400 text-xs mb-1.5 block">Area (sq ft)</Label>
            <Input 
              type="number" 
              value={sqFtToPaint} 
              onChange={(e) => setSqFtToPaint(e.target.value)}
              placeholder="500"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-12 text-lg"
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
            />
          </div>
        </div>
        {gallonsNeeded > 0 && (
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-xl p-4 text-center border border-purple-500/20">
            <p className="text-4xl font-bold text-purple-400">{gallonsNeeded}</p>
            <p className="text-sm text-slate-400">Gallons Needed</p>
            <p className="text-xs text-slate-500 mt-1">@ {gallonCoverage} sq ft/gallon</p>
          </div>
        )}
      </GlassPanel>

      <GlassPanel className="p-4">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm">
          <Layers className="w-4 h-4 text-cyan-400" />
          Sheen Guide
        </h3>
        <div className="space-y-2">
          {[
            { sheen: 'Flat/Matte', use: 'Ceilings, low-traffic walls', dur: '★★☆' },
            { sheen: 'Eggshell', use: 'Living rooms, bedrooms', dur: '★★★' },
            { sheen: 'Satin', use: 'High-traffic, kitchens', dur: '★★★★' },
            { sheen: 'Semi-Gloss', use: 'Trim, doors, bathrooms', dur: '★★★★★' },
          ].map((item) => (
            <div key={item.sheen} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
              <div>
                <p className="text-sm text-white font-medium">{item.sheen}</p>
                <p className="text-xs text-slate-400">{item.use}</p>
              </div>
              <span className="text-xs text-amber-400">{item.dur}</span>
            </div>
          ))}
        </div>
      </GlassPanel>
    </motion.div>
  );
}

// Estimate Panel
function EstimatePanel({ onBack }: { onBack: () => void }) {
  const [sqFt, setSqFt] = useState('');
  const [pricePerSqFt, setPricePerSqFt] = useState('3.50');
  const [materialCost, setMaterialCost] = useState('');
  const [laborHours, setLaborHours] = useState('');
  const [hourlyRate, setHourlyRate] = useState('45');
  const [markup, setMarkup] = useState('30');

  const laborTotal = laborHours && hourlyRate ? parseFloat(laborHours) * parseFloat(hourlyRate) : 0;
  const materialTotal = materialCost ? parseFloat(materialCost) : 0;
  const subtotal = laborTotal + materialTotal;
  const markupAmount = subtotal * (parseFloat(markup) / 100);
  const grandTotal = subtotal + markupAmount;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4">
        <ChevronLeft className="w-4 h-4" />
        <span className="text-sm">Back to Dashboard</span>
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
          <DollarSign className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Estimate Builder</h2>
          <p className="text-sm text-slate-400">Quick job pricing</p>
        </div>
      </div>

      <GlassPanel className="p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          Labor Estimate
        </h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <Label className="text-slate-400 text-xs mb-1.5 block">Hours</Label>
            <Input 
              type="number" 
              value={laborHours} 
              onChange={(e) => setLaborHours(e.target.value)}
              placeholder="8"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-12 text-lg"
            />
          </div>
          <div>
            <Label className="text-slate-400 text-xs mb-1.5 block">$/Hour</Label>
            <Input 
              type="number" 
              value={hourlyRate} 
              onChange={(e) => setHourlyRate(e.target.value)}
              placeholder="45"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-12 text-lg"
            />
          </div>
        </div>
        {laborTotal > 0 && (
          <div className="bg-blue-500/10 rounded-xl p-3 text-center border border-blue-500/20">
            <p className="text-2xl font-bold text-blue-400">${laborTotal.toLocaleString()}</p>
            <p className="text-xs text-slate-400">Labor Total</p>
          </div>
        )}
      </GlassPanel>

      <GlassPanel className="p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Receipt className="w-4 h-4 text-green-400" />
          Job Totals
        </h3>
        <div className="space-y-3 mb-4">
          <div>
            <Label className="text-slate-400 text-xs mb-1.5 block">Material Cost</Label>
            <Input 
              type="number" 
              value={materialCost} 
              onChange={(e) => setMaterialCost(e.target.value)}
              placeholder="250"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
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
            />
          </div>
        </div>
        {grandTotal > 0 && (
          <div className="space-y-2 pt-3 border-t border-white/10">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Labor</span>
              <span className="text-white">${laborTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Materials</span>
              <span className="text-white">${materialTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Markup ({markup}%)</span>
              <span className="text-white">${markupAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/10">
              <span className="text-white font-semibold">Total</span>
              <span className="text-2xl font-bold text-green-400">${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        )}
      </GlassPanel>
    </motion.div>
  );
}

// Weather Panel
function WeatherPanel({ onBack }: { onBack: () => void }) {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/weather')
      .then(res => res.json())
      .then(data => {
        setWeather(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const canPaintExterior = weather && weather.temp >= 50 && weather.temp <= 85 && weather.humidity < 85 && weather.precipitation === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4">
        <ChevronLeft className="w-4 h-4" />
        <span className="text-sm">Back to Dashboard</span>
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <Cloud className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Weather Check</h2>
          <p className="text-sm text-slate-400">Exterior painting conditions</p>
        </div>
      </div>

      {loading ? (
        <GlassPanel className="p-8 text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400">Loading weather...</p>
        </GlassPanel>
      ) : weather ? (
        <>
          <GlassPanel className={`p-5 border-2 ${canPaintExterior ? 'border-green-500/30' : 'border-amber-500/30'}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-16 h-16 rounded-2xl ${canPaintExterior ? 'bg-green-500/20' : 'bg-amber-500/20'} flex items-center justify-center`}>
                {canPaintExterior ? (
                  <Check className="w-8 h-8 text-green-400" />
                ) : (
                  <X className="w-8 h-8 text-amber-400" />
                )}
              </div>
              <div>
                <h3 className={`text-xl font-bold ${canPaintExterior ? 'text-green-400' : 'text-amber-400'}`}>
                  {canPaintExterior ? 'Good Conditions' : 'Caution'}
                </h3>
                <p className="text-sm text-slate-400">
                  {canPaintExterior ? 'Suitable for exterior painting' : 'Check conditions before exterior work'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <Thermometer className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                <p className="text-2xl font-bold text-white">{weather.temp}°F</p>
                <p className="text-xs text-slate-400">Temperature</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <Droplets className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <p className="text-2xl font-bold text-white">{weather.humidity}%</p>
                <p className="text-xs text-slate-400">Humidity</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <Wind className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                <p className="text-2xl font-bold text-white">{weather.windSpeed}</p>
                <p className="text-xs text-slate-400">Wind (mph)</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <Cloud className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-white capitalize">{weather.condition}</p>
                <p className="text-xs text-slate-400">Condition</p>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel className="p-4">
            <h3 className="text-white font-semibold mb-3 text-sm">Ideal Exterior Conditions</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Temperature</span>
                <span className="text-white">50°F - 85°F</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Humidity</span>
                <span className="text-white">&lt; 85%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Rain</span>
                <span className="text-white">None</span>
              </div>
            </div>
          </GlassPanel>
        </>
      ) : (
        <GlassPanel className="p-8 text-center">
          <Cloud className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-400">Could not load weather data</p>
        </GlassPanel>
      )}
    </motion.div>
  );
}

// Stores Panel
function StoresPanel({ onBack }: { onBack: () => void }) {
  const stores = [
    { name: 'Home Depot', icon: Store, color: 'bg-orange-500', url: 'https://homedepot.com' },
    { name: "Lowe's", icon: Store, color: 'bg-blue-600', url: 'https://lowes.com' },
    { name: 'Sherwin-Williams', icon: Palette, color: 'bg-blue-500', url: 'https://sherwin-williams.com/store-locator' },
    { name: 'Benjamin Moore', icon: Palette, color: 'bg-red-500', url: 'https://benjaminmoore.com/en-us/store-locator' },
    { name: 'PPG Paints', icon: Palette, color: 'bg-green-600', url: 'https://ppgpaints.com' },
    { name: 'United Rentals', icon: Wrench, color: 'bg-yellow-500', url: 'https://unitedrentals.com' },
    { name: 'Sunbelt Rentals', icon: Wrench, color: 'bg-amber-500', url: 'https://sunbeltrentals.com' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4">
        <ChevronLeft className="w-4 h-4" />
        <span className="text-sm">Back to Dashboard</span>
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/30">
          <Store className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Store Links</h2>
          <p className="text-sm text-slate-400">Quick access to suppliers</p>
        </div>
      </div>

      <div className="grid gap-3">
        {stores.map((store) => (
          <motion.a
            key={store.name}
            href={store.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <GlassPanel className="p-4 transition-all hover:border-white/20">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${store.color} flex items-center justify-center`}>
                  <store.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{store.name}</h3>
                  <p className="text-xs text-slate-400">Find nearby locations</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500" />
              </div>
            </GlassPanel>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}

// Quick Tools Panel
function QuickToolsPanel({ onBack }: { onBack: () => void }) {
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [tipAmount, setTipAmount] = useState('');
  const [tipPercent, setTipPercent] = useState('20');

  const tipTotal = tipAmount && tipPercent 
    ? parseFloat(tipAmount) * (parseFloat(tipPercent) / 100) 
    : 0;

  const toggleFlashlight = async () => {
    try {
      if ('mediaDevices' in navigator) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        const track = stream.getVideoTracks()[0];
        // @ts-ignore - torch is not in the TypeScript definitions
        await track.applyConstraints({ advanced: [{ torch: !flashlightOn }] });
        setFlashlightOn(!flashlightOn);
      }
    } catch (err) {
      console.log('Flashlight not available');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4">
        <ChevronLeft className="w-4 h-4" />
        <span className="text-sm">Back to Dashboard</span>
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <Wrench className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Quick Tools</h2>
          <p className="text-sm text-slate-400">Handy field utilities</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <motion.button
          onClick={toggleFlashlight}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <GlassPanel className={`p-6 text-center ${flashlightOn ? 'border-yellow-400/50 bg-yellow-400/10' : ''}`}>
            <Flashlight className={`w-10 h-10 mx-auto mb-2 ${flashlightOn ? 'text-yellow-400' : 'text-slate-400'}`} />
            <p className="text-sm font-medium text-white">Flashlight</p>
            <p className="text-xs text-slate-400">{flashlightOn ? 'ON' : 'Tap to turn on'}</p>
          </GlassPanel>
        </motion.button>

        <motion.button
          onClick={() => window.open('https://www.gasbuddy.com/home', '_blank')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <GlassPanel className="p-6 text-center">
            <Fuel className="w-10 h-10 text-green-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-white">Gas Prices</p>
            <p className="text-xs text-slate-400">Find cheap gas</p>
          </GlassPanel>
        </motion.button>
      </div>

      <GlassPanel className="p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Receipt className="w-4 h-4 text-green-400" />
          Tip Calculator
        </h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <Label className="text-slate-400 text-xs mb-1.5 block">Bill Amount</Label>
            <Input 
              type="number" 
              value={tipAmount} 
              onChange={(e) => setTipAmount(e.target.value)}
              placeholder="50.00"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            />
          </div>
          <div>
            <Label className="text-slate-400 text-xs mb-1.5 block">Tip %</Label>
            <Input 
              type="number" 
              value={tipPercent} 
              onChange={(e) => setTipPercent(e.target.value)}
              placeholder="20"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            />
          </div>
        </div>
        {tipTotal > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-500/10 rounded-xl p-3 text-center border border-green-500/20">
              <p className="text-xl font-bold text-green-400">${tipTotal.toFixed(2)}</p>
              <p className="text-xs text-slate-400">Tip Amount</p>
            </div>
            <div className="bg-blue-500/10 rounded-xl p-3 text-center border border-blue-500/20">
              <p className="text-xl font-bold text-blue-400">${(parseFloat(tipAmount) + tipTotal).toFixed(2)}</p>
              <p className="text-xs text-slate-400">Total</p>
            </div>
          </div>
        )}
      </GlassPanel>

      <motion.a
        href="https://www.google.com/maps"
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <GlassPanel className="p-4 transition-all hover:border-white/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
              <Navigation className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">Navigation</h3>
              <p className="text-xs text-slate-400">Open Google Maps</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500" />
          </div>
        </GlassPanel>
      </motion.a>
    </motion.div>
  );
}

// Main Dashboard
function Dashboard({ onNavigate }: { onNavigate: (panel: string) => void }) {
  const [weather, setWeather] = useState<any>(null);
  const { t } = useI18n();
  
  useEffect(() => {
    fetch('/api/weather')
      .then(res => res.json())
      .then(data => setWeather(data))
      .catch(() => {});
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Language Toggle */}
      <div className="flex justify-end">
        <LanguageToggle variant="compact" className="text-white hover:bg-white/10" />
      </div>

      {/* Welcome Section */}
      <div className="text-center pt-2 pb-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 mb-4 border border-white/10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Wrench className="w-7 h-7 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">{t('toolkit.title')}</h1>
        <p className="text-slate-400 text-sm">{t('toolkit.subtitle')}</p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <Badge className="bg-gradient-to-r from-amber-500/80 to-orange-500/80 text-white border-0 gap-1">
            <Crown className="w-3 h-3" />
            {t('common.pro')}
          </Badge>
          <Badge variant="outline" className="border-white/20 text-slate-300">v2.0</Badge>
        </div>
      </div>

      {/* Quick Stats */}
      {weather && (
        <div className="grid grid-cols-2 gap-3">
          <QuickStat 
            label={t('weather.temperature')} 
            value={`${weather.temp}°F`} 
            icon={Thermometer} 
            color="bg-gradient-to-br from-orange-500 to-red-500"
          />
          <QuickStat 
            label={t('weather.humidity')} 
            value={`${weather.humidity}%`} 
            icon={Droplets} 
            color="bg-gradient-to-br from-blue-500 to-cyan-500"
          />
        </div>
      )}

      {/* Feature Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-1">{t('toolkit.tools')}</h2>
        <div className="grid grid-cols-2 gap-3">
          <FeatureTile
            icon={Camera}
            label={t('toolkit.roomVisualizer') || 'Room Visualizer'}
            sublabel={t('toolkit.roomVisualizerDesc') || 'See paint colors on your walls'}
            color="bg-gradient-to-br from-pink-500 to-rose-600"
            onClick={() => onNavigate('visualizer')}
            badge={t('common.new')}
          />
          <FeatureTile
            icon={Ruler}
            label={t('toolkit.measure')}
            sublabel={t('toolkit.measureDesc')}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            onClick={() => onNavigate('measure')}
          />
          <FeatureTile
            icon={Palette}
            label={t('toolkit.colorMatch') || 'Color Match'}
            sublabel={t('toolkit.colorMatchDesc') || 'Scan & match any color'}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            onClick={() => onNavigate('paint')}
          />
          <FeatureTile
            icon={DollarSign}
            label={t('estimate.title')}
            sublabel={t('tradeworks.quickEstimate')}
            color="bg-gradient-to-br from-green-500 to-emerald-600"
            onClick={() => onNavigate('estimate')}
          />
          <FeatureTile
            icon={Cloud}
            label={t('toolkit.weather')}
            sublabel={t('toolkit.paintingConditions')}
            color="bg-gradient-to-br from-cyan-500 to-blue-600"
            onClick={() => onNavigate('weather')}
            live
          />
          <FeatureTile
            icon={Store}
            label={t('toolkit.supplies')}
            sublabel={t('toolkit.suppliesDesc')}
            color="bg-gradient-to-br from-red-500 to-orange-600"
            onClick={() => onNavigate('stores')}
          />
          <FeatureTile
            icon={Wrench}
            label={t('toolkit.tools')}
            sublabel={t('toolkit.toolsDesc')}
            color="bg-gradient-to-br from-amber-500 to-yellow-600"
            onClick={() => onNavigate('tools')}
          />
        </div>
      </div>

      {/* Pro Features CTA */}
      <GlassPanel glow className="p-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
            <ScanLine className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-white">{t('toolkit.colorMatch')}</h3>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-sm text-slate-400">{t('toolkit.colorMatchDesc')}</p>
          </div>
        </div>
        <Button 
          onClick={() => onNavigate('paint')}
          className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          {t('common.getStarted')}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </GlassPanel>

      {/* Powered By */}
      <div className="text-center pt-4 pb-20">
        <p className="text-xs text-slate-500">Powered by</p>
        <p className="text-sm font-semibold text-slate-400">PaintPros.io</p>
      </div>
    </motion.div>
  );
}

export default function TradeToolkit() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [currentPanel, setCurrentPanel] = useState('dashboard');
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const { toast } = useToast();
  
  const appUrl = typeof window !== 'undefined' ? `${window.location.origin}/trade-toolkit` : '';

  // Detect iOS devices
  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;
    
    if (isIOSDevice && !isInStandaloneMode) {
      setIsIOS(true);
      // Show guide after a short delay if not dismissed before
      const dismissed = localStorage.getItem('ios-install-guide-dismissed');
      if (!dismissed) {
        setTimeout(() => setShowIOSGuide(true), 2000);
      }
    }
  }, []);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    document.title = 'Trade Toolkit Pro - Field Tools';
    
    let themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
      themeColor = document.createElement('meta');
      themeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(themeColor);
    }
    themeColor.setAttribute('content', '#0f172a');
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    setIsInstalling(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        toast({ title: 'App installed!', description: 'Find it on your home screen' });
      }
    } catch (error) {
      console.error('Install failed:', error);
    } finally {
      setIsInstalling(false);
      setDeferredPrompt(null);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Trade Toolkit Pro',
          text: 'Professional field tools for contractors. Calculators, paint tools, weather & more!',
          url: appUrl
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setShareOpen(true);
        }
      }
    } else {
      setShareOpen(true);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      toast({ title: 'Link copied!', description: 'Ready to share' });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ title: 'Could not copy', variant: 'destructive' });
    }
  };

  const handleNavigate = (panel: string) => {
    if (panel === 'visualizer') {
      setShowVisualizer(true);
    } else {
      setCurrentPanel(panel);
    }
  };

  const renderPanel = () => {
    switch (currentPanel) {
      case 'measure':
        return <MeasurePanel onBack={() => setCurrentPanel('dashboard')} />;
      case 'paint':
        return <PaintPanel onBack={() => setCurrentPanel('dashboard')} onOpenScanner={() => setShowScanner(true)} />;
      case 'estimate':
        return <EstimatePanel onBack={() => setCurrentPanel('dashboard')} />;
      case 'weather':
        return <WeatherPanel onBack={() => setCurrentPanel('dashboard')} />;
      case 'stores':
        return <StoresPanel onBack={() => setCurrentPanel('dashboard')} />;
      case 'tools':
        return <QuickToolsPanel onBack={() => setCurrentPanel('dashboard')} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen relative">
      <PremiumBackground />
      
      <div className="max-w-lg mx-auto px-4 py-4 pb-28">
        {/* Install Banner - Android */}
        {!isInstalled && deferredPrompt && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <GlassPanel glow className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-sm">Install App</h3>
                  <p className="text-xs text-slate-400">Add to home screen for quick access</p>
                </div>
                <Button 
                  onClick={handleInstall} 
                  disabled={isInstalling}
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 gap-1"
                  data-testid="button-install-pwa"
                >
                  <Download className="w-4 h-4" />
                  Install
                </Button>
              </div>
            </GlassPanel>
          </motion.div>
        )}

        {/* Install Guide - iPhone/iOS */}
        {isIOS && showIOSGuide && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <GlassPanel glow className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-white text-sm">Add to Home Screen</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-slate-400 hover:text-white"
                      onClick={() => {
                        setShowIOSGuide(false);
                        localStorage.setItem('ios-install-guide-dismissed', 'true');
                      }}
                      data-testid="button-dismiss-ios-guide"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">Follow these steps to install on your iPhone:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-400 font-bold">1</span>
                      </div>
                      <span>Tap the <Share2 className="w-4 h-4 inline text-blue-400" /> Share button at the bottom</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-400 font-bold">2</span>
                      </div>
                      <span>Scroll down and tap "Add to Home Screen"</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-400 font-bold">3</span>
                      </div>
                      <span>Tap "Add" in the top right corner</span>
                    </div>
                  </div>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        )}

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {renderPanel()}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            {currentPanel !== 'dashboard' && (
              <Button 
                onClick={() => setCurrentPanel('dashboard')} 
                variant="ghost" 
                size="sm"
                className="text-slate-400 hover:text-white gap-1"
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
            )}
            {currentPanel === 'dashboard' && (
              <Button 
                onClick={handleShare} 
                variant="ghost" 
                size="sm"
                className="text-slate-400 hover:text-white gap-1 flex-1"
                data-testid="button-share"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            )}
            <Dialog open={shareOpen} onOpenChange={setShareOpen}>
              <DialogContent className="bg-slate-900/95 backdrop-blur-xl border-white/10 max-w-sm">
                <DialogHeader>
                  <DialogTitle className="text-white text-center">Share Trade Toolkit</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4 py-4">
                  <div className="bg-white p-4 rounded-xl">
                    <QRCodeSVG value={appUrl} size={180} level="H" includeMargin />
                  </div>
                  <div className="w-full flex gap-2">
                    <div className="flex-1 bg-white/5 rounded-lg px-3 py-2 text-sm text-slate-300 truncate border border-white/10">
                      {appUrl}
                    </div>
                    <Button onClick={handleCopyLink} size="icon" variant="outline" className="border-white/10" data-testid="button-copy">
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Badge variant="outline" className="border-white/10 text-slate-400 gap-1 text-xs">
              <Zap className="w-3 h-3" />
              Powered by PaintPros.io
            </Badge>
          </div>
        </div>
      </div>

      {/* Color Scanner Modal */}
      <ColorScanner 
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onColorSelect={(color) => {
          toast({ 
            title: 'Color matched!', 
            description: `${color.name} - ${color.hex}` 
          });
        }}
      />

      {/* Room Visualizer Modal */}
      <ColorVisualizer 
        isOpen={showVisualizer}
        onClose={() => setShowVisualizer(false)}
      />
    </div>
  );
}
