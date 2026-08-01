import React from 'react';
import { Wind, Droplets, MapPin, ArrowUp, ArrowDown, Clock } from 'lucide-react';
import { WeatherData, TemperatureUnit } from '../types/weather';
import { formatTemp, formatWindSpeed, getWeatherCodeInfo } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  data: WeatherData;
  unit: TemperatureUnit;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ data, unit }) => {
  const codeInfo = getWeatherCodeInfo(data.currentWeatherCode);
  const todayForecast = data.daily[0];

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br ${codeInfo.cardBgGradient} bg-white dark:bg-slate-900/90 shadow-xl transition-all duration-500`}
    >
      {/* Decorative ambient lighting blob */}
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-sky-500/10 dark:bg-sky-400/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left column: Location & Condition badge */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${codeInfo.badgeBg} ${codeInfo.badgeText}`}
            >
              <WeatherIcon name={codeInfo.iconName} className="w-3.5 h-3.5" />
              {codeInfo.label}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Updated at {data.updatedAt}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-sky-500 shrink-0" />
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {data.city}
            </h2>
            {data.country && (
              <span className="text-base sm:text-lg font-medium px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {data.country}
              </span>
            )}
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300">
            Current coordinates: {data.latitude.toFixed(2)}°N, {data.longitude.toFixed(2)}°E
          </p>
        </div>

        {/* Middle/Right: Big Temperature & Icon */}
        <div className="flex items-center gap-6 sm:gap-8 justify-between md:justify-end">
          <div className="flex items-baseline gap-1">
            <span className="text-6xl sm:text-7xl font-black tracking-tighter text-slate-900 dark:text-white drop-shadow-sm">
              {formatTemp(data.currentTemp, unit).replace('°' + unit, '')}
            </span>
            <span className="text-3xl sm:text-4xl font-extrabold text-sky-600 dark:text-sky-400">
              °{unit}
            </span>
          </div>

          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-slate-100 to-white dark:from-slate-800 dark:to-slate-700/80 flex items-center justify-center shadow-lg border border-slate-200/60 dark:border-slate-700">
            <WeatherIcon
              name={codeInfo.iconName}
              className="w-12 h-12 sm:w-14 sm:h-14 text-sky-600 dark:text-sky-400 drop-shadow"
            />
          </div>
        </div>
      </div>

      {/* Footer Metrics Row */}
      <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Today's High */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-100 dark:border-slate-700/60">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <ArrowUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Daily High</p>
            <p className="text-base font-bold text-slate-900 dark:text-white">
              {todayForecast ? formatTemp(todayForecast.maxTemp, unit) : '--'}
            </p>
          </div>
        </div>

        {/* Today's Low */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-100 dark:border-slate-700/60">
          <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <ArrowDown className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Daily Low</p>
            <p className="text-base font-bold text-slate-900 dark:text-white">
              {todayForecast ? formatTemp(todayForecast.minTemp, unit) : '--'}
            </p>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-100 dark:border-slate-700/60">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Wind Speed</p>
            <p className="text-base font-bold text-slate-900 dark:text-white">
              {formatWindSpeed(data.currentWindSpeed, unit)}
            </p>
          </div>
        </div>

        {/* Precipitation Today */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-100 dark:border-slate-700/60">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Precipitation</p>
            <p className="text-base font-bold text-slate-900 dark:text-white">
              {todayForecast ? `${todayForecast.precipitationSum.toFixed(1)} mm` : '0.0 mm'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
