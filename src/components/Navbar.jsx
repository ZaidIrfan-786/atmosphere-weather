import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  Compass,
  X,
  Loader2,
  RefreshCw,
  CloudSun
} from 'lucide-react';
import { searchCities, POPULAR_LOCATIONS } from '../utils/api.js';

export default function Navbar({
  currentLocation,
  onSelectLocation,
  onDetectLocation,
  isDetecting,
  tempUnit,
  onToggleUnit,
  onRefresh,
  isRefreshing
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const hits = await searchCities(query);
        setResults(hits);
        setIsDropdownOpen(true);
      } catch (e) {
        console.error('Search failed:', e);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCity = (city) => {
    onSelectLocation(city);
    setQuery('');
    setIsDropdownOpen(false);
    setResults([]);
  };

  return (
    <header className="navbar-container" id="main-header">
      <div className="navbar-brand">
        <div className="brand-badge">
          <CloudSun className="brand-icon" size={26} strokeWidth={1.8} />
          <div className="brand-text-wrap">
            <span className="brand-title">ATMOSPHERE</span>
            <span className="brand-subtitle">PRECISION WEATHER</span>
          </div>
        </div>
      </div>

      {/* Center: Search with Dropdown and Popular Chips */}
      <div className="navbar-search-wrapper" ref={searchContainerRef}>
        <div className="search-bar-glass">
          <Search className="search-icon" size={18} />
          <input
            id="city-search-input"
            type="text"
            className="search-input"
            placeholder="Search any city, capital, or region..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!isDropdownOpen) setIsDropdownOpen(true);
            }}
            onFocus={() => {
              if (query.trim().length >= 2 || results.length > 0) {
                setIsDropdownOpen(true);
              }
            }}
          />
          {isSearching && <Loader2 className="search-spinner animate-spin" size={16} />}
          {query && !isSearching && (
            <button
              id="clear-search-btn"
              type="button"
              className="search-clear-btn"
              onClick={() => {
                setQuery('');
                setResults([]);
                setIsDropdownOpen(false);
              }}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isDropdownOpen && (
          <div className="search-dropdown-menu" id="search-dropdown">
            {results.length > 0 ? (
              <div className="search-results-list">
                <div className="dropdown-section-title">SEARCH RESULTS</div>
                {results.map((loc) => (
                  <button
                    key={`${loc.id}-${loc.lat}-${loc.lon}`}
                    type="button"
                    className="dropdown-result-item"
                    onClick={() => handleSelectCity(loc)}
                  >
                    <div className="result-main">
                      <span className="result-name">{loc.name}</span>
                      <span className="result-location">
                        {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                      </span>
                    </div>
                    <span className="result-coords">
                      {loc.lat.toFixed(2)}°, {loc.lon.toFixed(2)}°
                    </span>
                  </button>
                ))}
              </div>
            ) : query.trim().length >= 2 && !isSearching ? (
              <div className="dropdown-empty-state">
                No matching locations found. Try checking the spelling.
              </div>
            ) : null}

            {/* Quick Popular Picks inside dropdown */}
            <div className="dropdown-popular-section">
              <div className="dropdown-section-title">EXPLORE METROPOLITAN CITIES</div>
              <div className="popular-chips-grid">
                {POPULAR_LOCATIONS.map((city) => (
                  <button
                    key={city.name}
                    type="button"
                    className={`popular-chip ${currentLocation?.name === city.name ? 'active' : ''}`}
                    onClick={() => handleSelectCity(city)}
                  >
                    <MapPin size={12} />
                    <span>{city.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Controls: Geolocation, Unit Switcher, Refresh */}
      <div className="navbar-actions">
        <button
          id="geolocation-btn"
          type="button"
          className={`action-btn-glass ${isDetecting ? 'loading' : ''}`}
          onClick={onDetectLocation}
          title="Detect Current Location"
        >
          {isDetecting ? (
            <Loader2 className="animate-spin" size={17} />
          ) : (
            <MapPin size={17} />
          )}
          <span className="btn-label-desktop">My Location</span>
        </button>

        {/* Segmented Unit Toggle */}
        <div className="unit-toggle-control" id="unit-toggle" role="group" aria-label="Temperature unit">
          <button
            type="button"
            className={`unit-toggle-btn ${tempUnit === 'C' ? 'active' : ''}`}
            onClick={() => onToggleUnit('C')}
          >
            °C
          </button>
          <button
            type="button"
            className={`unit-toggle-btn ${tempUnit === 'F' ? 'active' : ''}`}
            onClick={() => onToggleUnit('F')}
          >
            °F
          </button>
        </div>

        {/* Refresh Button */}
        <button
          id="refresh-weather-btn"
          type="button"
          className={`action-btn-glass icon-only ${isRefreshing ? 'refreshing' : ''}`}
          onClick={onRefresh}
          title="Refresh forecast data"
        >
          <RefreshCw size={17} className={isRefreshing ? 'animate-spin' : ''} />
        </button>
      </div>
    </header>
  );
}
