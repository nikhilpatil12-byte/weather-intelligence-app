import React from 'react';
import { Calendar, Droplets, Wind } from 'lucide-react';
import { DailyForecastDay, TemperatureUnit } from '../types/weather';
import { formatTemp, formatWindSpeed } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';

interface DailyForecastGridProps {
  days: DailyForecastDay[];
  unit: TemperatureUnit;
}

export const DailyForecastGrid: React.FC<DailyForecastGridProps> = ({ days, unit }) => {
  if (!days || days.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            7-Day Daily Forecast
          </h3>
        </div>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Open-Meteo Highs & Lows
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {days.map((day, index) => {
          const isToday = index === 0;

          return (
            <div
              key={day.date}
              className={`flex flex-col justify-between p-4 rounded-2xl border transition-all duration-300 hover:shadow-md ${
                isToday
                  ? 'bg-sky-50/70 dark:bg-sky-950/30 border-sky-300 dark:border-sky-800 shadow-sm'
                  : 'bg-white dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {/* Day Name & Date Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm font-bold ${
                      isToday
                        ? 'text-sky-700 dark:text-sky-300'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {day.dayName}
                  </p>
                  <p className="text-xs text-slate-400">{day.date.slice(5)}</p>
                </div>
                {isToday && (
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-sky-600 text-white">
                    Now
                  </span>
                )}
              </div>

              {/* Weather Condition Icon & Text */}
              <div className="my-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-2">
                  <WeatherIcon name={day.iconName} className="w-7 h-7" />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-1">
                  {day.conditionText}
                </span>
              </div>

              {/* Temperature High / Low */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">High</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatTemp(day.maxTemp, unit)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Low</span>
                  <span className="font-semibold text-slate-600 dark:text-slate-400">
                    {formatTemp(day.minTemp, unit)}
                  </span>
                </div>

                {/* Additional metrics */}
                <div className="pt-1.5 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1" title="Precipitation">
                    <Droplets className="w-3 h-3 text-sky-500" />
                    {day.precipitationSum.toFixed(1)} mm
                  </span>
                  <span className="flex items-center gap-1" title="Max Wind Speed">
                    <Wind className="w-3 h-3 text-blue-500" />
                    {formatWindSpeed(day.maxWindSpeed, unit)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
