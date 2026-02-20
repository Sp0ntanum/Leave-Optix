import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';

interface AnimatedStatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'teal';
  trend?: number;
  suffix?: string;
  delay?: number;
}

const AnimatedStatCard: React.FC<AnimatedStatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue',
  trend = 0,
  suffix = '',
  delay = 0 
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;
    
    const duration = 1000;
    const steps = 50;
    const stepValue = value / steps;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setDisplayValue(Math.floor(stepValue * currentStep));
      } else {
        setDisplayValue(value);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value, isVisible]);

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    teal: 'from-teal-500 to-teal-600',
  };

  const iconBgClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    teal: 'bg-teal-100 text-teal-600',
  };

  const getTrendIcon = () => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-white shadow-lg hover-lift ${
        isVisible ? 'animate-scale-in' : 'opacity-0'
      }`}
    >
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${colorClasses[color]}`}></div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg ${iconBgClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          {trend !== 0 && (
            <div className="flex items-center space-x-1">
              {getTrendIcon()}
              <span className={`text-sm font-medium ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
        
        <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
        <p className="text-3xl font-bold text-gray-800">
          {displayValue}{suffix}
        </p>
      </div>
    </div>
  );
};

export default AnimatedStatCard;
