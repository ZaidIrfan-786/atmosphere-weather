import React, { useState } from 'react';
import { History, ChevronDown, ChevronUp, Droplets, Wind, Thermometer, Clock } from 'lucide-react';
import WeatherIcon from './WeatherIcon.jsx';
import { getWeatherCondition, formatTemp } from '../utils/weatherCodes.js';

export default function HistoricalData({ historical, tempUnit }) {
  const [expandedDate, setExpandedDate] = useState(null);

  if (!historical || historical.length === 0) return null;

  // Reverse so the most recent past day (yesterday) is first
  const pastDays = [...historical].reverse();

  // Compute 5-day average high & low
  const avgHigh = pastDays.reduce((acc, d) => acc + d.tempMax, 0) / pastDays.length;
  const avgLow = pastDays.reduce((acc, d) => acc + d.tempMin, 0) / pastDays.length;

  const toggleAccordion = (date) => {
    setExpandedDate(prev => (prev === date ? null : date));
  };

  return (
    <section className="glass-card historical-card" id="historical-data">
      <div className="card-section-header">
        <div className="section-title-wrap">
          <History size={16} className="section-header-icon" />
          <h3 className="section-title">HISTORICAL ARCHIVE (PAST 5 DAYS)</h3>
        </div>
        <div className="history-avg-badge" title="5-day average temperature spread">
          <span>Avg H: {formatTemp(avgHigh, tempUnit)}</span>
          <span className="avg-divider">•</span>
          <span>L: {formatTemp(avgLow, tempUnit)}</span>
        </div>
      </div>

      <div className="history-timeline-list">
        {pastDays.map((item, index) => {
          const dateObj = new Date(item.date + 'T00:00:00');
          const isYesterday = index === 0;
          const dayTitle = isYesterday
            ? 'Yesterday'
            : dateObj.toLocaleDateString('en-US', { weekday: 'long' });
          const formattedDate = dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          });

          const cond = getWeatherCondition(item.weatherCode, 1);
          const isExpanded = expandedDate === item.date;

          return (
            <div
              key={item.date}
              className={`history-accordion-item ${isExpanded ? 'expanded' : ''}`}
            >
              <button
                type="button"
                className="history-row-header"
                onClick={() => toggleAccordion(item.date)}
                aria-expanded={isExpanded}
              >
                {/* Left: Timeline Dot & Day Info */}
                <div className="history-day-identity">
                  <div className="history-timeline-node">
                    <div className="node-pulse-circle" />
                  </div>
                  <div className="history-day-meta">
                    <span className="history-day-title">{dayTitle}</span>
                    <span className="history-day-date">{formattedDate}</span>
                  </div>
                </div>

                {/* Middle: Weather Condition */}
                <div className="history-condition-summary">
                  <WeatherIcon
                    iconName={cond.icon}
                    size={20}
                    className="history-row-icon"
                  />
                  <span className="history-condition-name">{cond.label}</span>
                </div>

                {/* Right: High/Low & Chevron */}
                <div className="history-temp-summary">
                  <div className="history-temp-pair">
                    <span className="history-high">{formatTemp(item.tempMax, tempUnit)}</span>
                    <span className="history-temp-slash">/</span>
                    <span className="history-low">{formatTemp(item.tempMin, tempUnit)}</span>
                  </div>
                  <div className="history-expand-indicator">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </button>

              {/* Accordion Detailed Panel */}
              {isExpanded && (
                <div className="history-detail-panel">
                  <div className="history-detail-grid">
                    <div className="history-metric-box">
                      <span className="metric-box-label">
                        <Droplets size={13} />
                        PRECIPITATION
                      </span>
                      <span className="metric-box-value">
                        {item.precipitationSum > 0 ? `${item.precipitationSum} mm` : '0 mm (Dry)'}
                      </span>
                    </div>

                    <div className="history-metric-box">
                      <span className="metric-box-label">
                        <Wind size={13} />
                        MAX WIND GUST
                      </span>
                      <span className="metric-box-value">
                        {Math.round(item.windMax)} km/h
                      </span>
                    </div>

                    <div className="history-metric-box">
                      <span className="metric-box-label">
                        <Thermometer size={13} />
                        DIURNAL RANGE
                      </span>
                      <span className="metric-box-value">
                        Δ {formatTemp(item.tempMax - item.tempMin, tempUnit).replace('°', '')}° spread
                      </span>
                    </div>
                  </div>
                  <p className="history-recap-text">
                    Recorded meteorological condition: <em>{cond.description}</em>.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
