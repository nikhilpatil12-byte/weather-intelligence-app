import { GeocodingResult, WeatherData, DailyForecastDay } from '../types/weather';
import { getWeatherCodeInfo } from '../utils/weatherCodes';

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast';

export async function searchCities(query: string): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const url = `${GEOCODING_API_URL}?name=${encodeURIComponent(trimmed)}&count=6&language=en&format=json`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to query city database: ${response.statusText}`);
  }

  const data = await response.json();
  if (!data.results || !Array.isArray(data.results)) {
    return [];
  }

  return data.results.map((item: any) => ({
    id: item.id,
    name: item.name,
    latitude: item.latitude,
    longitude: item.longitude,
    country: item.country || item.country_code || '',
    admin1: item.admin1 || '',
    country_code: item.country_code || '',
  }));
}

export async function fetchWeatherData(
  lat: number,
  lon: number,
  cityName: string,
  countryName: string = ''
): Promise<WeatherData> {
  const url = `${FORECAST_API_URL}?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=auto`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather service unavailable (${response.status})`);
  }

  const data = await response.json();
  if (!data.current_weather || !data.daily) {
    throw new Error('Received incomplete forecast data from Open-Meteo');
  }

  const cw = data.current_weather;
  const cwInfo = getWeatherCodeInfo(cw.weathercode);

  const dailyTimes: string[] = data.daily.time || [];
  const dailyCodes: number[] = data.daily.weathercode || [];
  const maxTemps: number[] = data.daily.temperature_2m_max || [];
  const minTemps: number[] = data.daily.temperature_2m_min || [];
  const precipSums: number[] = data.daily.precipitation_sum || [];
  const maxWinds: number[] = data.daily.windspeed_10m_max || [];

  const daily: DailyForecastDay[] = dailyTimes.map((dateStr, index) => {
    const code = dailyCodes[index] ?? 0;
    const codeInfo = getWeatherCodeInfo(code);

    // Parse weekday name cleanly
    let dayName = '';
    try {
      const dateObj = new Date(`${dateStr}T00:00:00`);
      if (index === 0) {
        dayName = 'Today';
      } else if (index === 1) {
        dayName = 'Tomorrow';
      } else {
        dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      }
    } catch {
      dayName = `Day ${index + 1}`;
    }

    return {
      date: dateStr,
      dayName,
      weatherCode: code,
      maxTemp: maxTemps[index] ?? 0,
      minTemp: minTemps[index] ?? 0,
      precipitationSum: precipSums[index] ?? 0,
      maxWindSpeed: maxWinds[index] ?? 0,
      conditionText: codeInfo.label,
      iconName: codeInfo.iconName,
    };
  });

  return {
    city: cityName,
    country: countryName,
    latitude: lat,
    longitude: lon,
    currentTemp: cw.temperature ?? 0,
    currentWindSpeed: cw.windspeed ?? 0,
    currentWeatherCode: cw.weathercode ?? 0,
    currentConditionText: cwInfo.label,
    currentIconName: cwInfo.iconName,
    daily,
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

export async function fetchWeatherByCityName(cityName: string): Promise<WeatherData> {
  const cleanName = cityName.trim();
  if (!cleanName) {
    throw new Error('Please enter a city name to search.');
  }

  const cities = await searchCities(cleanName);
  if (cities.length === 0) {
    throw new Error(`City not found: "${cleanName}". Please check the spelling or try another city.`);
  }

  const firstMatch = cities[0];
  return fetchWeatherData(
    firstMatch.latitude,
    firstMatch.longitude,
    firstMatch.name,
    firstMatch.country || ''
  );
}

export async function fetchWeatherByGeolocation(): Promise<WeatherData> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;

          // Attempt reverse geocoding via Open-Meteo or fall back to coordinates label
          let cityName = 'Current Location';
          let countryName = '';

          try {
            const revUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${lat.toFixed(2)},${lon.toFixed(2)}&count=1&language=en&format=json`;
            const revRes = await fetch(revUrl);
            if (revRes.ok) {
              const revData = await revRes.json();
              if (revData.results && revData.results.length > 0) {
                cityName = revData.results[0].name;
                countryName = revData.results[0].country || '';
              }
            }
          } catch {
            // Ignore reverse geocode failure and use default 'Current Location'
          }

          const weather = await fetchWeatherData(lat, lon, cityName, countryName);
          resolve(weather);
        } catch (err: any) {
          reject(err);
        }
      },
      (geoErr) => {
        reject(new Error(`Location access denied or unavailable (${geoErr.message}).`));
      },
      { timeout: 8000 }
    );
  });
}
