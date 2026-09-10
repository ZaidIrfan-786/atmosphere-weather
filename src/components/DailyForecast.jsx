import React from 'react';
import { CalendarDays, Droplets, Sun } from 'lucide-react';
import WeatherIcon from './WeatherIcon.jsx';
import { getWeatherCondition, formatTemp } from '../utils/weatherCodes.js';

export default function DailyForecast({ forecast, currentTemp, forecastRange, tempUnit }) {
  if (!forecast || forecast.length === 0) return null;

  // Take today + next 5 days, or just 5 days
  const displayDays = forecast.slice(0, 6);

  const globalMin = forecastRange?.min ?? 10;
  const globalMax = forecastRange?.max ?? 30;
  const totalRange = Math.max(1, globalMax - globalMin);

  return (
    <section className="glass-card daily-forecast-card" id="future-forecast">
      <div className="card-section-header">
        <div className="section-title-wrap">
          <CalendarDays size={16} className="section-header-icon" />
          <h3 className="section-title">5-DAY OUTLOOK & TEMPERATURE RANGE</h3>
        </div>
        <span className="section-header-hint">Weekly Temperature Spectrum</span>
      </div>

      <div className="daily-list-container">
        {displayDays.map((day, idx) => {
          const dateObj = new Date(day.date + 'T00:00:00');
          const dayName = day.isToday
            ? 'Today'
            : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          const fullDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          const cond = getWeatherCondition(day.weatherCode, 1);

          // Calculate bar position and width percentage
          const leftPercent = Math.max(0, Math.min(95, ((day.tempMin - globalMin) / totalRange) * 100));
          const rightPercent = Math.max(5, Math.min(100, ((day.tempMax - globalMin) / totalRange) * 100));
          const widthPercent = Math.max(6, rightPercent - leftPercent);

          // Calculate current temp dot position for today
          let currentDotPercent = null;
          if (day.isToday && currentTemp !== undefined && currentTemp !== null) {
            currentDotPercent = Math.max(0, Math.min(100, ((currentTemp - globalMin) / totalRange) * 100));
          }

          return (
            <div
              key={day.date || idx}
              className={`daily-forecast-row ${day.isToday ? 'is-today-row' : ''}`}
            >
              {/* Day Name & Date */}
              <div className="daily-day-col">
                <span className="day-name-primary">{dayName}</span>
                <span className="day-date-secondary">{fullDate}</span>
              </div>

              {/* Weather Icon & Label */}
              <div className="daily-weather-col">
                <WeatherIcon
                  iconName={cond.icon}
                  size={22}
                  className="daily-row-icon"
                />
                <span className="daily-condition-label">{cond.label}</span>
                {day.precipitationSum > 0 && (
                  <span className="daily-precip-tag">
                    <Droplets size={11} />
                    {day.precipitationSum} mm
                  </span>
                )}
              </div>

              {/* Min Temperature */}
              <div className="daily-min-temp">
                {formatTemp(day.tempMin, tempUnit)}
              </div>

              {/* Apple-style Temperature Range Bar */}
              <div className="daily-range-bar-track">
                <div
                  className="daily-range-bar-fill"
                  style={{
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`
                  }}
                />
                {currentDotPercent !== null && (
                  <div
                    className="current-temp-indicator-dot"
                    style={{ left: `${currentDotPercent}%` }}
                    title={`Current: ${formatTemp(currentTemp, tempUnit)}`}
                  />
                )}
              </div>

              {/* Max Temperature */}
              <div className="daily-max-temp">
                {formatTemp(day.tempMax, tempUnit)}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
