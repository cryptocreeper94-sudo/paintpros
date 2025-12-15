import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Sun, Moon, Cloud, CloudSun, CloudMoon, CloudRain, CloudSnow, 
  CloudLightning, CloudDrizzle, CloudFog, MapPin, Loader2 
} from "lucide-react";
import { WeatherRadarModal } from "./WeatherRadarModal";

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

const DEFAULT_LOCATION = {
  lat: 36.1627,
  lon: -86.7816,
  name: "Nashville",
  state: "TN"
};

export function FooterWeatherWidget() {
  const [showModal, setShowModal] = useState(false);
  const [location, setLocation] = useState<GeoLocation | null>(null);

  useEffect(() => {
    const savedCoords = localStorage.getItem("orbit-weather-coords");
    const savedLocation = localStorage.getItem("orbit-weather-location");
    
    if (savedCoords && savedLocation) {
      try {
        const coords = JSON.parse(savedCoords);
        const [name, state] = savedLocation.split(", ");
        setLocation({ ...coords, name, state });
      } catch {
        setLocation(DEFAULT_LOCATION);
      }
    } else {
      setLocation(DEFAULT_LOCATION);
      localStorage.setItem("orbit-weather-coords", JSON.stringify({ lat: DEFAULT_LOCATION.lat, lon: DEFAULT_LOCATION.lon }));
      localStorage.setItem("orbit-weather-location", `${DEFAULT_LOCATION.name}, ${DEFAULT_LOCATION.state}`);
    }
  }, []);

  const { data: weather, isLoading, error } = useQuery<WeatherData>({
    queryKey: ["/api/weather", location?.lat, location?.lon],
    queryFn: async () => {
      if (!location) return null;
      const res = await fetch(`/api/weather?lat=${location.lat}&lon=${location.lon}`);
      if (!res.ok) throw new Error("Failed to fetch weather");
      return res.json();
    },
    enabled: !!location,
    staleTime: 300000,
    refetchInterval: 600000,
  });

  const handleLocationChange = (newLocation: GeoLocation) => {
    setLocation(newLocation);
    localStorage.setItem("orbit-weather-coords", JSON.stringify({ lat: newLocation.lat, lon: newLocation.lon }));
    localStorage.setItem("orbit-weather-location", `${newLocation.name}, ${newLocation.state}`);
  };

  if (!location) return null;

  const IconComponent = weather?.icon ? WEATHER_ICONS[weather.icon] || Cloud : Cloud;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-1.5 transition-all hover:scale-105 group"
        data-testid="button-weather-widget"
        title={weather ? `${weather.condition} - ${weather.description}` : "Loading weather..."}
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-sky-400 animate-spin" />
        ) : error ? (
          <Cloud className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
        ) : (
          <>
            <IconComponent 
              className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-colors ${
                weather?.icon === "sun" ? "text-yellow-400 group-hover:text-yellow-300" :
                weather?.icon === "moon" ? "text-blue-300 group-hover:text-blue-200" :
                weather?.icon?.includes("rain") || weather?.icon?.includes("drizzle") ? "text-sky-400 group-hover:text-sky-300" :
                weather?.icon?.includes("snow") ? "text-white group-hover:text-blue-100" :
                weather?.icon?.includes("lightning") ? "text-yellow-300 group-hover:text-yellow-200" :
                "text-gray-300 group-hover:text-gray-200"
              }`}
            />
            <span className="text-[9px] md:text-[10px] font-medium text-white/80 group-hover:text-white tabular-nums">
              {weather?.temp}°
            </span>
          </>
        )}
      </button>

      <WeatherRadarModal
        open={showModal}
        onOpenChange={setShowModal}
        weather={weather || null}
        location={location}
        onLocationChange={handleLocationChange}
      />
    </>
  );
}
