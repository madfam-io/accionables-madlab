import React, { useMemo } from 'react';
import { TimeScale } from '../../stores/appStore';

interface GanttTimeScaleProps {
  startDate: Date;
  endDate: Date;
  totalWidth: number;
  timeScale: TimeScale;
}

export const GanttTimeScale: React.FC<GanttTimeScaleProps> = ({
  startDate,
  endDate,
  totalWidth,
  timeScale
}) => {
  const scaleMarkers = useMemo(() => {
    const markers: Array<{ date: Date; label: string; position: number; major: boolean }> = [];
    const current = new Date(startDate);
    const end = new Date(endDate);
    
    // Calculate total days for positioning
    const totalDays = Math.ceil((end.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const getPosition = (date: Date): number => {
      const dayFromStart = Math.ceil((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      return (dayFromStart / totalDays) * totalWidth;
    };

    switch (timeScale) {
      case 'days':
        // Show every day, major markers every week
        while (current <= end) {
          const isMajor = current.getDay() === 1; // Monday
          markers.push({
            date: new Date(current),
            label: current.toLocaleDateString('en-US', { 
              day: 'numeric',
              ...(isMajor ? { month: 'short' } : {})
            }),
            position: getPosition(current),
            major: isMajor
          });
          current.setDate(current.getDate() + 1);
        }
        break;

      case 'weeks':
        // Show every week
        // Start from the beginning of the week
        current.setDate(current.getDate() - current.getDay() + 1); // Go to Monday
        while (current <= end) {
          const isMajor = current.getDate() <= 7; // First week of month
          markers.push({
            date: new Date(current),
            label: current.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            }),
            position: getPosition(current),
            major: isMajor
          });
          current.setDate(current.getDate() + 7);
        }
        break;

      case 'months':
        // Show every month
        current.setDate(1); // Go to first day of month
        while (current <= end) {
          markers.push({
            date: new Date(current),
            label: current.toLocaleDateString('en-US', { 
              month: 'short',
              year: '2-digit'
            }),
            position: getPosition(current),
            major: true
          });
          current.setMonth(current.getMonth() + 1);
        }
        break;
    }

    return markers;
  }, [startDate, endDate, totalWidth, timeScale]);

  return (
    <div 
      className="relative bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
      style={{ width: totalWidth, height: '60px' }}
    >
      {/* Scale markers */}
      {scaleMarkers.map((marker, index) => (
        <div
          key={index}
          className="absolute flex flex-col items-center"
          style={{ left: marker.position, transform: 'translateX(-50%)' }}
        >
          {/* Tick line */}
          <div 
            className={`w-px ${
              marker.major 
                ? 'h-6 bg-gray-400 dark:bg-gray-500' 
                : 'h-3 bg-gray-300 dark:bg-gray-600'
            }`}
          />
          
          {/* Label */}
          <div 
            className={`mt-1 text-xs ${
              marker.major 
                ? 'font-medium text-gray-700 dark:text-gray-300' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {marker.label}
          </div>
        </div>
      ))}

      {/* Current date indicator if within range */}
      {(() => {
        const today = new Date();
        if (today >= startDate && today <= endDate) {
          const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          const dayFromStart = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          const todayPosition = (dayFromStart / totalDays) * totalWidth;
          
          return (
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
              style={{ left: todayPosition }}
            >
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-xs text-red-600 font-medium whitespace-nowrap">
                Today
              </div>
            </div>
          );
        }
        return null;
      })()}
    </div>
  );
};