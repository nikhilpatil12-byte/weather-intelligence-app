export interface GeocodingResult {
  id?: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string; // State or province
  country_code?: string;
}

export interface DailyForecastDay {
  date: string;         // YYYY-MM-DD
  dayName: string;      // Mon, Tue, etc.
  weatherCode: number;
  maxTemp: number;      // °C
  minTemp: number;      // °C
  precipitationSum: number; // mm
  maxWindSpeed: number; // km/h
  conditionText: string;
  iconName: string;
}

export interface WeatherData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  currentTemp: number;         // °C
  currentWindSpeed: number;    // km/h
  currentWeatherCode: number;
  currentConditionText: string;
  currentIconName: string;
  daily: DailyForecastDay[];
  updatedAt: string;           // ISO or readable timestamp
}

export type TemperatureUnit = 'C' | 'F';

export type RecommendationCategory =
  | 'Outdoor Activity'
  | 'Clothing & Gear'
  | 'Commute & Travel'
  | 'Health & Comfort'
  | 'UV & Atmosphere';

export interface PlanningRecommendation {
  id: string;
  category: RecommendationCategory;
  title: string;
  description: string;
  iconName: string;
  priority: 'high' | 'medium' | 'normal';
}

export interface AIBriefingResponse {
  success?: boolean;
  isFallback?: boolean;
  briefing: string;
  recommendations: {
    category: string;
    title: string;
    advice: string;
  }[];
}
