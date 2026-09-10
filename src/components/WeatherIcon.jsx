import React from 'react';
import {
  Sun,
  SunDim,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudSunRain,
  CloudMoonRain,
  CloudRainWind,
  CloudDrizzle,
  CloudSnow,
  Snowflake,
  CloudFog,
  CloudHail,
  CloudLightning,
  Zap,
  HelpCircle
} from 'lucide-react';

const ICON_MAP = {
  Sun,
  SunDim,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudSunRain,
  CloudMoonRain,
  CloudRainWind,
  CloudDrizzle,
  CloudSnow,
  Snowflake,
  CloudFog,
  CloudHail,
  CloudLightning,
  Zap
};

export default function WeatherIcon({ iconName, size = 24, className = '', strokeWidth = 2 }) {
  const IconComponent = ICON_MAP[iconName] || HelpCircle;
  return (
    <IconComponent
      size={size}
      strokeWidth={strokeWidth}
      className={`weather-icon ${className}`}
    />
  );
}
