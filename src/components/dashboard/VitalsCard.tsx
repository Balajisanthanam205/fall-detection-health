import { useState, useEffect } from 'react';
import { VitalData } from '../../context/DataContext';
import { Heart, Droplet, Thermometer, Zap, AlertTriangle } from 'lucide-react';

interface VitalsCardProps {
  title: string;
  value: number | boolean;
  unit?: string;
  icon: 'heart' | 'oxygen' | 'glucose' | 'temperature' | 'fall';
  isAlert?: boolean;
  lastUpdated: Date;
  thresholds?: {
    low?: number;
    high?: number;
  };
}

const VitalsCard: React.FC<VitalsCardProps> = ({
  title,
  value,
  unit,
  icon,
  isAlert = false,
  lastUpdated,
  thresholds,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [value]);

  const getStatusColor = () => {
    if (typeof value === 'boolean') {
      return value ? 'bg-accent-100 border-accent-500 text-accent-700 dark:bg-accent-900/50 dark:border-accent-500 dark:text-accent-300' : 
                     'bg-secondary-100 border-secondary-500 text-secondary-700 dark:bg-secondary-900/50 dark:border-secondary-500 dark:text-secondary-300';
    }
    
    if (thresholds) {
      if ((thresholds.low && value < thresholds.low) || (thresholds.high && value > thresholds.high)) {
        return 'bg-accent-100 border-accent-500 text-accent-700 dark:bg-accent-900/50 dark:border-accent-500 dark:text-accent-300';
      }
    }
    
    return 'bg-primary-100 border-primary-500 text-primary-700 dark:bg-primary-900/50 dark:border-primary-500 dark:text-primary-300';
  };

  const getIcon = () => {
    switch (icon) {
      case 'heart':
        return <Heart className={`h-6 w-6 ${isAlert ? 'text-accent-500' : 'text-primary-500'}`} />;
      case 'oxygen':
        return <Droplet className={`h-6 w-6 ${isAlert ? 'text-accent-500' : 'text-primary-500'}`} />;
      case 'glucose':
        return <Zap className={`h-6 w-6 ${isAlert ? 'text-accent-500' : 'text-primary-500'}`} />;
      case 'temperature':
        return <Thermometer className={`h-6 w-6 ${isAlert ? 'text-accent-500' : 'text-primary-500'}`} />;
      case 'fall':
        return <AlertTriangle className={`h-6 w-6 ${typeof value === 'boolean' && value ? 'text-accent-500 animate-pulse' : 'text-secondary-500'}`} />;
      default:
        return null;
    }
  };

  return (
    <div className={`rounded-lg border-2 overflow-hidden transition duration-300 ${getStatusColor()} ${isAnimating ? 'scale-105' : 'scale-100'}`}>
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-5 w-0 flex-1">
            <h3 className="text-sm font-medium truncate">
              {title}
            </h3>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold">
                {typeof value === 'boolean' ? (value ? 'Detected' : 'Normal') : value}
              </p>
              {unit && <p className="ml-1 text-sm">{unit}</p>}
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          {isAlert && typeof value !== 'boolean' && (
            <div className="ml-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-300">
                Alert
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VitalsCard;