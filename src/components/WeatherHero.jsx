import React from 'react';
import {
  ArrowUp,
  ArrowDown,
  Thermometer,
  CloudRain,
  Wind,
  Droplets,
  Calendar,
  Clock
} from 'lucide-react';
import WeatherIcon from './WeatherIcon.jsx';
import { getWeatherCondition, formatTemp } from '../utils/weatherCodes.js';

export default function WeatherHero({ weather, location, tempUnit }) {
  if (!weather || !weather.current) return null;

  const current = weather.current;
  const cond = getWeatherCondition(current.weatherCode, current.isDay);

  // Format local date and time
  const dateObj = current.time ? new Date(current.time) : new Date();
  const dateString = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
  const timeString = dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });

  // Dynamic natural language description based on current metrics
  let conditionNarrative = cond.description;
  if (current.precipitation > 0) {
    conditionNarrative = `Precipitation active (${current.precipitation} mm). Expect wet road conditions and damp atmospheric cooling.`;
  } else if (current.temp > 28) {
    conditionNarrative = `Warm sunshine dominating the area. High UV exposure expected—stay hydrated and seek shade.`;
  } else if (current.temp < 5) {
    conditionNarrative = `Brisk chill present. Bundle up with thermal layers against cold ambient temperatures.`;
  } else {
    conditionNarrative = `${cond.label} persisting across the region with moderate humidity and steady atmospheric pressure.`;
  }

  return (
    <section className="weather-hero-card" id="weather-hero">
      {/* Top row: Location & Live Tag */}
      <div className="hero-header-row">
        <div className="hero-location-meta">
          <div className="live-status-indicator">
            <span className="live-pulsing-dot" />
            <span className="live-text">CURRENT OBSERVATION</span>
          </div>
          <h1 className="hero-city-name" id="current-city-title">
            {location?.name || 'Local Area'}
          </h1>
          <p className="hero-subregion">
            {[location?.admin1, location?.country].filter(Boolean).join(' • ') || 'Global Station'}
          </p>
        </div>

        <div className="hero-timestamp-badge">
          <div className="time-badge-item">
            <Clock size={14} />
            <span>{timeString}</span>
          </div>
          <div className="time-badge-item">
            <Calendar size={14} />
            <span>{dateString}</span>
          </div>
        </div>
      </div>

      {/* Main Hero Body: Giant Temperature & Weather Visual */}
      <div className="hero-main-layout">
        <div className="hero-temp-column">
          <div className="hero-temperature-display" id="hero-temp">
            <span className="temp-numerical-value">
              {formatTemp(current.temp, tempUnit).replace('°', '')}
            </span>
            <span className="temp-degree-symbol">°</span>
            <span className="temp-unit-indicator">{tempUnit}</span>
          </div>

          <div className="hero-condition-row">
            <div className="hero-icon-pill">
              <WeatherIcon
                iconName={cond.icon}
                size={34}
                className="hero-weather-icon"
              />
            </div>
            <div className="hero-condition-text">
              <h2 className="condition-headline">{cond.label}</h2>
              <p className="condition-feels-like">
                Feels like <strong>{formatTemp(current.apparentTemp, tempUnit)}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Right side: High / Low & Quick Stats Pill */}
        <div className="hero-highlow-column">
          <div className="hero-stat-pill">
            <div className="stat-pill-item">
              <div className="stat-pill-label">
                <ArrowUp size={15} className="arrow-icon high" />
                <span>TODAY'S HIGH</span>
              </div>
              <div className="stat-pill-value">
                {formatTemp(current.todayMax, tempUnit)}
              </div>
            </div>

            <div className="stat-pill-divider" />

            <div className="stat-pill-item">
              <div className="stat-pill-label">
                <ArrowDown size={15} className="arrow-icon low" />
                <span>TODAY'S LOW</span>
              </div>
              <div className="stat-pill-value">
                {formatTemp(current.todayMin, tempUnit)}
              </div>
            </div>
          </div>

          <div className="hero-mini-metrics">
            <div className="mini-metric-item">
              <Wind size={15} />
              <span>{Math.round(current.windSpeed)} km/h</span>
            </div>
            <div className="mini-metric-item">
              <Droplets size={15} />
              <span>{current.humidity}% Humidity</span>
            </div>
            <div className="mini-metric-item">
              <Thermometer size={15} />
              <span>Dew {formatTemp(current.dewPoint, tempUnit)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Narrative weather statement */}
      <div className="hero-narrative-bar">
        <p className="hero-narrative-text">{conditionNarrative}</p>
      </div>
    </section>
  );
}
