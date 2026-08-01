import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sun, 
  Cloud, 
  CloudRain, 
  Wind, 
  Droplets, 
  Sparkles, 
  Thermometer,
  AlertCircle
} from 'lucide-react';

interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  forecast: Array<{ day: string; temp: number; condition: string }>;
  aiInsight: string;
}

export default function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError('');
    try {
      // 1. Geocoding API lookup
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error(`City "${cityName}" not found.`);
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // 2. Weather Forecast API lookup
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max&timezone=auto`
      );
      const weatherData = await weatherRes.json();

      const current = weatherData.current;
      const daily = weatherData.daily;

      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const forecastList = daily.time.slice(1, 6).map((timeStr: string, index: number) => {
        const date = new Date(timeStr);
        return {
          day: days[date.getDay()],
          temp: Math.round(daily.temperature_2m_max[index + 1]),
          condition: getWeatherCondition(daily.weather_code[index + 1]),
        };
      });

      const currentCondition = getWeatherCondition(current.weather_code);

      setWeather({
        city: `${name}, ${country}`,
        temp: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        condition: currentCondition,
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        forecast: forecastList,
        aiInsight: generateAIInsight(name, Math.round(current.temperature_2m), currentCondition, current.relative_humidity_2m),
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather('Chennai');
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      fetchWeather(query.trim());
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-4 md:p-8 font-sans">
      {/* App Header */}
      <header className="w-full max-w-4xl text-center my-6">
        <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-teal-400" />
          Weather Intelligence
        </h1>
        <p className="text-slate-400 mt-2 text-sm md:text-base">
          Real-time atmospheric monitoring & AI-driven environmental analytics
        </p>
      </header>

      {/* City Search Form */}
      <form onSubmit={handleSearchSubmit} className="w-full max-w-xl mb-8">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search city (e.g. Chennai, London, Tokyo)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-3.5 pl-12 pr-28 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-lg"
          />
          <Search className="absolute left-4 w-5 h-5 text-slate-400" />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Error Banner */}
      {error && (
        <div className="w-full max-w-xl p-4 mb-6 bg-red-950/50 border border-red-800/80 rounded-2xl flex items-center gap-3 text-red-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Weather Dashboard UI */}
      {weather && !loading && (
        <div className="w-full max-w-4xl space-y-6">
          {/* Main Weather Card */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h2 className="text-2xl md:text-4xl font-bold text-white">{weather.city}</h2>
                <p className="text-slate-400 text-lg mt-1">{weather.condition}</p>
                <div className="text-5xl md:text-7xl font-black mt-4 text-white tracking-tight">
                  {weather.temp}°C
                </div>
                <p className="text-slate-400 text-sm mt-1">Feels like {weather.feelsLike}°C</p>
              </div>

              <div className="flex items-center justify-center p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                {getWeatherIcon(weather.condition)}
              </div>
            </div>

            {/* Environmental Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
                <Droplets className="w-6 h-6 text-blue-400" />
                <div>
                  <p className="text-xs text-slate-400">Humidity</p>
                  <p className="text-lg font-semibold text-white">{weather.humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
                <Wind className="w-6 h-6 text-teal-400" />
                <div>
                  <p className="text-xs text-slate-400">Wind Speed</p>
                  <p className="text-lg font-semibold text-white">{weather.windSpeed} km/h</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60 col-span-2 md:col-span-1">
                <Thermometer className="w-6 h-6 text-amber-400" />
                <div>
                  <p className="text-xs text-slate-400">Thermal Comfort</p>
                  <p className="text-lg font-semibold text-white">
                    {weather.temp > 32 ? 'High Heat' : weather.temp < 15 ? 'Cool' : 'Moderate'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Intelligence Summary Card */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-800/40 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-indigo-200">AI Weather Intelligence Analysis</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{weather.aiInsight}</p>
          </div>

          {/* 5-Day Outlook */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">5-Day Outlook</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {weather.forecast.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center p-4 bg-slate-950/50 rounded-2xl border border-slate-800/60 hover:border-slate-700 transition-all"
                >
                  <p className="text-slate-400 text-sm font-medium">{item.day}</p>
                  <div className="my-2">{getSmallWeatherIcon(item.condition)}</div>
                  <p className="text-lg font-bold text-white">{item.temp}°C</p>
                  <p className="text-xs text-slate-500 mt-1 text-center">{item.condition}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Utility Helper Functions
function getWeatherCondition(code: number): string {
  if (code === 0) return 'Clear Sky';
  if (code >= 1 && code <= 3) return 'Partly Cloudy';
  if (code >= 45 && code <= 48) return 'Foggy';
  if (code >= 51 && code <= 67) return 'Rainy';
  if (code >= 71 && code <= 77) return 'Snowy';
  if (code >= 80 && code <= 82) return 'Showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Overcast';
}

function getWeatherIcon(condition: string) {
  switch (condition) {
    case 'Clear Sky':
      return <Sun className="w-16 h-16 text-amber-400" />;
    case 'Partly Cloudy':
    case 'Overcast':
    case 'Foggy':
      return <Cloud className="w-16 h-16 text-slate-300" />;
    case 'Rainy':
    case 'Showers':
    case 'Thunderstorm':
      return <CloudRain className="w-16 h-16 text-blue-400" />;
    default:
      return <Sun className="w-16 h-16 text-amber-400" />;
  }
}

function getSmallWeatherIcon(condition: string) {
  switch (condition) {
    case 'Clear Sky':
      return <Sun className="w-6 h-6 text-amber-400" />;
    case 'Partly Cloudy':
    case 'Overcast':
    case 'Foggy':
      return <Cloud className="w-6 h-6 text-slate-400" />;
    case 'Rainy':
    case 'Showers':
    case 'Thunderstorm':
      return <CloudRain className="w-6 h-6 text-blue-400" />;
    default:
      return <Sun className="w-6 h-6 text-amber-400" />;
  }
}

function generateAIInsight(city: string, temp: number, condition: string, humidity: number): string {
  let message = `Atmospheric analysis for ${city}: Current conditions report ${condition.toLowerCase()} with an ambient temperature of ${temp}°C and relative humidity at ${humidity}%. `;
  if (temp > 30) {
    message += `Elevated thermal indices observed. It is advised to stay hydrated and avoid extended heat exposure during afternoon hours.`;
  } else if (temp < 15) {
    message += `Cool temperature profile detected. Light layered clothing is recommended.`;
  } else {
    message += `Optimal weather envelope. Excellent parameters for outdoor activities and travel.`;
  }
  return message;
}
