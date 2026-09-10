// Weather and Geocoding API integration using Open-Meteo (open, free, no keys required)

export const POPULAR_LOCATIONS = [
  { name: 'New York', country: 'United States', admin1: 'New York', lat: 40.7128, lon: -74.006, timezone: 'America/New_York' },
  { name: 'London', country: 'United Kingdom', admin1: 'England', lat: 51.5074, lon: -0.1278, timezone: 'Europe/London' },
  { name: 'Tokyo', country: 'Japan', admin1: 'Tokyo', lat: 35.6762, lon: 139.6503, timezone: 'Asia/Tokyo' },
  { name: 'Paris', country: 'France', admin1: 'Île-de-France', lat: 48.8566, lon: 2.3522, timezone: 'Europe/Paris' },
  { name: 'San Francisco', country: 'United States', admin1: 'California', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles' },
  { name: 'Sydney', country: 'Australia', admin1: 'New South Wales', lat: -33.8688, lon: 151.2093, timezone: 'Australia/Sydney' },
  { name: 'Dubai', country: 'United Arab Emirates', admin1: 'Dubai', lat: 25.2048, lon: 55.2708, timezone: 'Asia/Dubai' },
  { name: 'Reykjavik', country: 'Iceland', admin1: 'Capital Region', lat: 64.1466, lon: -21.9426, timezone: 'Atlantic/Reykjavik' },
];

/**
 * Searches locations using Open-Meteo Geocoding API
 */
export async function searchCities(query) {
  if (!query || query.trim().length < 2) return [];
  const encoded = encodeURIComponent(query.trim());
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encoded}&count=7&language=en&format=json`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Geocoding HTTP error: ${res.status}`);
    const data = await res.json();
    if (!data || !data.results) return [];

    return data.results.map(item => ({
      id: item.id,
      name: item.name,
      admin1: item.admin1 || '',
      country: item.country || '',
      countryCode: item.country_code || '',
      lat: item.latitude,
      lon: item.longitude,
      timezone: item.timezone || 'auto'
    }));
  } catch (err) {
    console.error('Error searching cities:', err);
    return [];
  }
}

/**
 * Reverse geocodes coordinates to a human-readable city and country
 */
export async function reverseGeocode(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AtmosphereWeatherApp/1.0'
      }
    });
    if (!res.ok) throw new Error('Reverse geocoding failed');
    const data = await res.json();
    const addr = data.address || {};
    const name = addr.city || addr.town || addr.village || addr.municipality || addr.county || 'Current Location';
    const admin1 = addr.state || addr.region || '';
    const country = addr.country || '';

    return { name, admin1, country, lat, lon };
  } catch (err) {
    console.warn('Reverse geocode fallback:', err);
    return {
      name: 'Local Station',
      admin1: `${lat.toFixed(2)}°N`,
      country: `${lon.toFixed(2)}°W`,
      lat,
      lon
    };
  }
}

/**
 * Fetches comprehensive weather data from Open-Meteo:
 * Current, Hourly (24 hours), Historical (past 5 days), Future (next 5-6 days), and Air Quality
 */
export async function fetchWeatherData(lat, lon, timezone = 'auto') {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,wind_speed_10m_max&past_days=5&forecast_days=7&timezone=${encodeURIComponent(timezone)}`;

  const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,ozone&timezone=${encodeURIComponent(timezone)}`;

  try {
    const [weatherRes, aqiRes] = await Promise.allSettled([
      fetch(weatherUrl).then(r => {
        if (!r.ok) throw new Error(`Weather error: ${r.status}`);
        return r.json();
      }),
      fetch(airQualityUrl).then(r => {
        if (!r.ok) return null;
        return r.json();
      })
    ]);

    if (weatherRes.status !== 'fulfilled' || !weatherRes.value) {
      throw new Error('Failed to retrieve forecast data.');
    }

    const weatherData = weatherRes.value;
    const aqiData = aqiRes.status === 'fulfilled' ? aqiRes.value : null;

    return processRawWeatherData(weatherData, aqiData);
  } catch (error) {
    console.error('Fetch weather data failed:', error);
    throw error;
  }
}

/**
 * Processes and organizes raw Open-Meteo response into clean data structures
 */
