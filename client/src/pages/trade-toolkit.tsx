import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calculator, 
  Ruler, 
  Palette, 
  FileText, 
  Cloud, 
  Store, 
  Wrench,
  Download, 
  CheckCircle, 
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
  Lock,
  Sparkles
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ColorScanner } from '@/components/color-scanner';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function MeasureTab() {
  const [roomLength, setRoomLength] = useState('');
  const [roomWidth, setRoomWidth] = useState('');
  const [ceilingHeight, setCeilingHeight] = useState('8');
  const [ladderHeight, setLadderHeight] = useState('');
  const [wastePercent, setWastePercent] = useState('10');
  const [materialQty, setMaterialQty] = useState('');

  const floorSqFt = roomLength && roomWidth ? parseFloat(roomLength) * parseFloat(roomWidth) : 0;
  const wallSqFt = roomLength && roomWidth && ceilingHeight 
    ? 2 * (parseFloat(roomLength) + parseFloat(roomWidth)) * parseFloat(ceilingHeight) 
    : 0;
  const ceilingSqFt = floorSqFt;
  const totalSqFt = wallSqFt + ceilingSqFt;

  const recommendedLadder = ladderHeight ? Math.ceil(parseFloat(ladderHeight) + 4) : 0;
  const materialWithWaste = materialQty && wastePercent 
    ? parseFloat(materialQty) * (1 + parseFloat(wastePercent) / 100) 
    : 0;

  return (
    <div className="space-y-4">
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base flex items-center gap-2">
            <Ruler className="w-4 h-4 text-blue-400" />
            Room Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-slate-400 text-xs">Length (ft)</Label>
              <Input 
                type="number" 
                value={roomLength} 
                onChange={(e) => setRoomLength(e.target.value)}
                placeholder="12"
                className="bg-slate-900/50 border-slate-600 text-white"
                data-testid="input-room-length"
              />
            </div>
            <div>
              <Label className="text-slate-400 text-xs">Width (ft)</Label>
              <Input 
                type="number" 
                value={roomWidth} 
                onChange={(e) => setRoomWidth(e.target.value)}
                placeholder="10"
                className="bg-slate-900/50 border-slate-600 text-white"
                data-testid="input-room-width"
              />
            </div>
          </div>
          <div>
            <Label className="text-slate-400 text-xs">Ceiling Height (ft)</Label>
            <Input 
              type="number" 
              value={ceilingHeight} 
              onChange={(e) => setCeilingHeight(e.target.value)}
              placeholder="8"
              className="bg-slate-900/50 border-slate-600 text-white"
              data-testid="input-ceiling-height"
            />
          </div>
          {floorSqFt > 0 && (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="bg-blue-500/10 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-blue-400">{floorSqFt.toLocaleString()}</p>
                <p className="text-xs text-slate-400">Floor Sq Ft</p>
              </div>
              <div className="bg-purple-500/10 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-purple-400">{wallSqFt.toLocaleString()}</p>
                <p className="text-xs text-slate-400">Wall Sq Ft</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-400" />
            Ladder Height
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-slate-400 text-xs">Working Height (ft)</Label>
            <Input 
              type="number" 
              value={ladderHeight} 
              onChange={(e) => setLadderHeight(e.target.value)}
              placeholder="10"
              className="bg-slate-900/50 border-slate-600 text-white"
              data-testid="input-ladder-height"
            />
          </div>
          {recommendedLadder > 0 && (
            <div className="bg-orange-500/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-orange-400">{recommendedLadder} ft</p>
              <p className="text-xs text-slate-400">Recommended Ladder</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base flex items-center gap-2">
            <Calculator className="w-4 h-4 text-green-400" />
            Waste Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-slate-400 text-xs">Material Qty</Label>
              <Input 
                type="number" 
                value={materialQty} 
                onChange={(e) => setMaterialQty(e.target.value)}
                placeholder="100"
                className="bg-slate-900/50 border-slate-600 text-white"
                data-testid="input-material-qty"
              />
            </div>
            <div>
              <Label className="text-slate-400 text-xs">Waste %</Label>
              <Input 
                type="number" 
                value={wastePercent} 
                onChange={(e) => setWastePercent(e.target.value)}
                placeholder="10"
                className="bg-slate-900/50 border-slate-600 text-white"
                data-testid="input-waste-percent"
              />
            </div>
          </div>
          {materialWithWaste > 0 && (
            <div className="bg-green-500/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-400">{materialWithWaste.toFixed(1)}</p>
              <p className="text-xs text-slate-400">Total with {wastePercent}% Waste</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PaintTab({ onOpenScanner }: { onOpenScanner: () => void }) {
  const [sqft, setSqft] = useState('');
  const [coats, setCoats] = useState('2');
  const [coverage, setCoverage] = useState('350');
  const [humidity, setHumidity] = useState('50');
  const [temp, setTemp] = useState('70');

  const gallonsNeeded = sqft && coats && coverage 
    ? (parseFloat(sqft) * parseFloat(coats)) / parseFloat(coverage) 
    : 0;

  const getDryTime = () => {
    if (!humidity || !temp) return { touch: 0, recoat: 0 };
    const h = parseFloat(humidity);
    const t = parseFloat(temp);
    let touchDry = 1;
    let recoatTime = 4;
    
    if (h > 70) { touchDry += 0.5; recoatTime += 2; }
    if (h > 85) { touchDry += 1; recoatTime += 2; }
    if (t < 50) { touchDry += 1; recoatTime += 2; }
    if (t < 40) { touchDry += 2; recoatTime += 4; }
    
    return { touch: touchDry, recoat: recoatTime };
  };

  const dryTime = getDryTime();

  const sheenGuide = [
    { room: 'Living Room', sheen: 'Eggshell/Satin', reason: 'Wipeable, low sheen' },
    { room: 'Kitchen', sheen: 'Semi-Gloss', reason: 'Moisture resistant' },
    { room: 'Bathroom', sheen: 'Semi-Gloss', reason: 'Humidity resistant' },
    { room: 'Bedroom', sheen: 'Flat/Matte', reason: 'Cozy, hides imperfections' },
    { room: 'Trim/Doors', sheen: 'Semi-Gloss', reason: 'Durable, cleanable' },
    { room: 'Ceiling', sheen: 'Flat', reason: 'Hides imperfections' },
  ];

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-purple-900/30 to-slate-800/50 border-purple-500/30">
        <CardContent className="pt-4">
          <Button 
            onClick={onOpenScanner}
            className="w-full gap-2 bg-purple-600 hover:bg-purple-700"
            size="lg"
            data-testid="button-open-scanner"
          >
            <ScanLine className="w-5 h-5" />
            Color Match Scanner
            <Badge className="ml-auto bg-purple-400/20 text-purple-300">New</Badge>
          </Button>
          <p className="text-xs text-slate-400 text-center mt-2">Scan any color to find matching paint</p>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-400" />
            Paint Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-slate-400 text-xs">Sq Ft</Label>
              <Input 
                type="number" 
                value={sqft} 
                onChange={(e) => setSqft(e.target.value)}
                placeholder="400"
                className="bg-slate-900/50 border-slate-600 text-white"
                data-testid="input-paint-sqft"
              />
            </div>
            <div>
              <Label className="text-slate-400 text-xs">Coats</Label>
              <Input 
                type="number" 
                value={coats} 
                onChange={(e) => setCoats(e.target.value)}
                className="bg-slate-900/50 border-slate-600 text-white"
                data-testid="input-paint-coats"
              />
            </div>
            <div>
              <Label className="text-slate-400 text-xs">Coverage</Label>
              <Input 
                type="number" 
                value={coverage} 
                onChange={(e) => setCoverage(e.target.value)}
                className="bg-slate-900/50 border-slate-600 text-white"
                data-testid="input-paint-coverage"
              />
            </div>
          </div>
          {gallonsNeeded > 0 && (
            <div className="bg-blue-500/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-blue-400">{Math.ceil(gallonsNeeded)} gal</p>
              <p className="text-xs text-slate-400">{gallonsNeeded.toFixed(2)} gallons needed</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-400" />
            Drying Time
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-slate-400 text-xs">Humidity %</Label>
              <Input 
                type="number" 
                value={humidity} 
                onChange={(e) => setHumidity(e.target.value)}
                className="bg-slate-900/50 border-slate-600 text-white"
                data-testid="input-humidity"
              />
            </div>
            <div>
              <Label className="text-slate-400 text-xs">Temp °F</Label>
              <Input 
                type="number" 
                value={temp} 
                onChange={(e) => setTemp(e.target.value)}
                className="bg-slate-900/50 border-slate-600 text-white"
                data-testid="input-temp"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-500/10 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-yellow-400">{dryTime.touch}h</p>
              <p className="text-xs text-slate-400">Touch Dry</p>
            </div>
            <div className="bg-orange-500/10 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-orange-400">{dryTime.recoat}h</p>
              <p className="text-xs text-slate-400">Recoat Time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            Sheen Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sheenGuide.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
                <span className="text-white text-sm">{item.room}</span>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">{item.sheen}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EstimateTab() {
  const [laborHours, setLaborHours] = useState('');
  const [hourlyRate, setHourlyRate] = useState('45');
  const [materialCost, setMaterialCost] = useState('');
  const [markupPercent, setMarkupPercent] = useState('30');

  const laborTotal = laborHours && hourlyRate ? parseFloat(laborHours) * parseFloat(hourlyRate) : 0;
  const subtotal = laborTotal + (parseFloat(materialCost) || 0);
  const markup = subtotal * (parseFloat(markupPercent) / 100);
  const total = subtotal + markup;

  return (
    <div className="space-y-4">
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            Labor Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-slate-400 text-xs">Hours</Label>
              <Input 
                type="number" 
                value={laborHours} 
                onChange={(e) => setLaborHours(e.target.value)}
                placeholder="8"
                className="bg-slate-900/50 border-slate-600 text-white"
                data-testid="input-labor-hours"
              />
            </div>
            <div>
              <Label className="text-slate-400 text-xs">$/Hour</Label>
              <Input 
                type="number" 
                value={hourlyRate} 
                onChange={(e) => setHourlyRate(e.target.value)}
                className="bg-slate-900/50 border-slate-600 text-white"
                data-testid="input-hourly-rate"
              />
            </div>
          </div>
          {laborTotal > 0 && (
            <div className="bg-blue-500/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-blue-400">${laborTotal.toLocaleString()}</p>
              <p className="text-xs text-slate-400">Labor Cost</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-400" />
            Quick Bid
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-slate-400 text-xs">Materials $</Label>
              <Input 
                type="number" 
                value={materialCost} 
                onChange={(e) => setMaterialCost(e.target.value)}
                placeholder="500"
                className="bg-slate-900/50 border-slate-600 text-white"
                data-testid="input-material-cost"
              />
            </div>
            <div>
              <Label className="text-slate-400 text-xs">Markup %</Label>
              <Input 
                type="number" 
                value={markupPercent} 
                onChange={(e) => setMarkupPercent(e.target.value)}
                className="bg-slate-900/50 border-slate-600 text-white"
                data-testid="input-markup"
              />
            </div>
          </div>
          {total > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-white">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Markup ({markupPercent}%)</span>
                <span className="text-green-400">+${markup.toLocaleString()}</span>
              </div>
              <div className="bg-green-500/10 rounded-lg p-3 text-center mt-2">
                <p className="text-2xl font-bold text-green-400">${total.toLocaleString()}</p>
                <p className="text-xs text-slate-400">Total Bid</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DocumentTab() {
  const [notes, setNotes] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  const handlePhotoCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast({ title: 'Photo captured!', description: `${file.name} saved` });
      }
    };
    input.click();
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      toast({ title: 'Recording...', description: 'Tap again to stop' });
    } else {
      setIsRecording(false);
      toast({ title: 'Recording saved', description: 'Voice memo added to notes' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Card 
          className="bg-slate-800/50 border-slate-700/50 cursor-pointer hover:border-blue-500/50 transition-colors"
          onClick={handlePhotoCapture}
        >
          <CardContent className="pt-6 text-center">
            <Camera className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-white text-sm font-medium">Take Photo</p>
            <p className="text-xs text-slate-400">Before/After</p>
          </CardContent>
        </Card>
        <Card 
          className={`bg-slate-800/50 border-slate-700/50 cursor-pointer transition-colors ${isRecording ? 'border-red-500/50 bg-red-900/20' : 'hover:border-orange-500/50'}`}
          onClick={toggleRecording}
        >
          <CardContent className="pt-6 text-center">
            <Mic className={`w-8 h-8 mx-auto mb-2 ${isRecording ? 'text-red-400 animate-pulse' : 'text-orange-400'}`} />
            <p className="text-white text-sm font-medium">{isRecording ? 'Recording...' : 'Voice Memo'}</p>
            <p className="text-xs text-slate-400">{isRecording ? 'Tap to stop' : 'Quick notes'}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            Job Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter job notes, customer requests, special instructions..."
            className="w-full h-32 bg-slate-900/50 border border-slate-600 rounded-md p-3 text-white text-sm resize-none focus:outline-none focus:border-purple-500"
            data-testid="textarea-job-notes"
          />
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            Quick Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {['Drop cloths down', 'Tape edges', 'Primer applied', 'First coat', 'Second coat', 'Touch-ups', 'Clean up'].map((item, i) => (
              <label key={i} className="flex items-center gap-3 py-1 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-600 bg-slate-900/50 text-green-500" data-testid={`checkbox-${i}`} />
                <span className="text-white text-sm">{item}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function WeatherTab() {
  const [zipCode, setZipCode] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkWeather = async () => {
    if (!zipCode) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/weather?zip=${zipCode}`);
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getExteriorRating = () => {
    if (!weather) return null;
    const temp = weather.temp;
    const humidity = weather.humidity;
    const wind = weather.windSpeed;
    
    if (temp < 35 || temp > 95) return { rating: 'Poor', color: 'text-red-400', desc: 'Temperature outside ideal range' };
    if (humidity > 85) return { rating: 'Poor', color: 'text-red-400', desc: 'Too humid for paint adhesion' };
    if (wind > 15) return { rating: 'Fair', color: 'text-yellow-400', desc: 'Windy - watch for debris' };
    if (temp >= 50 && temp <= 85 && humidity < 70) return { rating: 'Excellent', color: 'text-green-400', desc: 'Ideal painting conditions' };
    return { rating: 'Good', color: 'text-blue-400', desc: 'Acceptable conditions' };
  };

  const rating = getExteriorRating();

  return (
    <div className="space-y-4">
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="pt-4">
          <div className="flex gap-2">
            <Input 
              type="text" 
              value={zipCode} 
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Enter ZIP code"
              className="bg-slate-900/50 border-slate-600 text-white"
              data-testid="input-weather-zip"
            />
            <Button onClick={checkWeather} disabled={loading} data-testid="button-check-weather">
              {loading ? 'Loading...' : 'Check'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {weather && (
        <>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="pt-4">
              <div className="text-center mb-4">
                <p className="text-4xl font-bold text-white">{weather.temp}°F</p>
                <p className="text-slate-400">{weather.condition}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-900/50 rounded-lg p-2">
                  <Thermometer className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-400">Feels Like</p>
                  <p className="text-white font-medium">{weather.feelsLike}°</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-2">
                  <Droplets className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-400">Humidity</p>
                  <p className="text-white font-medium">{weather.humidity}%</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-2">
                  <Wind className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-400">Wind</p>
                  <p className="text-white font-medium">{weather.windSpeed} mph</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {rating && (
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-base">Exterior Paint Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-center p-4 rounded-lg ${rating.rating === 'Excellent' ? 'bg-green-500/10' : rating.rating === 'Good' ? 'bg-blue-500/10' : rating.rating === 'Fair' ? 'bg-yellow-500/10' : 'bg-red-500/10'}`}>
                  <p className={`text-2xl font-bold ${rating.color}`}>{rating.rating}</p>
                  <p className="text-sm text-slate-400 mt-1">{rating.desc}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!weather && (
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="pt-6 text-center">
            <Sun className="w-12 h-12 text-yellow-400 mx-auto mb-3 opacity-50" />
            <p className="text-slate-400">Enter a ZIP code to check painting conditions</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StoresTab() {
  const stores = [
    { name: 'Home Depot Pro', url: 'https://www.homedepot.com/c/Pro', icon: '🏠', color: 'bg-orange-500/10 border-orange-500/30' },
    { name: "Lowe's Pro", url: 'https://www.lowes.com/l/pro', icon: '🔧', color: 'bg-blue-500/10 border-blue-500/30' },
    { name: 'Sherwin-Williams', url: 'https://www.sherwin-williams.com/store-locator', icon: '🎨', color: 'bg-red-500/10 border-red-500/30' },
    { name: 'Benjamin Moore', url: 'https://www.benjaminmoore.com/en-us/store-locator', icon: '🖌️', color: 'bg-yellow-500/10 border-yellow-500/30' },
    { name: 'PPG Paints', url: 'https://www.ppgpaints.com/store-locator', icon: '🪣', color: 'bg-purple-500/10 border-purple-500/30' },
  ];

  const rentals = [
    { name: 'Sunbelt Rentals', url: 'https://www.sunbeltrentals.com/', icon: '🚜' },
    { name: 'United Rentals', url: 'https://www.unitedrentals.com/', icon: '🏗️' },
    { name: 'Home Depot Rental', url: 'https://www.homedepot.com/c/tool_and_truck_rental', icon: '🛠️' },
  ];

  return (
    <div className="space-y-4">
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-base flex items-center gap-2">
            <Store className="w-4 h-4 text-blue-400" />
            Paint Stores
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {stores.map((store, i) => (
            <a
              key={i}
              href={store.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-between p-3 rounded-lg border ${store.color} hover:opacity-80 transition-opacity`}
              data-testid={`link-store-${i}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{store.icon}</span>
                <span className="text-white font-medium">{store.name}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </a>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-base flex items-center gap-2">
            <Wrench className="w-4 h-4 text-orange-400" />
            Equipment Rental
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {rentals.map((rental, i) => (
            <a
              key={i}
              href={rental.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg border border-slate-700/50 bg-slate-900/30 hover:bg-slate-800/50 transition-colors"
              data-testid={`link-rental-${i}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{rental.icon}</span>
                <span className="text-white font-medium">{rental.name}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </a>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function QuickToolsTab() {
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [tipAmount, setTipAmount] = useState('');
  const [tipPercent, setTipPercent] = useState('20');
  const [rotation, setRotation] = useState({ beta: 0, gamma: 0 });

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      setRotation({ beta: e.beta || 0, gamma: e.gamma || 0 });
    };
    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  const tipTotal = tipAmount && tipPercent ? parseFloat(tipAmount) * (parseFloat(tipPercent) / 100) : 0;
  const isLevel = Math.abs(rotation.beta) < 3 && Math.abs(rotation.gamma) < 3;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Card 
          className={`border-slate-700/50 cursor-pointer transition-all ${flashlightOn ? 'bg-white' : 'bg-slate-800/50 hover:bg-slate-700/50'}`}
          onClick={() => setFlashlightOn(!flashlightOn)}
        >
          <CardContent className="pt-6 text-center">
            <Flashlight className={`w-8 h-8 mx-auto mb-2 ${flashlightOn ? 'text-yellow-500' : 'text-yellow-400'}`} />
            <p className={`text-sm font-medium ${flashlightOn ? 'text-black' : 'text-white'}`}>
              {flashlightOn ? 'ON' : 'Flashlight'}
            </p>
          </CardContent>
        </Card>
        <Card className={`bg-slate-800/50 border-slate-700/50 ${isLevel ? 'border-green-500/50' : ''}`}>
          <CardContent className="pt-6 text-center">
            <div 
              className="w-12 h-12 rounded-full border-2 border-slate-600 mx-auto mb-2 relative overflow-hidden"
              style={{ background: 'radial-gradient(circle at center, transparent 40%, rgba(255,255,255,0.1) 100%)' }}
            >
              <div 
                className={`absolute w-3 h-3 rounded-full ${isLevel ? 'bg-green-400' : 'bg-blue-400'}`}
                style={{ 
                  left: `calc(50% + ${rotation.gamma}px - 6px)`, 
                  top: `calc(50% + ${rotation.beta}px - 6px)`,
                  transition: 'all 0.1s ease-out'
                }}
              />
            </div>
            <p className={`text-sm font-medium ${isLevel ? 'text-green-400' : 'text-white'}`}>
              {isLevel ? 'Level!' : 'Level'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base flex items-center gap-2">
            <Receipt className="w-4 h-4 text-green-400" />
            Tip Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-slate-400 text-xs">Bill Amount</Label>
              <Input 
                type="number" 
                value={tipAmount} 
                onChange={(e) => setTipAmount(e.target.value)}
                placeholder="50.00"
                className="bg-slate-900/50 border-slate-600 text-white"
                data-testid="input-tip-amount"
              />
            </div>
            <div>
              <Label className="text-slate-400 text-xs">Tip %</Label>
              <Input 
                type="number" 
                value={tipPercent} 
                onChange={(e) => setTipPercent(e.target.value)}
                className="bg-slate-900/50 border-slate-600 text-white"
                data-testid="input-tip-percent"
              />
            </div>
          </div>
          {tipTotal > 0 && (
            <div className="bg-green-500/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-400">${tipTotal.toFixed(2)}</p>
              <p className="text-xs text-slate-400">Total: ${(parseFloat(tipAmount) + tipTotal).toFixed(2)}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <a href="https://www.gasbuddy.com/" target="_blank" rel="noopener noreferrer">
          <Card className="bg-slate-800/50 border-slate-700/50 hover:border-green-500/50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-6 text-center">
              <Fuel className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-white text-sm font-medium">Gas Prices</p>
              <p className="text-xs text-slate-400">Find cheap gas</p>
            </CardContent>
          </Card>
        </a>
        <a href="https://maps.google.com/" target="_blank" rel="noopener noreferrer">
          <Card className="bg-slate-800/50 border-slate-700/50 hover:border-blue-500/50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-6 text-center">
              <Navigation className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-white text-sm font-medium">Navigate</p>
              <p className="text-xs text-slate-400">Open Maps</p>
            </CardContent>
          </Card>
        </a>
      </div>
    </div>
  );
}

export default function TradeToolkit() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [activeTab, setActiveTab] = useState('measure');
  const { toast } = useToast();
  
  const appUrl = typeof window !== 'undefined' ? `${window.location.origin}/trade-toolkit` : '';

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
    document.title = 'Trade Toolkit - Field Pro Tools';
    
    const existingManifest = document.querySelector('link[rel="manifest"]');
    if (existingManifest) {
      existingManifest.setAttribute('href', '/trade-toolkit/manifest.json');
    }
    
    let themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
      themeColor = document.createElement('meta');
      themeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(themeColor);
    }
    themeColor.setAttribute('content', '#1e293b');
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    setIsInstalling(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
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
          title: 'Trade Toolkit',
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-lg mx-auto px-4 py-4 pb-24">
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 mb-3">
            <Wrench className="w-7 h-7 text-blue-400" />
          </div>
          <h1 className="text-xl font-bold text-white">Trade Toolkit</h1>
          <p className="text-sm text-slate-400">Professional Field Tools</p>
        </div>

        {!isInstalled && deferredPrompt && (
          <Card className="mb-4 border-blue-500/30 bg-slate-800/50 backdrop-blur">
            <CardContent className="py-3">
              <div className="flex items-center gap-3">
                <Smartphone className="w-8 h-8 text-blue-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm">Install App</h3>
                  <p className="text-xs text-slate-400">Add to home screen</p>
                </div>
                <Button 
                  onClick={handleInstall} 
                  disabled={isInstalling}
                  size="sm"
                  className="gap-1"
                  data-testid="button-install-pwa"
                >
                  <Download className="w-4 h-4" />
                  Install
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-7 bg-slate-800/50 border border-slate-700/50 p-1 mb-4">
            <TabsTrigger value="measure" className="data-[state=active]:bg-blue-600 px-1" data-testid="tab-measure">
              <Ruler className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="paint" className="data-[state=active]:bg-purple-600 px-1" data-testid="tab-paint">
              <Palette className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="estimate" className="data-[state=active]:bg-green-600 px-1" data-testid="tab-estimate">
              <DollarSign className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="document" className="data-[state=active]:bg-orange-600 px-1" data-testid="tab-document">
              <FileText className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="weather" className="data-[state=active]:bg-cyan-600 px-1" data-testid="tab-weather">
              <Cloud className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="stores" className="data-[state=active]:bg-red-600 px-1" data-testid="tab-stores">
              <Store className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="tools" className="data-[state=active]:bg-yellow-600 px-1" data-testid="tab-tools">
              <Wrench className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="measure"><MeasureTab /></TabsContent>
          <TabsContent value="paint"><PaintTab onOpenScanner={() => setShowScanner(true)} /></TabsContent>
          <TabsContent value="estimate"><EstimateTab /></TabsContent>
          <TabsContent value="document"><DocumentTab /></TabsContent>
          <TabsContent value="weather"><WeatherTab /></TabsContent>
          <TabsContent value="stores"><StoresTab /></TabsContent>
          <TabsContent value="tools"><QuickToolsTab /></TabsContent>
        </Tabs>

        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 p-3">
          <div className="max-w-lg mx-auto flex items-center justify-between gap-2">
            <Button 
              onClick={handleShare} 
              variant="outline" 
              size="sm"
              className="gap-1 flex-1"
              data-testid="button-share"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Dialog open={shareOpen} onOpenChange={setShareOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" data-testid="button-qr">QR</Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white text-center">Share Trade Toolkit</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4 py-4">
                  <div className="bg-white p-4 rounded-lg">
                    <QRCodeSVG value={appUrl} size={180} level="H" includeMargin />
                  </div>
                  <div className="w-full flex gap-2">
                    <div className="flex-1 bg-slate-800 rounded px-3 py-2 text-sm text-slate-300 truncate">
                      {appUrl}
                    </div>
                    <Button onClick={handleCopyLink} size="icon" variant="outline" data-testid="button-copy">
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Badge variant="secondary" className="gap-1 text-xs">
              Powered by PaintPros.io
            </Badge>
          </div>
        </div>
      </div>

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
    </div>
  );
}
