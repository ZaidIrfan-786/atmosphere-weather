// WMO Weather Interpretation Codes (WW) mapping
// Defined by World Meteorological Organization and used by Open-Meteo

export const WEATHER_CONDITIONS = {
  0: {
    label: 'Clear Sky',
    description: 'Completely cloudless, clear skies',
    icon: 'Sun',
    theme: 'clear-day',
    nightIcon: 'Moon',
    nightTheme: 'clear-night'
  },
  1: {
    label: 'Mainly Clear',
    description: 'Scattered occasional clouds with mostly bright conditions',
    icon: 'SunDim',
    theme: 'clear-day',
    nightIcon: 'CloudMoon',
    nightTheme: 'clear-night'
  },
  2: {
    label: 'Partly Cloudy',
    description: 'Passing sun breaks through scattered cloud cover',
    icon: 'CloudSun',
    theme: 'cloudy',
    nightIcon: 'CloudMoon',
    nightTheme: 'cloudy-night'
  },
  3: {
    label: 'Overcast',
    description: 'Uniform dense blanket of grey cloud cover',
    icon: 'Cloud',
    theme: 'overcast',
    nightIcon: 'Cloud',
    nightTheme: 'overcast'
  },
  45: {
    label: 'Foggy',
    description: 'Reduced surface visibility due to ground-level condensation',
    icon: 'CloudFog',
    theme: 'fog',
    nightIcon: 'CloudFog',
    nightTheme: 'fog'
  },
  48: {
    label: 'Depositing Rime Fog',
    description: 'Sub-zero freezing fog forming delicate icy rime deposits',
    icon: 'CloudFog',
    theme: 'fog',
    nightIcon: 'CloudFog',
    nightTheme: 'fog'
  },
  51: {
    label: 'Light Drizzle',
    description: 'Very fine, misty light rain drops falling continuously',
    icon: 'CloudDrizzle',
    theme: 'rain',
    nightIcon: 'CloudDrizzle',
    nightTheme: 'rain'
  },
  53: {
    label: 'Moderate Drizzle',
    description: 'Steady fine mist precipitation dampening surfaces',
    icon: 'CloudDrizzle',
    theme: 'rain',
    nightIcon: 'CloudDrizzle',
    nightTheme: 'rain'
  },
  55: {
    label: 'Dense Drizzle',
    description: 'Heavy atmospheric drizzle with noticeable accumulation',
    icon: 'CloudDrizzle',
    theme: 'rain',
    nightIcon: 'CloudDrizzle',
    nightTheme: 'rain'
  },
  56: {
    label: 'Light Freezing Drizzle',
    description: 'Cold drizzle droplets freezing instantly upon ground contact',
    icon: 'CloudHail',
    theme: 'snow',
    nightIcon: 'CloudHail',
    nightTheme: 'snow'
  },
  57: {
    label: 'Dense Freezing Drizzle',
    description: 'Hazardous sub-freezing dense mist creating icy glazing',
    icon: 'CloudHail',
    theme: 'snow',
    nightIcon: 'CloudHail',
    nightTheme: 'snow'
  },
  61: {
    label: 'Slight Rain',
    description: 'Intermittent gentle rainfall showers',
    icon: 'CloudRain',
    theme: 'rain',
    nightIcon: 'CloudRain',
    nightTheme: 'rain'
  },
  63: {
    label: 'Moderate Rain',
    description: 'Sustained steady precipitation across the area',
    icon: 'CloudRain',
    theme: 'rain',
    nightIcon: 'CloudRain',
    nightTheme: 'rain'
  },
  65: {
    label: 'Heavy Rain',
    description: 'Intense rain downpours with significant surface runoff',
    icon: 'CloudRainWind',
    theme: 'rain',
    nightIcon: 'CloudRainWind',
    nightTheme: 'rain'
  },
  66: {
    label: 'Light Freezing Rain',
    description: 'Cold rain freezing into a slick glaze of black ice',
    icon: 'CloudHail',
    theme: 'snow',
    nightIcon: 'CloudHail',
    nightTheme: 'snow'
  },
  67: {
    label: 'Heavy Freezing Rain',
    description: 'Severe freezing rain causing hazardous winter icing',
    icon: 'CloudHail',
    theme: 'snow',
    nightIcon: 'CloudHail',
    nightTheme: 'snow'
  },
  71: {
    label: 'Slight Snowfall',
    description: 'Light crystalline snowflakes fluttering intermittently',
    icon: 'CloudSnow',
    theme: 'snow',
    nightIcon: 'CloudSnow',
    nightTheme: 'snow'
  },
  73: {
    label: 'Moderate Snowfall',
    description: 'Steady snow accumulation whitening ground surfaces',
    icon: 'Snowflake',
    theme: 'snow',
    nightIcon: 'Snowflake',
    nightTheme: 'snow'
  },
  75: {
    label: 'Heavy Snowfall',
    description: 'Dense blinding snowfall producing deep accumulation',
    icon: 'Snowflake',
    theme: 'snow',
    nightIcon: 'Snowflake',
    nightTheme: 'snow'
  },
  77: {
    label: 'Snow Grains',
    description: 'Small opaque white pellet grains falling softly',
    icon: 'Snowflake',
    theme: 'snow',
    nightIcon: 'Snowflake',
    nightTheme: 'snow'
  },
  80: {
    label: 'Slight Rain Showers',
    description: 'Passing brief rain showers with sunny intervals',
    icon: 'CloudSunRain',
    theme: 'rain',
    nightIcon: 'CloudMoonRain',
    nightTheme: 'rain'
  },
  81: {
    label: 'Moderate Rain Showers',
    description: 'Brisk convective rain showers passing overhead',
    icon: 'CloudRain',
    theme: 'rain',
    nightIcon: 'CloudRain',
    nightTheme: 'rain'
  },
  82: {
    label: 'Violent Rain Showers',
    description: 'Torrential convective rainfall bursts with sudden gusts',
    icon: 'CloudRainWind',
    theme: 'thunderstorm',
    nightIcon: 'CloudRainWind',
    nightTheme: 'thunderstorm'
  },
  85: {
    label: 'Slight Snow Showers',
    description: 'Passing light snow flurries drifting across the region',
    icon: 'CloudSnow',
    theme: 'snow',
    nightIcon: 'CloudSnow',
    nightTheme: 'snow'
  },
  86: {
    label: 'Heavy Snow Showers',
    description: 'Blustery snow showers with rapid accumulation and reduced visibility',
    icon: 'Snowflake',
    theme: 'snow',
    nightIcon: 'Snowflake',
    nightTheme: 'snow'
  },
  95: {
    label: 'Thunderstorm',
    description: 'Electric storm with frequent thunder, lightning flashes, and rain',
    icon: 'CloudLightning',
    theme: 'thunderstorm',
    nightIcon: 'CloudLightning',
    nightTheme: 'thunderstorm'
  },
  96: {
    label: 'Thunderstorm with Slight Hail',
    description: 'Thunderstorm accompanied by small hail pellets',
    icon: 'CloudLightning',
    theme: 'thunderstorm',
    nightIcon: 'CloudLightning',
    nightTheme: 'thunderstorm'
  },
  99: {
    label: 'Severe Thunderstorm with Hail',
    description: 'Severe squall with intense lightning and destructive hail',
    icon: 'Zap',
    theme: 'thunderstorm',
    nightIcon: 'Zap',
    nightTheme: 'thunderstorm'
  }
};