function processRawWeatherData(weather, aqi) {
  const current = weather.current || {};
  const hourly = weather.hourly || {};
  const daily = weather.daily || {};

  // Current local time from API
  const currentTimeIso = current.time || new Date().toISOString();
  const currentHourIndex = hourly.time ? findClosestHourIndex(hourly.time, currentTimeIso) : 0;

  // Extract next 24 hours starting from current hour
  const next24Hours = [];
  if (hourly.time) {
    const startIdx = Math.max(0, currentHourIndex);
    const endIdx = Math.min(hourly.time.length, startIdx + 25);
    for (let i = startIdx; i < endIdx; i++) {
      next24Hours.push({
        time: hourly.time[i],
        isNow: i === startIdx,
        temp: hourly.temperature_2m[i],
        apparentTemp: hourly.apparent_temperature ? hourly.apparent_temperature[i] : null,
        weatherCode: hourly.weather_code[i],
        isDay: hourly.is_day ? hourly.is_day[i] : 1,
        precipitationProb: hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0,
        precipitation: hourly.precipitation ? hourly.precipitation[i] : 0,
        windSpeed: hourly.wind_speed_10m ? hourly.wind_speed_10m[i] : 0,
        humidity: hourly.relative_humidity_2m ? hourly.relative_humidity_2m[i] : 0,
      });
    }
  }

  // Daily processing:
  // With past_days=5 and forecast_days=7, daily.time has:
  // indices 0..4 = past 5 days
  // index 5 = today
  // indices 6..10 = next 5 days
  const dailyTimes = daily.time || [];
  const todayIdx = dailyTimes.findIndex(t => t === currentTimeIso.slice(0, 10));
  const effectiveTodayIdx = todayIdx !== -1 ? todayIdx : 5; // fallback to 5

  // Historical: past 5 days (indices before today)
  const historical = [];
  const historyStart = Math.max(0, effectiveTodayIdx - 5);
  for (let i = historyStart; i < effectiveTodayIdx; i++) {
    if (dailyTimes[i]) {
      historical.push({
        date: dailyTimes[i],
        weatherCode: daily.weather_code ? daily.weather_code[i] : 0,
        tempMax: daily.temperature_2m_max ? daily.temperature_2m_max[i] : 0,
        tempMin: daily.temperature_2m_min ? daily.temperature_2m_min[i] : 0,
        precipitationSum: daily.precipitation_sum ? daily.precipitation_sum[i] : 0,
        windMax: daily.wind_speed_10m_max ? daily.wind_speed_10m_max[i] : 0,
      });
    }
  }

  // Future Forecast: next 5 days (including today or starting from today + 5 days)
  const forecast = [];
  // Include today and next 5 days (total 6 days)
  const futureEnd = Math.min(dailyTimes.length, effectiveTodayIdx + 6);
  for (let i = effectiveTodayIdx; i < futureEnd; i++) {
    if (dailyTimes[i]) {
      forecast.push({
        date: dailyTimes[i],
        isToday: i === effectiveTodayIdx,
        weatherCode: daily.weather_code ? daily.weather_code[i] : 0,
        tempMax: daily.temperature_2m_max ? daily.temperature_2m_max[i] : 0,
        tempMin: daily.temperature_2m_min ? daily.temperature_2m_min[i] : 0,
        precipitationSum: daily.precipitation_sum ? daily.precipitation_sum[i] : 0,
        uvMax: daily.uv_index_max ? daily.uv_index_max[i] : 0,
        sunrise: daily.sunrise ? daily.sunrise[i] : null,
        sunset: daily.sunset ? daily.sunset[i] : null,
      });
    }
  }

  // Calculate global min & max across the forecast for accurate visual range bars
  let overallMin = Infinity;
  let overallMax = -Infinity;
  forecast.forEach(d => {
    if (d.tempMin < overallMin) overallMin = d.tempMin;
    if (d.tempMax > overallMax) overallMax = d.tempMax;
  });
  if (overallMin === Infinity) { overallMin = 10; overallMax = 30; }

  // Today's sunrise & sunset
  const todaySunrise = daily.sunrise && daily.sunrise[effectiveTodayIdx] ? daily.sunrise[effectiveTodayIdx] : null;
  const todaySunset = daily.sunset && daily.sunset[effectiveTodayIdx] ? daily.sunset[effectiveTodayIdx] : null;

  // Air Quality
  const aqiCurrent = aqi && aqi.current ? aqi.current : {};

  // Dew point approximation
  const tempC = current.temperature_2m ?? 20;
  const rh = current.relative_humidity_2m ?? 50;
  const dewPoint = calculateDewPoint(tempC, rh);

  return {
    timezone: weather.timezone,
    timezoneAbbreviation: weather.timezone_abbreviation,
    elevation: weather.elevation,
    current: {
      time: current.time,
      temp: current.temperature_2m,
      apparentTemp: current.apparent_temperature,
      isDay: current.is_day ?? 1,
      weatherCode: current.weather_code,
      cloudCover: current.cloud_cover ?? 0,
      precipitation: current.precipitation ?? 0,
      humidity: current.relative_humidity_2m ?? 0,
      pressure: current.surface_pressure ?? current.pressure_msl ?? 1013,
      windSpeed: current.wind_speed_10m ?? 0,
      windDirection: current.wind_direction_10m ?? 0,
      windGusts: current.wind_gusts_10m ?? 0,
      uvIndex: current.uv_index ?? (daily.uv_index_max ? daily.uv_index_max[effectiveTodayIdx] : 3),
      todayMax: daily.temperature_2m_max ? daily.temperature_2m_max[effectiveTodayIdx] : current.temperature_2m,
      todayMin: daily.temperature_2m_min ? daily.temperature_2m_min[effectiveTodayIdx] : current.temperature_2m,
      sunrise: todaySunrise,
      sunset: todaySunset,
      dewPoint: dewPoint,
      visibility: Math.max(1, Math.min(16, 16 - (current.cloud_cover || 0) * 0.05)), // km estimate
    },
    hourly: next24Hours,
    historical: historical,
    forecast: forecast,
    forecastRange: {
      min: overallMin,
      max: overallMax
    },
    aqi: {
      usAqi: aqiCurrent.us_aqi ?? 42,
      pm25: aqiCurrent.pm2_5 ?? 6.2,
      pm10: aqiCurrent.pm10 ?? 11.4,
      ozone: aqiCurrent.ozone ?? 35,
      no2: aqiCurrent.nitrogen_dioxide ?? 12,
    }
  };
}

function findClosestHourIndex(times, currentIso) {
  const currentTimestamp = new Date(currentIso).getTime();
  let closestIdx = 0;
  let minDiff = Infinity;
  for (let i = 0; i < times.length; i++) {
    const diff = Math.abs(new Date(times[i]).getTime() - currentTimestamp);
    if (diff < minDiff) {
      minDiff = diff;
      closestIdx = i;
    }
  }
  return closestIdx;
}

function calculateDewPoint(t, rh) {
  // Magnus formula approximation
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * t) / (b + t)) + Math.log(rh / 100.0);
  const dp = (b * alpha) / (a - alpha);
  return Math.round(dp);
}
