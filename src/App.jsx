import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar.jsx';
import WeatherHero from './components/WeatherHero.jsx';
import HourlyTimeline from './components/HourlyTimeline.jsx';
import DailyForecast from './components/DailyForecast.jsx';
import HistoricalData from './components/HistoricalData.jsx';
import MetricsGrid from './components/MetricsGrid.jsx';
import { fetchWeatherData, reverseGeocode, POPULAR_LOCATIONS } from './utils/api.js';
import { getWeatherCondition } from './utils/weatherCodes.js';
import { Loader2, AlertCircle, RefreshCw, Compass, MapPin } from 'lucide-react';

const DEFAULT_LOCATION = POPULAR_LOCATIONS[0]; // New York

export default function App() {
  const [currentLocation, setCurrentLocation] = useState(DEFAULT_LOCATION);
  const [weatherData, setWeatherData] = useState(null);
  const [tempUnit, setTempUnit] = useState('C');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Load weather data for a given location
  const loadWeather = useCallback(async (loc, showRefreshSpinner = false) => {
    if (!loc) return;
    if (showRefreshSpinner) setIsRefreshing(true);
    else setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await fetchWeatherData(loc.lat, loc.lon, loc.timezone || 'auto');
      setWeatherData(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to load weather:', err);
      setErrorMessage(
        'Unable to fetch meteorological observation data. Please verify your connection or try another city.'
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadWeather(currentLocation);
  }, []);

  // Handle location selection from search or quick pills
  const handleSelectLocation = (loc) => {
    setCurrentLocation(loc);
    loadWeather(loc);
  };

  // Handle browser geolocation auto-detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const locDetails = await reverseGeocode(latitude, longitude);
          const detectedLoc = {
            name: locDetails.name || 'Current Location',
            admin1: locDetails.admin1 || '',
            country: locDetails.country || '',
            lat: latitude,
            lon: longitude,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto'
          };
          setCurrentLocation(detectedLoc);
          await loadWeather(detectedLoc);
        } catch (e) {
          console.error('Location detection error:', e);
        } finally {
          setIsDetecting(false);
        }
      },
      (err) => {
        console.warn('Geolocation denied or failed:', err);
        setIsDetecting(false);
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  // Refresh current data
  const handleRefresh = () => {
    if (currentLocation) {
      loadWeather(currentLocation, true);
    }
  };

  // Toggle temperature unit
  const handleToggleUnit = (unit) => {
    setTempUnit(unit);
  };

  // Determine ambient background weather theme
  const weatherCode = weatherData?.current?.weatherCode ?? 0;
  const isDay = weatherData?.current?.isDay ?? 1;
  const cond = getWeatherCondition(weatherCode, isDay);
  const themeClass = `theme-${cond.theme || 'clear-day'}`;

  return (
    <div className={`atmosphere-app-root ${themeClass}`}>
      {/* Ambient background lighting orbs */}
      <div className="ambient-backdrop-canvas">
        <div className="ambient-orb orb-primary" />
        <div className="ambient-orb orb-secondary" />
        <div className="ambient-orb orb-tertiary" />
        <div className="ambient-grid-overlay" />
      </div>

      {/* Main Glass Shell */}
      <div className="app-layout-wrapper">
        <Navbar
          currentLocation={currentLocation}
          onSelectLocation={handleSelectLocation}
          onDetectLocation={handleDetectLocation}
          isDetecting={isDetecting}
          tempUnit={tempUnit}
          onToggleUnit={handleToggleUnit}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        {/* Quick Popular Location Selector Pills */}
        <div className="quick-cities-bar" id="quick-cities">
          <div className="quick-cities-label">
            <Compass size={13} />
            <span>POPULAR REGIONS:</span>
          </div>
          <div className="quick-cities-scroll">
            {POPULAR_LOCATIONS.map((loc) => {
              const isSelected = currentLocation?.name === loc.name;
              return (
                <button
                  key={loc.name}
                  type="button"
                  className={`quick-city-pill ${isSelected ? 'active' : ''}`}
                  onClick={() => handleSelectLocation(loc)}
                >
                  <MapPin size={11} className="city-pin-icon" />
                  <span>{loc.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="glass-card error-banner-card" id="error-banner">
            <AlertCircle size={20} className="error-icon" />
            <div className="error-text-content">
              <h4>Connection Interruption</h4>
              <p>{errorMessage}</p>
            </div>
            <button
              type="button"
              className="error-retry-btn"
              onClick={() => loadWeather(currentLocation)}
            >
              <RefreshCw size={14} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !weatherData ? (
          <div className="weather-loading-screen">
            <div className="loading-card-glass">
              <Loader2 className="loading-spinner animate-spin" size={42} />
              <h3 className="loading-title">Gathering Meteorological Data</h3>
              <p className="loading-subtitle">
                Querying atmospheric sensors and radar for {currentLocation.name}...
              </p>
            </div>
          </div>
        ) : weatherData ? (
          /* Main Responsive Dashboard Grid */
          <main className="weather-dashboard-layout">
            {/* Left Column: Hero, Hourly 24h Timeline, Metrics Grid */}
            <div className="dashboard-main-column">
              {/* 1. Hero Card */}
              <WeatherHero
                weather={weatherData}
                location={currentLocation}
                tempUnit={tempUnit}
              />

              {/* 2. 24-Hour Timeline */}
              <HourlyTimeline
                hourly={weatherData.hourly}
                tempUnit={tempUnit}
              />

              {/* 3. Additional Metrics Grid (UV, Wind, Humidity, AQI, Sunrise/Sunset, Barometer) */}
              <MetricsGrid
                current={weatherData.current}
                aqi={weatherData.aqi}
                tempUnit={tempUnit}
              />
            </div>

            {/* Right Column: 5-Day Future Outlook & 5-Day Historical Archive */}
            <aside className="dashboard-side-column">
              {/* 4. 5-Day Daily Forecast with Range Bars */}
              <DailyForecast
                forecast={weatherData.forecast}
                currentTemp={weatherData.current.temp}
                forecastRange={weatherData.forecastRange}
                tempUnit={tempUnit}
              />

              {/* 5. Historical Data (Previous 5 Days) */}
              <HistoricalData
                historical={weatherData.historical}
                tempUnit={tempUnit}
              />
            </aside>
          </main>
        ) : null}

        {/* Footer info bar */}
        <footer className="app-footer-bar">
          <div className="footer-content">
            <span className="footer-source">
              Open-Meteo High-Resolution Numerical Forecasts & WMO Meteorological Standards
            </span>
            {lastUpdated && (
              <span className="footer-timestamp">
                Observed: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
