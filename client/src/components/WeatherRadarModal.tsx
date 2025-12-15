import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  X, MapPin, Thermometer, Droplets, Wind, Gauge, 
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

interface RadarData {
  generated: number;
  host: string;
  radar: {
    past: Array<{ time: number; path: string }>;
    nowcast: Array<{ time: number; path: string }>;
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

export function WeatherRadarModal({ open, onOpenChange, weather, location, onLocationChange }: WeatherRadarModalProps) {
  const [zipInput, setZipInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [zoom, setZoom] = useState(6);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);
  const animationRef = useRef<number | null>(null);
  const lastFrameTime = useRef<number>(0);

  const { data: radarData } = useQuery<RadarData>({
    queryKey: ["/api/weather/radar"],
    enabled: open,
    staleTime: 300000,
    refetchInterval: 300000,
  });

  const allFrames = radarData ? [...radarData.radar.past, ...radarData.radar.nowcast] : [];

  const animate = useCallback((timestamp: number) => {
    if (!isPlaying || allFrames.length === 0) return;
    
    if (timestamp - lastFrameTime.current >= 500) {
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
    } catch (err) {
      setSearchError("Location not found");
    } finally {
      setIsSearching(false);
    }
  };

  if (!open) return null;

  const IconComponent = weather?.icon ? WEATHER_ICONS[weather.icon] || Cloud : Cloud;
  const currentTile = allFrames[currentFrame];
  const tileUrl = currentTile && radarData 
    ? `${radarData.host}${currentTile.path}/256/${zoom}/${Math.floor((location.lon + 180) / 360 * Math.pow(2, zoom))}/${Math.floor((1 - Math.log(Math.tan(location.lat * Math.PI / 180) + 1 / Math.cos(location.lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))}/1/1_1.png`
    : null;

  const mapTileX = Math.floor((location.lon + 180) / 360 * Math.pow(2, zoom));
  const mapTileY = Math.floor((1 - Math.log(Math.tan(location.lat * Math.PI / 180) + 1 / Math.cos(location.lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={() => onOpenChange(false)}
    >
      <div 
        className="bg-gradient-to-br from-[#1a2e1a] to-[#0d1a0d] border border-emerald-500/30 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <IconComponent className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">ORBIT Weather</h2>
              <div className="flex items-center gap-1 text-sm text-emerald-300/80">
                <MapPin className="w-3 h-3" />
                <span>{location.name}, {location.state}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-white transition-colors p-1"
            data-testid="button-close-weather-modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-[calc(90vh-80px)] max-h-[600px]">
          <div className="w-full md:w-1/3 p-4 border-b md:border-b-0 md:border-r border-white/10 overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
              <Input
                type="text"
                placeholder="Enter ZIP code"
                value={zipInput}
                onChange={(e) => setZipInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleZipSearch()}
                className="flex-1 bg-black/30 border-white/20 text-white placeholder:text-gray-500"
                data-testid="input-weather-zip"
              />
              <Button 
                size="icon" 
                variant="outline"
                onClick={handleZipSearch}
                disabled={isSearching}
                className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                data-testid="button-search-zip"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
            </div>
            {searchError && (
              <p className="text-red-400 text-xs mb-3">{searchError}</p>
            )}

            {weather ? (
              <div className="space-y-4">
                <div className="text-center py-4 bg-black/20 rounded-xl">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <IconComponent className={`w-12 h-12 ${
                      weather.icon === "sun" ? "text-yellow-400" :
                      weather.icon === "moon" ? "text-blue-300" :
                      weather.icon?.includes("rain") ? "text-sky-400" :
                      weather.icon?.includes("snow") ? "text-white" :
                      weather.icon?.includes("lightning") ? "text-yellow-300" :
                      "text-gray-300"
                    }`} />
                    <span className="text-5xl font-light text-white">{weather.temp}°</span>
                  </div>
                  <p className="text-lg text-emerald-300">{weather.condition}</p>
                  <p className="text-sm text-gray-400">{weather.description}</p>
                  <p className="text-sm text-gray-500 mt-1">Feels like {weather.feelsLike}°</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/20 rounded-lg p-3 flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-sky-400" />
                    <div>
                      <p className="text-xs text-gray-400">Humidity</p>
                      <p className="text-sm font-medium text-white">{weather.humidity}%</p>
                    </div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3 flex items-center gap-2">
                    <Wind className="w-5 h-5 text-teal-400" />
                    <div>
                      <p className="text-xs text-gray-400">Wind</p>
                      <p className="text-sm font-medium text-white">{weather.windSpeed} mph {weather.windDirection}</p>
                    </div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3 flex items-center gap-2">
                    <CloudRain className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-xs text-gray-400">Precip</p>
                      <p className="text-sm font-medium text-white">{weather.precipitation}"</p>
                    </div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3 flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-xs text-gray-400">Pressure</p>
                      <p className="text-sm font-medium text-white">{weather.pressure} mb</p>
                    </div>
                  </div>
                </div>

                {weather.alerts.length > 0 && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                    <p className="text-red-400 font-medium text-sm">Weather Alerts</p>
                    {weather.alerts.map((alert, i) => (
                      <p key={i} className="text-red-300 text-xs mt-1">{alert}</p>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col bg-black/30">
            <div className="relative flex-1 overflow-hidden">
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                {[-1, 0, 1].map(dy => 
                  [-1, 0, 1].map(dx => (
                    <img
                      key={`map-${dx}-${dy}`}
                      src={`https://tile.openstreetmap.org/${zoom}/${mapTileX + dx}/${mapTileY + dy}.png`}
                      alt=""
                      className="w-full h-full object-cover opacity-60"
                      style={{ filter: "grayscale(100%) brightness(0.4)" }}
                    />
                  ))
                )}
              </div>

              {radarData && allFrames.length > 0 && (
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                  {[-1, 0, 1].map(dy => 
                    [-1, 0, 1].map(dx => (
                      <img
                        key={`radar-${dx}-${dy}-${currentFrame}`}
                        src={`${radarData.host}${allFrames[currentFrame].path}/256/${zoom}/${mapTileX + dx}/${mapTileY + dy}/1/1_1.png`}
                        alt=""
                        className="w-full h-full object-cover mix-blend-screen"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ))
                  )}
                </div>
              )}

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-4 h-4 rounded-full bg-emerald-500/50 border-2 border-emerald-400 animate-pulse" />
              </div>

              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5">
                <p className="text-xs text-gray-300">
                  {allFrames[currentFrame] 
                    ? new Date(allFrames[currentFrame].time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : "--:--"
                  }
                </p>
              </div>
            </div>

            <div className="p-3 bg-black/40 border-t border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-white hover:bg-white/10"
                  data-testid="button-radar-play-pause"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setCurrentFrame(0)}
                  className="text-white hover:bg-white/10"
                  data-testid="button-radar-reset"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 transition-all duration-300"
                  style={{ width: `${allFrames.length > 0 ? ((currentFrame + 1) / allFrames.length) * 100 : 0}%` }}
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setZoom(Math.max(4, zoom - 1))}
                  disabled={zoom <= 4}
                  className="text-white hover:bg-white/10 disabled:opacity-50"
                  data-testid="button-radar-zoom-out"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-xs text-gray-400 w-8 text-center">{zoom}x</span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setZoom(Math.min(10, zoom + 1))}
                  disabled={zoom >= 10}
                  className="text-white hover:bg-white/10 disabled:opacity-50"
                  data-testid="button-radar-zoom-in"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
