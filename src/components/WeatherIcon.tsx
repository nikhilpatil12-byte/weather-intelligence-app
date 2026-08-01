import React from 'react';
import * as Icons from 'lucide-react';

interface WeatherIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  name,
  className = 'w-6 h-6 text-current',
  size,
}) => {
  // Try matching exact icon name from Lucide
  const IconComponent = (Icons as Record<string, React.FC<{ className?: string; size?: number }>>)[name]
    || Icons.Sun;

  return <IconComponent className={className} size={size} />;
};
