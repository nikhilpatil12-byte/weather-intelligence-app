import { WeatherData, PlanningRecommendation, TemperatureUnit } from '../types/weather';

export interface WeatherCodeInfo {
  label: string;
  iconName: string;
  badgeBg: string;
  badgeText: string;
  cardBgGradient: string;
  accentColor: string;
}

export function getWeatherCodeInfo(code: number): WeatherCodeInfo {
  switch (code) {
    case 0:
      return {
        label: 'Clear Sky',
        iconName: 'Sun',
        badgeBg: 'bg-amber-100 dark:bg-amber-900/40',
        badgeText: 'text-amber-800 dark:text-amber-200',
        cardBgGradient: 'from-amber-500/15 via-sky-500/10 to-blue-500/5',
        accentColor: '#f59e0b',
      };
    case 1:
      return {
        label: 'Mainly Clear',
        iconName: 'CloudSun',
        badgeBg: 'bg-amber-100 dark:bg-amber-900/40',
        badgeText: 'text-amber-800 dark:text-amber-200',
        cardBgGradient: 'from-amber-400/10 via-blue-500/10 to-sky-500/5',
        accentColor: '#f59e0b',
      };
    case 2:
      return {
        label: 'Partly Cloudy',
        iconName: 'CloudSun',
        badgeBg: 'bg-sky-100 dark:bg-sky-900/40',
        badgeText: 'text-sky-800 dark:text-sky-200',
        cardBgGradient: 'from-sky-500/10 via-slate-500/10 to-blue-500/5',
        accentColor: '#0284c7',
      };
    case 3:
      return {
        label: 'Overcast',
        iconName: 'Cloud',
        badgeBg: 'bg-slate-100 dark:bg-slate-800/60',
        badgeText: 'text-slate-700 dark:text-slate-300',
        cardBgGradient: 'from-slate-500/15 via-zinc-500/10 to-gray-500/5',
        accentColor: '#64748b',
      };
    case 45:
    case 48:
      return {
        label: 'Foggy',
        iconName: 'CloudFog',
        badgeBg: 'bg-zinc-100 dark:bg-zinc-800/60',
        badgeText: 'text-zinc-700 dark:text-zinc-300',
        cardBgGradient: 'from-zinc-500/15 via-slate-500/10 to-gray-500/5',
        accentColor: '#71717a',
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Drizzle',
        iconName: 'CloudDrizzle',
        badgeBg: 'bg-blue-100 dark:bg-blue-900/40',
        badgeText: 'text-blue-800 dark:text-blue-200',
        cardBgGradient: 'from-blue-500/15 via-sky-500/10 to-cyan-500/5',
        accentColor: '#3b82f6',
      };
    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        iconName: 'CloudSnow',
        badgeBg: 'bg-cyan-100 dark:bg-cyan-900/40',
        badgeText: 'text-cyan-800 dark:text-cyan-200',
        cardBgGradient: 'from-cyan-500/15 via-blue-500/10 to-slate-500/5',
        accentColor: '#06b6d4',
      };
    case 61:
      return {
        label: 'Slight Rain',
        iconName: 'CloudRain',
        badgeBg: 'bg-blue-100 dark:bg-blue-900/40',
        badgeText: 'text-blue-800 dark:text-blue-200',
        cardBgGradient: 'from-blue-500/15 via-indigo-500/10 to-sky-500/5',
        accentColor: '#2563eb',
      };
    case 63:
      return {
        label: 'Moderate Rain',
        iconName: 'CloudRain',
        badgeBg: 'bg-blue-100 dark:bg-blue-900/40',
        badgeText: 'text-blue-800 dark:text-blue-200',
        cardBgGradient: 'from-blue-600/15 via-sky-600/10 to-indigo-500/5',
        accentColor: '#1d4ed8',
      };
    case 65:
      return {
        label: 'Heavy Rain',
        iconName: 'CloudRain',
        badgeBg: 'bg-indigo-100 dark:bg-indigo-900/40',
        badgeText: 'text-indigo-800 dark:text-indigo-200',
        cardBgGradient: 'from-indigo-600/20 via-blue-600/10 to-slate-600/10',
        accentColor: '#4338ca',
      };
    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        iconName: 'CloudHail',
        badgeBg: 'bg-cyan-100 dark:bg-cyan-900/40',
        badgeText: 'text-cyan-800 dark:text-cyan-200',
        cardBgGradient: 'from-cyan-600/15 via-blue-500/10 to-slate-500/5',
        accentColor: '#0891b2',
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        label: 'Snow',
        iconName: 'Snowflake',
        badgeBg: 'bg-sky-100 dark:bg-sky-900/40',
        badgeText: 'text-sky-800 dark:text-sky-200',
        cardBgGradient: 'from-sky-400/15 via-blue-400/10 to-slate-400/5',
        accentColor: '#0284c7',
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Rain Showers',
        iconName: 'CloudRainWind',
        badgeBg: 'bg-blue-100 dark:bg-blue-900/40',
        badgeText: 'text-blue-800 dark:text-blue-200',
        cardBgGradient: 'from-blue-500/20 via-indigo-500/10 to-sky-500/10',
        accentColor: '#2563eb',
      };
    case 85:
    case 86:
      return {
        label: 'Snow Showers',
        iconName: 'Snowflake',
        badgeBg: 'bg-sky-100 dark:bg-sky-900/40',
        badgeText: 'text-sky-800 dark:text-sky-200',
        cardBgGradient: 'from-sky-500/15 via-cyan-500/10 to-blue-500/5',
        accentColor: '#0284c7',
      };
    case 95:
    case 96:
    case 99:
      return {
        label: 'Thunderstorm',
        iconName: 'CloudLightning',
        badgeBg: 'bg-purple-100 dark:bg-purple-900/40',
        badgeText: 'text-purple-800 dark:text-purple-200',
        cardBgGradient: 'from-purple-600/20 via-indigo-600/10 to-slate-600/10',
        accentColor: '#7c3aed',
      };
    default:
      return {
        label: 'Fair',
        iconName: 'Sun',
        badgeBg: 'bg-amber-100 dark:bg-amber-900/40',
        badgeText: 'text-amber-800 dark:text-amber-200',
        cardBgGradient: 'from-amber-500/10 via-blue-500/5 to-slate-500/5',
        accentColor: '#f59e0b',
      };
  }
}

