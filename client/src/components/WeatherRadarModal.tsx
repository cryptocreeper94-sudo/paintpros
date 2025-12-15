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
  const animationRef = useRef<number | null>(null);
  const lastFrameTime = useRef<number>(0);

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

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      style={{ paddingTop: 'env(safe-area-inset-top, 8px)', paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}
      onClick={() => onOpenChange(false)}
    >
      <div 
        className="bg-gradient-to-br from-[#1a2e1a] to-[#0d1a0d] border border-white/20 rounded-xl w-[calc(100%-16px)] max-w-5xl overflow-hidden shadow-2xl flex flex-col m-2"
        style={{ 
          maxHeight: 'calc(100vh - env(safe-area-inset-top, 8px) - env(safe-area-inset-bottom, 8px) - 16px)',
          height: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="p-1.5 bg-white/10 rounded-lg flex-shrink-0">
              <IconComponent className={`w-5 h-5 ${
                weather?.icon === "sun" ? "text-yellow-400" :
                weather?.icon === "moon" ? "text-blue-300" :
                weather?.icon?.includes("rain") ? "text-sky-400" :
                "text-gray-300"
              }`} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl font-light text-white">{weather?.temp || "--"}°F</span>
                <span className="text-sm text-white/70">{weather?.condition || "Loading..."}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-white/50">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{location.name}, {location.state}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-1">
              <Input
                type="text"
                placeholder="ZIP"
                value={zipInput}
                onChange={(e) => setZipInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleZipSearch()}
                className="w-20 h-8 bg-black/30 border-white/20 text-white text-xs placeholder:text-gray-500"
                data-testid="input-weather-zip"
              />
              <Button 
                size="icon" 
                variant="ghost"
                onClick={handleZipSearch}
                disabled={isSearching}
                className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                data-testid="button-search-zip"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
            </div>
            <button 
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-white transition-colors p-1"
              data-testid="button-close-weather-modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        {searchError && (
          <p className="text-red-400 text-xs px-3 py-1 bg-red-500/10">{searchError}</p>
        )}

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="flex flex-col landscape:flex-row md:flex-row">
            <div className="flex flex-col bg-black/20 landscape:flex-1 md:flex-1">
              <div className="relative h-48 landscape:h-40 md:h-80 lg:h-96 overflow-hidden">
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
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow-lg" />
                </div>

                <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm rounded-md px-2 py-1 flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                  <p className="text-xs font-mono text-white">
                    {allFrames[currentFrame] 
                      ? new Date(allFrames[currentFrame].time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : "--:--"
                    }
                  </p>
                </div>

                <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm rounded-md px-1.5 py-0.5">
                  <p className="text-[9px] text-white/50">RainViewer</p>
                </div>
              </div>

              <div className="p-2 bg-black/40 border-t border-white/10 flex items-center justify-between gap-2 flex-shrink-0">
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="h-7 w-7 text-white hover:bg-white/10"
                    data-testid="button-radar-play-pause"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setCurrentFrame(0)}
                    className="h-7 w-7 text-white hover:bg-white/10"
                    data-testid="button-radar-reset"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>
                </div>

                <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-400 transition-all duration-200"
                    style={{ width: `${allFrames.length > 0 ? ((currentFrame + 1) / allFrames.length) * 100 : 0}%` }}
                  />
                </div>

                <div className="flex items-center gap-0.5">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setZoom(Math.max(4, zoom - 1))}
                    disabled={zoom <= 4}
                    className="h-7 w-7 text-white hover:bg-white/10 disabled:opacity-30"
                    data-testid="button-radar-zoom-out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </Button>
                  <span className="text-[10px] text-white/70 w-4 text-center">{zoom}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setZoom(Math.min(10, zoom + 1))}
                    disabled={zoom >= 10}
                    className="h-7 w-7 text-white hover:bg-white/10 disabled:opacity-30"
                    data-testid="button-radar-zoom-in"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-3 border-t landscape:border-t-0 landscape:border-l md:border-t-0 md:border-l border-white/10 flex-shrink-0 landscape:w-52 md:w-56">
              <div className="sm:hidden flex items-center gap-2 mb-2">
                <Input
                  type="text"
                  placeholder="Enter ZIP code"
                  value={zipInput}
                  onChange={(e) => setZipInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleZipSearch()}
                  className="flex-1 h-8 bg-black/30 border-white/20 text-white text-sm placeholder:text-gray-500"
                  data-testid="input-weather-zip-mobile"
                />
                <Button 
                  size="icon" 
                  variant="ghost"
                  onClick={handleZipSearch}
                  disabled={isSearching}
                  className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                >
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </Button>
              </div>

              {weather ? (
                <div className="grid grid-cols-2 landscape:grid-cols-2 md:grid-cols-1 gap-1.5">
                  <div className="bg-black/30 rounded-md p-2 flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-sky-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[9px] text-gray-400">Humidity</p>
                      <p className="text-xs font-medium text-white">{weather.humidity}%</p>
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-md p-2 flex items-center gap-2">
                    <Wind className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[9px] text-gray-400">Wind</p>
                      <p className="text-xs font-medium text-white truncate">{weather.windSpeed}mph {weather.windDirection}</p>
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-md p-2 flex items-center gap-2">
                    <CloudRain className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[9px] text-gray-400">Precip</p>
                      <p className="text-xs font-medium text-white">{weather.precipitation}"</p>
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-md p-2 flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[9px] text-gray-400">Pressure</p>
                      <p className="text-xs font-medium text-white">{weather.pressure}mb</p>
                    </div>
                  </div>
                  <div className="col-span-2 landscape:col-span-2 md:col-span-1 bg-black/30 rounded-md p-2 text-center">
                    <p className="text-[9px] text-gray-400">Feels Like</p>
                    <p className="text-base font-medium text-white">{weather.feelsLike}°F</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-20">
                  <Loader2 className="w-5 h-5 text-white/50 animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
