import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  X, MapPin, Droplets, Wind, Gauge, 
  Play, Pause, ZoomIn, ZoomOut, RotateCcw, Search,
  Sun, Moon, Cloud, CloudSun, CloudMoon, CloudRain, CloudSnow, 
  CloudLightning, CloudDrizzle, CloudFog, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface WeatherData {
  temp: number;
  feelsLike: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  precipitation: number;
  pressure: number;
  isDay: boolean;
  icon: string;
  alerts: string[];
}

interface GeoLocation {
  lat: number;
  lon: number;
  name: string;
  state: string;
}

interface RadarFrame {
  time: number;
  path: string;
}

interface RadarData {
  generated: number;
  host: string;
  radar: {
    past: RadarFrame[];
    nowcast: RadarFrame[];
  };
}

interface WeatherRadarModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weather: WeatherData | null;
  location: GeoLocation;
  onLocationChange: (location: GeoLocation) => void;
}

const WEATHER_ICONS: Record<string, typeof Sun> = {
  "sun": Sun,
  "moon": Moon,
  "cloud": Cloud,
  "cloud-sun": CloudSun,
  "cloud-moon": CloudMoon,
  "cloud-rain": CloudRain,
  "cloud-snow": CloudSnow,
  "cloud-lightning": CloudLightning,
  "cloud-drizzle": CloudDrizzle,
  "cloud-fog": CloudFog,
};

function latLonToTile(lat: number, lon: number, zoom: number) {
  const x = Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
  const y = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
  return { x, y };
}