export function getWeatherCondition(code, isDay = 1) {
  const fallback = {
    label: 'Scattered Clouds',
    description: 'Variable cloud cover and mild conditions',
    icon: isDay ? 'Sun' : 'Moon',
    theme: isDay ? 'clear-day' : 'clear-night'
  };

  const item = WEATHER_CONDITIONS[code];
  if (!item) return fallback;

  return {
    code,
    label: item.label,
    description: item.description,
    icon: isDay ? item.icon : (item.nightIcon || item.icon),
    theme: isDay ? item.theme : (item.nightTheme || item.theme)
  };
}

export function formatTemp(celsius, unit = 'C') {
  if (celsius === undefined || celsius === null || isNaN(celsius)) return '--';
  if (unit === 'F') {
    const f = Math.round((celsius * 9) / 5 + 32);
    return `${f}°`;
  }
  return `${Math.round(celsius)}°`;
}

export function formatTempValue(celsius, unit = 'C') {
  if (celsius === undefined || celsius === null || isNaN(celsius)) return 0;
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function getUVCategory(uv) {
  if (uv === undefined || uv === null) return { text: 'Low', color: '#10b981', advice: 'No protection needed' };
  if (uv < 3) return { text: 'Low', color: '#10b981', advice: 'Minimal sun hazard' };
  if (uv < 6) return { text: 'Moderate', color: '#f59e0b', advice: 'Seek shade during midday hours' };
  if (uv < 8) return { text: 'Very High', color: '#f97316', advice: 'Cover up, wear sunglasses & SPF 30+' };
  if (uv < 11) return { text: 'Very High', color: '#ef4444', advice: 'Extra protection required; stay in shade' };
  return { text: 'Extreme', color: '#a855f7', advice: 'Avoid sun exposure during peak hours' };
}

export function getAQICategory(aqi) {
  if (aqi === undefined || aqi === null) return { status: 'Good', color: '#10b981', desc: 'Air quality is satisfactory' };
  if (aqi <= 50) return { status: 'Good', color: '#10b981', desc: 'Clean, healthy air for outdoor activities' };
  if (aqi <= 100) return { status: 'Moderate', color: '#eab308', desc: 'Acceptable; sensitive groups should limit exertion' };
  if (aqi <= 150) return { status: 'Unhealthy for Sensitive', color: '#f97316', desc: 'Sensitive groups may experience symptoms' };
  if (aqi <= 200) return { status: 'Unhealthy', color: '#ef4444', desc: 'Everyone may begin to experience health effects' };
  if (aqi <= 300) return { status: 'Very Unhealthy', color: '#a855f7', desc: 'Health alert: serious risk for all populations' };
  return { status: 'Hazardous', color: '#7e22ce', desc: 'Emergency health warning conditions' };
}

export function getWindDirection(deg) {
  if (deg === undefined || deg === null) return 'N';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}
