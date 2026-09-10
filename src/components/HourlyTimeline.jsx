import React, { useRef } from 'react';
import { Clock, ChevronLeft, ChevronRight, Droplets } from 'lucide-react';
import WeatherIcon from './WeatherIcon.jsx';
import { getWeatherCondition, formatTemp } from '../utils/weatherCodes.js';

export default function HourlyTimeline({ hourly, tempUnit }) {
  const scrollRef = useRef(null);

  if (!hourly || hourly.length === 0) return null;

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="glass-card hourly-timeline-card" id="hourly-forecast">
      <div className="card-section-header">
        <div className="section-title-wrap">
          <Clock size={16} className="section-header-icon" />
          <h3 className="section-title">24-HOUR HOURLY OUTLOOK</h3>
        </div>
        <div className="timeline-nav-buttons">
          <button
            type="button"
            className="timeline-nav-arrow"
            onClick={() => handleScroll('left')}
            aria-label="Scroll hourly left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className="timeline-nav-arrow"
            onClick={() => handleScroll('right')}
            aria-label="Scroll hourly right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="timeline-scroll-container" ref={scrollRef}>
        <div className="timeline-items-row">
          {hourly.slice(0, 24).map((item, index) => {
            const cond = getWeatherCondition(item.weatherCode, item.isDay);
            const dateObj = new Date(item.time);
            const timeLabel = item.isNow
              ? 'Now'
              : dateObj.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  hour12: true
                });

            const hasPrecip = item.precipitationProb > 0;

            return (
              <div
                key={item.time || index}
                className={`timeline-hour-slot ${item.isNow ? 'is-current-hour' : ''}`}
              >
                <span className="slot-time-label">{timeLabel}</span>

                <div className="slot-icon-container">
                  <WeatherIcon
                    iconName={cond.icon}
                    size={26}
                    className="slot-weather-icon"
                  />
                </div>

                {/* Rain probability chip if chance exists */}
                <div className="slot-precip-wrap">
                  {hasPrecip ? (
                    <span className="slot-precip-badge">
                      <Droplets size={10} />
                      {item.precipitationProb}%
                    </span>
                  ) : (
                    <span className="slot-precip-placeholder" />
                  )}
                </div>

                <div className="slot-temp-value">
                  {formatTemp(item.temp, tempUnit)}
                </div>

                <div className="slot-condition-label">
                  {cond.label.split(' ')[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