export function convertTemp(tempC: number, unit: TemperatureUnit): number {
  if (unit === 'F') {
    return Math.round((tempC * 9) / 5 + 32);
  }
  return Math.round(tempC);
}

export function formatTemp(tempC: number, unit: TemperatureUnit): string {
  const value = convertTemp(tempC, unit);
  return `${value}°${unit}`;
}

export function formatWindSpeed(kmh: number, unit: TemperatureUnit): string {
  if (unit === 'F') {
    const mph = Math.round(kmh * 0.621371);
    return `${mph} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function generateRuleBasedRecommendations(data: WeatherData): PlanningRecommendation[] {
  const recommendations: PlanningRecommendation[] = [];
  const temp = data.currentTemp;
  const wind = data.currentWindSpeed;
  const code = data.currentWeatherCode;
  const todayForecast = data.daily[0];
  const nextThreeDaysRain = data.daily.slice(0, 3).some((d) => d.precipitationSum > 1.5 || d.weatherCode >= 51);

  // 1. Outdoor Activity recommendation
  if (code === 0 || code === 1 || code === 2) {
    if (temp >= 16 && temp <= 27 && wind < 25) {
      recommendations.push({
        id: 'outdoor-ideal',
        category: 'Outdoor Activity',
        title: 'Ideal conditions for outdoor activity',
        description: `Mild ${Math.round(temp)}°C temperatures and gentle winds make today perfect for walking, running, or cycling.`,
        iconName: 'Compass',
        priority: 'high',
      });
    } else if (temp > 27) {
      recommendations.push({
        id: 'outdoor-warm',
        category: 'Outdoor Activity',
        title: 'Warm weather activity guidance',
        description: `Temperatures are warm at ${Math.round(temp)}°C. Consider outdoor sports during early morning or late afternoon hours.`,
        iconName: 'Sun',
        priority: 'medium',
      });
    } else {
      recommendations.push({
        id: 'outdoor-crisp',
        category: 'Outdoor Activity',
        title: 'Crisp outdoor conditions',
        description: `Clear skies with cool ${Math.round(temp)}°C air. Excellent for a refreshing walk with appropriate warm clothing.`,
        iconName: 'Wind',
        priority: 'normal',
      });
    }
  } else if (code >= 51 || nextThreeDaysRain) {
    recommendations.push({
      id: 'rain-alert',
      category: 'Outdoor Activity',
      title: 'Rain anticipated, pack an umbrella',
      description: `Precipitation is detected or forecasted. Opt for indoor exercise or keep rain gear handy when heading out.`,
      iconName: 'Umbrella',
      priority: 'high',
    });
  } else {
    recommendations.push({
      id: 'outdoor-fair',
      category: 'Outdoor Activity',
      title: 'Moderate conditions for outings',
      description: `Skies are ${data.currentConditionText.toLowerCase()}. Outdoor plans are feasible with comfortable layering.`,
      iconName: 'Navigation',
      priority: 'normal',
    });
  }

  // 2. Clothing & Gear recommendation
  if (temp < 10) {
    recommendations.push({
      id: 'clothing-cold',
      category: 'Clothing & Gear',
      title: 'Layer up for colder weather',
      description: `With temperatures at ${Math.round(temp)}°C, a thermal inner layer and wind-resistant jacket are recommended.`,
      iconName: 'Shirt',
      priority: 'high',
    });
  } else if (temp >= 10 && temp <= 19) {
    recommendations.push({
      id: 'clothing-mild',
      category: 'Clothing & Gear',
      title: 'Versatile layering advised',
      description: `Mild temperatures around ${Math.round(temp)}°C. A light jacket or sweater is ideal for shifting temperatures.`,
      iconName: 'Shirt',
      priority: 'medium',
    });
  } else {
    recommendations.push({
      id: 'clothing-warm',
      category: 'Clothing & Gear',
      title: 'Light & breathable attire',
      description: `Warm weather at ${Math.round(temp)}°C. Breathable fabrics and sunglasses are recommended for comfort.`,
      iconName: 'Sun',
      priority: 'normal',
    });
  }

  // 3. Commute & Travel advisory
  if (wind > 35) {
    recommendations.push({
      id: 'wind-advisory',
      category: 'Commute & Travel',
      title: 'Gusty wind advisory',
      description: `Wind speeds reaching ${Math.round(wind)} km/h. Cyclists and drivers on open bridges should exercise caution.`,
      iconName: 'Wind',
      priority: 'high',
    });
  } else if (code >= 71) {
    recommendations.push({
      id: 'snow-commute',
      category: 'Commute & Travel',
      title: 'Winter commute caution',
      description: `Snow conditions present. Allow extra travel time and check road conditions before departure.`,
      iconName: 'Snowflake',
      priority: 'high',
    });
  } else {
    recommendations.push({
      id: 'commute-smooth',
      category: 'Commute & Travel',
      title: 'Smooth travel conditions expected',
      description: `Visibility and road conditions are favorable across ${data.city}. No weather-related transit delays expected.`,
      iconName: 'Car',
      priority: 'normal',
    });
  }

  // 4. UV / Atmosphere tip
  if (code === 0 && temp > 22) {
    recommendations.push({
      id: 'uv-protection',
      category: 'UV & Atmosphere',
      title: 'High sun exposure alert',
      description: `Unobstructed sunshine today. Apply SPF 30+ sunscreen if spending over 30 minutes outdoors.`,
      iconName: 'Shield',
      priority: 'medium',
    });
  } else if (todayForecast && todayForecast.maxTemp - todayForecast.minTemp > 10) {
    recommendations.push({
      id: 'temp-swing',
      category: 'Health & Comfort',
      title: 'Wide daily temperature swing',
      description: `Expect a ${Math.round(todayForecast.maxTemp - todayForecast.minTemp)}°C variation between afternoon highs and cool evening lows.`,
      iconName: 'Thermometer',
      priority: 'normal',
    });
  }

  return recommendations;
}
