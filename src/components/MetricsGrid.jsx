import React from 'react';
import {
  Sun,
  Wind,
  Droplets,
  Activity,
  Sunrise,
  Sunset,
  Eye,
  Gauge,
  Compass,
  Sparkles
} from 'lucide-react';
import { getUVCategory, getAQICategory, getWindDirection, formatTemp } from '../utils/weatherCodes.js';

export default function MetricsGrid({ current, aqi, tempUnit }) {
  if (!current) return null;

  // UV details
  const uvValue = Math.round(current.uvIndex || 0);
  const uvInfo = getUVCategory(uvValue);
  const uvPercentage = Math.min(100, (uvValue / 12) * 100);

  // Wind details
  const windSpeed = Math.round(current.windSpeed || 0);
  const windGusts = Math.round(current.windGusts || current.windSpeed * 1.3 || 0);
  const windDirDeg = current.windDirection || 0;
  const windCardinal = getWindDirection(windDirDeg);

  // Humidity & Dew point
  const humidity = Math.round(current.humidity || 0);
  const dewPoint = current.dewPoint;

  // Air Quality
  const aqiScore = aqi?.usAqi ?? 42;
  const aqiInfo = getAQICategory(aqiScore);
  const aqiPercent = Math.min(100, (aqiScore / 300) * 100);

  // Sunrise / Sunset
  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    const d = new Date(isoString);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const sunriseFormatted = formatTime(current.sunrise);
  const sunsetFormatted = formatTime(current.sunset);

  // Calculate daylight percentage
  let sunProgress = 50;
  if (current.sunrise && current.sunset) {
    const now = new Date().getTime();
    const rise = new Date(current.sunrise).getTime();
    const set = new Date(current.sunset).getTime();
    if (now < rise) sunProgress = 0;
    else if (now > set) sunProgress = 100;
    else sunProgress = Math.round(((now - rise) / (set - rise)) * 100);
  }

  return (
    <div className="metrics-bento-grid" id="weather-metrics-grid">
      {/* 1. UV INDEX CARD */}
      <div className="glass-card metric-widget-card uv-card">
        <div className="widget-header">
          <div className="widget-title-wrap">
            <Sun size={15} className="widget-icon" />
            <span className="widget-title">UV INDEX</span>
          </div>
          <span
            className="widget-badge"
            style={{ color: uvInfo.color, borderColor: `${uvInfo.color}40`, backgroundColor: `${uvInfo.color}15` }}
          >
            {uvInfo.text}
          </span>
        </div>

        <div className="widget-main-value-row">
          <span className="widget-big-value">{uvValue}</span>
          <span className="widget-value-sub">of 12+</span>
        </div>

        {/* UV Spectrum Gradient Bar */}
        <div className="uv-meter-track">
          <div className="uv-meter-fill" />
          <div
            className="uv-meter-indicator"
            style={{ left: `${uvPercentage}%` }}
          />
        </div>

        <p className="widget-footer-advice">{uvInfo.advice}</p>
      </div>

      {/* 2. WIND CARD WITH COMPASS */}
      <div className="glass-card metric-widget-card wind-card">
        <div className="widget-header">
          <div className="widget-title-wrap">
            <Wind size={15} className="widget-icon" />
            <span className="widget-title">WIND & GUSTS</span>
          </div>
          <span className="widget-badge">{windCardinal}</span>
        </div>

        <div className="wind-widget-content">
          <div className="wind-data-column">
            <div className="widget-main-value-row">
              <span className="widget-big-value">{windSpeed}</span>
              <span className="widget-value-sub">km/h</span>
            </div>
            <div className="wind-gust-row">
              <span className="wind-sublabel">Gusts up to:</span>
              <span className="wind-subvalue">{windGusts} km/h</span>
            </div>
            <p className="widget-footer-advice">
              Steady {windCardinal} airflow across the terrain.
            </p>
          </div>

          {/* Graphical Compass Rose */}
          <div className="compass-visual-wrapper">
            <div className="compass-outer-ring">
              <span className="compass-cardinal north">N</span>
              <span className="compass-cardinal east">E</span>
              <span className="compass-cardinal south">S</span>
              <span className="compass-cardinal west">W</span>
              <div
                className="compass-needle-container"
                style={{ transform: `rotate(${windDirDeg}deg)` }}
              >
                <div className="compass-needle-arrow" />
              </div>
              <div className="compass-center-pivot" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. HUMIDITY & DEW POINT */}
      <div className="glass-card metric-widget-card humidity-card">
        <div className="widget-header">
          <div className="widget-title-wrap">
            <Droplets size={15} className="widget-icon" />
            <span className="widget-title">HUMIDITY</span>
          </div>
          <span className="widget-badge">
            {humidity > 70 ? 'Humid' : humidity < 35 ? 'Dry' : 'Comfortable'}
          </span>
        </div>

        <div className="widget-main-value-row">
          <span className="widget-big-value">{humidity}</span>
          <span className="widget-value-sub">%</span>
        </div>

        {/* Humidity Progress Bar */}
        <div className="humidity-meter-track">
          <div
            className="humidity-meter-fill"
            style={{ width: `${humidity}%` }}
          />
        </div>

        <div className="dew-point-pill">
          <span>The dew point is <strong>{formatTemp(dewPoint, tempUnit)}</strong> right now.</span>
        </div>
      </div>

      {/* 4. AIR QUALITY INDEX (AQI) */}
      <div className="glass-card metric-widget-card aqi-card">
        <div className="widget-header">
          <div className="widget-title-wrap">
            <Activity size={15} className="widget-icon" />
            <span className="widget-title">AIR QUALITY (AQI)</span>
          </div>
          <span
            className="widget-badge"
            style={{ color: aqiInfo.color, borderColor: `${aqiInfo.color}40`, backgroundColor: `${aqiInfo.color}15` }}
          >
            {aqiInfo.status}
          </span>
        </div>

        <div className="widget-main-value-row">
          <span className="widget-big-value">{aqiScore}</span>
          <span className="widget-value-sub">US AQI</span>
        </div>

        <div className="aqi-meter-track">
          <div className="aqi-meter-gradient" />
          <div
            className="aqi-meter-indicator"
            style={{ left: `${aqiPercent}%` }}
          />
        </div>

        <div className="aqi-particulates-row">
          <div className="particulate-item">
            <span className="particulate-name">PM2.5</span>
            <span className="particulate-val">{aqi?.pm25 ?? 5.8} µg/m³</span>
          </div>
          <div className="particulate-divider" />
          <div className="particulate-item">
            <span className="particulate-name">PM10</span>
            <span className="particulate-val">{aqi?.pm10 ?? 12.1} µg/m³</span>
          </div>
        </div>
      </div>

      {/* 5. SUNRISE & SUNSET WITH CELESTIAL ARC */}
      <div className="glass-card metric-widget-card celestial-card">
        <div className="widget-header">
          <div className="widget-title-wrap">
            <Sunrise size={15} className="widget-icon" />
            <span className="widget-title">SUNRISE & SUNSET</span>
          </div>
          <span className="widget-badge">Daylight Arc</span>
        </div>

        {/* Celestial Arc Graphic */}
        <div className="celestial-arc-stage">
          <svg className="celestial-svg" viewBox="0 0 240 100" fill="none">
            {/* Background dashed path */}
            <path
              d="M 20 85 Q 120 10 220 85"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            {/* Horizon line */}
            <line
              x1="10"
              y1="85"
              x2="230"
              y2="85"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="1.5"
            />
            {/* Illuminated active arc */}
            <path
              d="M 20 85 Q 120 10 220 85"
              stroke="url(#sun-gradient)"
              strokeWidth="3"
              strokeDasharray="300"
              strokeDashoffset={300 - (sunProgress / 100) * 300}
            />
            <defs>
              <linearGradient id="sun-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
          </svg>
          <div className="celestial-sun-marker" style={{ left: `calc(${sunProgress}% - 8px)` }}>
            <div className="sun-dot-glow" />
          </div>
        </div>

        <div className="sunrise-sunset-times-row">
          <div className="celestial-event-item">
            <Sunrise size={16} className="event-icon rise" />
            <div className="event-meta">
              <span className="event-label">Sunrise</span>
              <span className="event-time">{sunriseFormatted}</span>
            </div>
          </div>
          <div className="celestial-event-item right">
            <Sunset size={16} className="event-icon set" />
            <div className="event-meta">
              <span className="event-label">Sunset</span>
              <span className="event-time">{sunsetFormatted}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. PRESSURE & VISIBILITY */}
      <div className="glass-card metric-widget-card atmosphere-card">
        <div className="widget-header">
          <div className="widget-title-wrap">
            <Gauge size={15} className="widget-icon" />
            <span className="widget-title">BAROMETER & OPTICAL</span>
          </div>
          <span className="widget-badge">Atmospheric</span>
        </div>

        <div className="atmosphere-duo-metrics">
          <div className="atmo-metric-half">
            <div className="atmo-header">
              <Gauge size={14} />
              <span>PRESSURE</span>
            </div>
            <div className="atmo-val-wrap">
              <span className="atmo-big">{Math.round(current.pressure)}</span>
              <span className="atmo-unit">hPa</span>
            </div>
            <span className="atmo-status">
              {current.pressure >= 1013 ? 'Steady High' : 'Low Pressure'}
            </span>
          </div>

          <div className="atmo-divider-vertical" />

          <div className="atmo-metric-half">
            <div className="atmo-header">
              <Eye size={14} />
              <span>VISIBILITY</span>
            </div>
            <div className="atmo-val-wrap">
              <span className="atmo-big">{current.visibility ? current.visibility.toFixed(0) : '16'}</span>
              <span className="atmo-unit">km</span>
            </div>
            <span className="atmo-status">
              {current.visibility >= 10 ? 'Crystal Clear' : 'Light Haze'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
