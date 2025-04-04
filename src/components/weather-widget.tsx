
import { useState, useEffect } from "react";
import { Sun, Cloud, CloudRain, CloudSnow, CloudFog, Wind } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WeatherWidgetProps {
  date?: Date;
  location?: string;
}

// Mock weather data function (in a real app, this would be an API call)
const getWeatherData = (date?: Date, location?: string) => {
  // For demo purposes, generate random weather data
  const weatherTypes = ["sunny", "cloudy", "rainy", "snowy", "foggy", "windy"];
  const randomType = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
  const temperature = Math.floor(Math.random() * 30) + 10; // 10-40 degrees
  
  return {
    type: randomType,
    temperature,
    location: location || "Youth Center",
    date: date || new Date(),
  };
};

export function WeatherWidget({ date, location }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timeout = setTimeout(() => {
      const data = getWeatherData(date, location);
      setWeather(data);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [date, location]);

  const getWeatherIcon = (type: string) => {
    switch (type) {
      case "sunny":
        return <Sun className="h-8 w-8 text-amber-500" />;
      case "cloudy":
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case "rainy":
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      case "snowy":
        return <CloudSnow className="h-8 w-8 text-slate-300" />;
      case "foggy":
        return <CloudFog className="h-8 w-8 text-gray-400" />;
      case "windy":
        return <Wind className="h-8 w-8 text-teal-500" />;
      default:
        return <Sun className="h-8 w-8 text-amber-500" />;
    }
  };

  if (loading) {
    return (
      <Card className="dark:bg-gold-900/50 dark:border-gold-700 backdrop-blur-sm shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-center h-24 animate-pulse">
            <div className="text-muted-foreground">Loading weather data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark:bg-gold-900/50 dark:border-gold-700 backdrop-blur-sm shadow-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gold-100/20 dark:to-gold-900/20 pointer-events-none" />
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium dark:text-gold-100">Weather</h3>
            <p className="text-sm text-gold-600 dark:text-gold-300">{weather.location}</p>
          </div>
          <div className="flex items-center space-x-2">
            {getWeatherIcon(weather.type)}
            <span className="text-2xl font-semibold">{weather.temperature}°C</span>
          </div>
        </div>
        <div className="mt-4 text-sm text-gold-600 dark:text-gold-300">
          <p className="capitalize">Condition: {weather.type}</p>
        </div>
      </CardContent>
    </Card>
  );
}