export function WeatherRadarModal({ open, onOpenChange, weather, location, onLocationChange }: WeatherRadarModalProps) {
  const [zipInput, setZipInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [zoom, setZoom] = useState(6);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isLandscape, setIsLandscape] = useState(false);
  const animationRef = useRef<number | null>(null);
  const lastFrameTime = useRef<number>(0);

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  const { data: radarData, isLoading: radarLoading } = useQuery<RadarData>({
    queryKey: ["/api/weather/radar"],
    enabled: open,
    staleTime: 300000,
    refetchInterval: 300000,
  });

  const allFrames = radarData ? [...radarData.radar.past, ...radarData.radar.nowcast] : [];

  const animate = useCallback((timestamp: number) => {
    if (!isPlaying || allFrames.length === 0) return;
    
    if (timestamp - lastFrameTime.current >= 600) {
      setCurrentFrame(prev => (prev + 1) % allFrames.length);
      lastFrameTime.current = timestamp;
    }
    
    animationRef.current = requestAnimationFrame(animate);
  }, [isPlaying, allFrames.length]);

  useEffect(() => {
    if (open && isPlaying && allFrames.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [open, isPlaying, animate, allFrames.length]);

  useEffect(() => {
    if (!open) {
      setCurrentFrame(0);
      setIsPlaying(true);
    }
  }, [open]);

  const handleZipSearch = async () => {
    if (!zipInput.trim() || zipInput.length < 5) {
      setSearchError("Enter a valid ZIP code");
      return;
    }
    
    setIsSearching(true);
    setSearchError("");
    
    try {
      const res = await fetch(`/api/weather/geocode/${zipInput.trim()}`);
      if (!res.ok) {
        throw new Error("Location not found");
      }
      const data = await res.json();
      onLocationChange({
        lat: data.lat,
        lon: data.lon,
        name: data.name,
        state: data.state
      });
      localStorage.setItem("orbit-weather-zip", zipInput.trim());
      setZipInput("");
    } catch {
      setSearchError("Location not found");
    } finally {
      setIsSearching(false);
    }
  };

  if (!open) return null;

  const IconComponent = weather?.icon ? WEATHER_ICONS[weather.icon] || Cloud : Cloud;
  const { x: mapTileX, y: mapTileY } = latLonToTile(location.lat, location.lon, zoom);
  const tileRange = [-1, 0, 1];

  const MapSection = () => (
    <div className="relative w-full h-full overflow-hidden bg-black/20">
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
        {tileRange.map(dy => 
          tileRange.map(dx => (
            <img
              key={`map-${dx}-${dy}`}
              src={`https://tile.openstreetmap.org/${zoom}/${mapTileX + dx}/${mapTileY + dy}.png`}
              alt=""
              className="w-full h-full object-cover"
              style={{ filter: "grayscale(100%) brightness(0.3) contrast(1.2)" }}
              crossOrigin="anonymous"
            />
          ))
        )}
      </div>

      {radarData && allFrames.length > 0 && allFrames[currentFrame] && (
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
          {tileRange.map(dy => 
            tileRange.map(dx => (
              <img
                key={`radar-${dx}-${dy}-${currentFrame}`}
                src={`${radarData.host}${allFrames[currentFrame].path}/256/${zoom}/${mapTileX + dx}/${mapTileY + dy}/2/1_1.png`}
                alt=""
                className="w-full h-full object-cover"
                style={{ opacity: 0.7 }}
                onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
                crossOrigin="anonymous"
              />
            ))
          )}
        </div>
      )}

      {radarLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader2 className="w-5 h-5 text-white animate-spin" />
        </div>
      )}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white shadow-lg" />
      </div>

      <div className="absolute bottom-1.5 left-1.5 bg-black/70 backdrop-blur-sm rounded px-1.5 py-0.5 flex items-center gap-1">
        <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
        <p className="text-[10px] font-mono text-white">
          {allFrames[currentFrame] 
            ? new Date(allFrames[currentFrame].time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : "--:--"
          }
        </p>
      </div>

      <div className="absolute bottom-1.5 right-1.5 bg-black/70 backdrop-blur-sm rounded px-1 py-0.5">
        <p className="text-[8px] text-white/50">RainViewer</p>
      </div>
    </div>
  );

  const ControlsSection = () => (
    <div className="px-2 py-1.5 bg-black/40 border-t border-white/10 flex items-center justify-between gap-2">
      <div className="flex items-center gap-0.5">
        <Button size="icon" variant="ghost" onClick={() => setIsPlaying(!isPlaying)} className="h-6 w-6 text-white hover:bg-white/10" data-testid="button-radar-play-pause">
          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </Button>
        <Button size="icon" variant="ghost" onClick={() => setCurrentFrame(0)} className="h-6 w-6 text-white hover:bg-white/10" data-testid="button-radar-reset">
          <RotateCcw className="w-3 h-3" />
        </Button>
      </div>
      <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden mx-2">
        <div className="h-full bg-emerald-400 transition-all duration-200" style={{ width: `${allFrames.length > 0 ? ((currentFrame + 1) / allFrames.length) * 100 : 0}%` }} />
      </div>
      <div className="flex items-center gap-0.5">
        <Button size="icon" variant="ghost" onClick={() => setZoom(Math.max(4, zoom - 1))} disabled={zoom <= 4} className="h-6 w-6 text-white hover:bg-white/10 disabled:opacity-30" data-testid="button-radar-zoom-out">
          <ZoomOut className="w-3 h-3" />
        </Button>
        <span className="text-[9px] text-white/70 w-4 text-center">{zoom}</span>
        <Button size="icon" variant="ghost" onClick={() => setZoom(Math.min(10, zoom + 1))} disabled={zoom >= 10} className="h-6 w-6 text-white hover:bg-white/10 disabled:opacity-30" data-testid="button-radar-zoom-in">
          <ZoomIn className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );

  const WeatherInfo = ({ compact = false }: { compact?: boolean }) => (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <div className="flex items-center gap-2">
        <div className={`${compact ? 'p-1' : 'p-1.5'} bg-white/10 rounded-md`}>
          <IconComponent className={`${compact ? 'w-5 h-5' : 'w-6 h-6'} ${
            weather?.icon === "sun" ? "text-yellow-400" :
            weather?.icon === "moon" ? "text-blue-300" :
            weather?.icon?.includes("rain") ? "text-sky-400" :
            "text-gray-300"
          }`} />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className={`${compact ? 'text-xl' : 'text-2xl'} font-light text-white`}>{weather?.temp || "--"}°F</span>
            <span className={`${compact ? 'text-xs' : 'text-sm'} text-white/70`}>{weather?.condition || "..."}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-white/50">
            <MapPin className="w-2.5 h-2.5" />
            <span className="truncate">{location.name}, {location.state}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Input
          type="text"
          placeholder="ZIP code"
          value={zipInput}
          onChange={(e) => setZipInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleZipSearch()}
          className={`flex-1 ${compact ? 'h-7 text-xs' : 'h-8 text-sm'} bg-black/30 border-white/20 text-white placeholder:text-gray-500`}
          data-testid="input-weather-zip"
        />
        <Button size="icon" variant="ghost" onClick={handleZipSearch} disabled={isSearching} className={`${compact ? 'h-7 w-7' : 'h-8 w-8'} text-white/70 hover:text-white hover:bg-white/10`} data-testid="button-search-zip">
          {isSearching ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
        </Button>
      </div>
      {searchError && <p className="text-red-400 text-[10px]">{searchError}</p>}

      {weather ? (
        <div className={`grid ${compact ? 'grid-cols-2 gap-1' : 'grid-cols-2 gap-1.5'}`}>
          <div className="bg-black/30 rounded p-1.5 flex items-center gap-1.5">
            <Droplets className="w-3 h-3 text-sky-400" />
            <div>
              <p className="text-[8px] text-gray-400">Humidity</p>
              <p className="text-[11px] font-medium text-white">{weather.humidity}%</p>
            </div>
          </div>
          <div className="bg-black/30 rounded p-1.5 flex items-center gap-1.5">
            <Wind className="w-3 h-3 text-teal-400" />
            <div>
              <p className="text-[8px] text-gray-400">Wind</p>
              <p className="text-[11px] font-medium text-white">{weather.windSpeed}mph</p>
            </div>
          </div>
          <div className="bg-black/30 rounded p-1.5 flex items-center gap-1.5">
            <CloudRain className="w-3 h-3 text-blue-400" />
            <div>
              <p className="text-[8px] text-gray-400">Precip</p>
              <p className="text-[11px] font-medium text-white">{weather.precipitation}"</p>
            </div>
          </div>
          <div className="bg-black/30 rounded p-1.5 flex items-center gap-1.5">
            <Gauge className="w-3 h-3 text-purple-400" />
            <div>
              <p className="text-[8px] text-gray-400">Pressure</p>
              <p className="text-[11px] font-medium text-white">{weather.pressure}</p>
            </div>
          </div>
          <div className="col-span-2 bg-black/30 rounded p-1.5 flex items-center justify-center gap-2">
            <Sun className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] text-gray-400">Feels like</span>
            <span className="text-sm font-medium text-white">{weather.feelsLike}°F</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-16">
          <Loader2 className="w-4 h-4 text-white/50 animate-spin" />
        </div>
      )}
    </div>
  );

  // LANDSCAPE LAYOUT - Side by side
  if (isLandscape) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2"
        onClick={() => onOpenChange(false)}
      >
        <div 
          className="bg-gradient-to-br from-[#1a2e1a] to-[#0d1a0d] border border-white/20 rounded-lg overflow-hidden shadow-2xl flex w-full h-full max-w-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left 1/3 - Weather Info */}
          <div className="w-1/3 p-2 border-r border-white/10 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] text-white/40">Weather</span>
              <button onClick={() => onOpenChange(false)} className="text-gray-400 hover:text-white" data-testid="button-close-weather-modal">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <WeatherInfo compact />
            </div>
          </div>

          {/* Right 2/3 - Map */}
          <div className="w-2/3 flex flex-col">
            <div className="flex-1">
              <MapSection />
            </div>
            <ControlsSection />
          </div>
        </div>
      </div>
    );
  }

  // PORTRAIT LAYOUT - Stacked vertically, full screen
  return (
    <div 
      className="fixed inset-0 z-50 bg-gradient-to-br from-[#1a2e1a] to-[#0d1a0d] flex flex-col"
      onClick={() => onOpenChange(false)}
    >
      <div className="flex flex-col h-full" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2 flex-1">
            <div className="p-1 bg-white/10 rounded-md">
              <IconComponent className={`w-5 h-5 ${
                weather?.icon === "sun" ? "text-yellow-400" :
                weather?.icon === "moon" ? "text-blue-300" :
                weather?.icon?.includes("rain") ? "text-sky-400" :
                "text-gray-300"
              }`} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-light text-white">{weather?.temp || "--"}°F</span>
                <span className="text-xs text-white/70">{weather?.condition || "..."}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-white/50">
                <MapPin className="w-2.5 h-2.5" />
                <span>{location.name}, {location.state}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Input
              type="text"
              placeholder="ZIP"
              value={zipInput}
              onChange={(e) => setZipInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleZipSearch()}
              className="w-16 h-7 bg-black/30 border-white/20 text-white text-[10px] placeholder:text-gray-500 px-2"
              data-testid="input-weather-zip-portrait"
            />
            <Button size="icon" variant="ghost" onClick={handleZipSearch} disabled={isSearching} className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10">
              {isSearching ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
            </Button>
            <button onClick={() => onOpenChange(false)} className="text-gray-400 hover:text-white p-0.5" data-testid="button-close-weather-modal">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        {searchError && <p className="text-red-400 text-[10px] px-3 py-1 bg-red-500/10">{searchError}</p>}

        {/* Map - Takes up most of the space */}
        <div className="flex-1 min-h-0">
          <MapSection />
        </div>

        {/* Controls */}
        <ControlsSection />

        {/* Weather Details - Bottom */}
        <div className="p-2 border-t border-white/10 flex-shrink-0">
          {weather ? (
            <div className="grid grid-cols-5 gap-1">
              <div className="bg-black/30 rounded p-1 text-center">
                <Droplets className="w-3 h-3 text-sky-400 mx-auto" />
                <p className="text-[8px] text-gray-400">Humidity</p>
                <p className="text-[10px] font-medium text-white">{weather.humidity}%</p>
              </div>
              <div className="bg-black/30 rounded p-1 text-center">
                <Wind className="w-3 h-3 text-teal-400 mx-auto" />
                <p className="text-[8px] text-gray-400">Wind</p>
                <p className="text-[10px] font-medium text-white">{weather.windSpeed}mph</p>
              </div>
              <div className="bg-black/30 rounded p-1 text-center">
                <CloudRain className="w-3 h-3 text-blue-400 mx-auto" />
                <p className="text-[8px] text-gray-400">Precip</p>
                <p className="text-[10px] font-medium text-white">{weather.precipitation}"</p>
              </div>
              <div className="bg-black/30 rounded p-1 text-center">
                <Gauge className="w-3 h-3 text-purple-400 mx-auto" />
                <p className="text-[8px] text-gray-400">Pressure</p>
                <p className="text-[10px] font-medium text-white">{weather.pressure}</p>
              </div>
              <div className="bg-black/30 rounded p-1 text-center">
                <Sun className="w-3 h-3 text-amber-400 mx-auto" />
                <p className="text-[8px] text-gray-400">Feels</p>
                <p className="text-[10px] font-medium text-white">{weather.feelsLike}°</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-10">
              <Loader2 className="w-4 h-4 text-white/50 animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
