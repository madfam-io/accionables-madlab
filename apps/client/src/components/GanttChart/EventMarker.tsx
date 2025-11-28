import React from 'react';
import { Clock } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { differenceInDays, differenceInHours, format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

export interface CulminatingEvent {
  id: string;
  name: string;
  nameEn: string;
  date: Date;
  description?: string;
  descriptionEn?: string;
  type: 'concert' | 'launch' | 'exam' | 'presentation' | 'retreat' | 'deadline' | 'custom';
}

interface EventMarkerProps {
  event: CulminatingEvent;
  x: number;
  totalHeight: number;
}

export const EventMarker: React.FC<EventMarkerProps> = ({ event, x, totalHeight }) => {
  const { language, ndProfile } = useAppStore();
  const now = new Date();

  const daysRemaining = differenceInDays(event.date, now);
  const hoursRemaining = differenceInHours(event.date, now);

  const isPast = daysRemaining < 0;
  const isToday = daysRemaining === 0;
  const isUrgent = daysRemaining > 0 && daysRemaining <= 3;
  const isSoon = daysRemaining > 3 && daysRemaining <= 7;

  // Time blindness aid - show more prominent countdown for ADHD profile
  const showTimeBlindnessAid = ndProfile.time.timeBlindnessAids;

  const getEventIcon = () => {
    switch (event.type) {
      case 'concert': return '🎵';
      case 'launch': return '🚀';
      case 'exam': return '📝';
      case 'presentation': return '🎤';
      case 'retreat': return '🏕️';
      case 'deadline': return '⏰';
      default: return '⭐';
    }
  };

  const getTimeRemainingText = () => {
    if (isPast) {
      return language === 'es' ? 'Completado' : 'Completed';
    }
    if (isToday) {
      if (hoursRemaining <= 0) return language === 'es' ? '¡Ahora!' : 'Now!';
      return language === 'es'
        ? `En ${hoursRemaining} horas`
        : `In ${hoursRemaining} hours`;
    }
    if (daysRemaining === 1) {
      return language === 'es' ? 'Mañana' : 'Tomorrow';
    }
    return language === 'es'
      ? `En ${daysRemaining} días`
      : `In ${daysRemaining} days`;
  };

  const getUrgencyColor = () => {
    if (isPast) return 'bg-emerald-500';
    if (isToday) return 'bg-red-500 animate-pulse';
    if (isUrgent) return 'bg-orange-500';
    if (isSoon) return 'bg-amber-500';
    return 'bg-indigo-500';
  };

  const getGlowColor = () => {
    if (isPast) return 'shadow-emerald-500/50';
    if (isToday) return 'shadow-red-500/50';
    if (isUrgent) return 'shadow-orange-500/50';
    if (isSoon) return 'shadow-amber-500/50';
    return 'shadow-indigo-500/50';
  };

  return (
    <div
      className="absolute top-0 z-30 flex flex-col items-center"
      style={{ left: x - 50, width: 100 }}
    >
      {/* Vertical Convergence Line */}
      <div
        className={`absolute w-1 ${getUrgencyColor()} opacity-80`}
        style={{
          top: 80,
          height: totalHeight - 80,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {/* Flowing particles effect (visual convergence) */}
        <div className="absolute inset-0 overflow-hidden">
          {!isPast && ndProfile.visual.motion !== 'none' && (
            <>
              <div className="absolute w-2 h-2 bg-white rounded-full animate-flow-down opacity-60" style={{ animationDelay: '0s' }} />
              <div className="absolute w-2 h-2 bg-white rounded-full animate-flow-down opacity-60" style={{ animationDelay: '0.5s' }} />
              <div className="absolute w-2 h-2 bg-white rounded-full animate-flow-down opacity-60" style={{ animationDelay: '1s' }} />
            </>
          )}
        </div>
      </div>

      {/* Event Badge - The focal point */}
      <div
        className={`relative flex flex-col items-center p-4 rounded-2xl ${getUrgencyColor()} text-white shadow-2xl ${getGlowColor()} transition-all duration-300 hover:scale-105`}
        style={{
          minWidth: 120,
          marginTop: 10,
        }}
      >
        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-2xl ${getUrgencyColor()} blur-xl opacity-30`} />

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Icon */}
          <div className="text-3xl mb-1">{getEventIcon()}</div>

          {/* Event Name */}
          <div className="font-bold text-sm leading-tight">
            {language === 'es' ? event.name : event.nameEn}
          </div>

          {/* Date */}
          <div className="text-xs opacity-90 mt-1">
            {format(event.date, 'MMM d, yyyy', {
              locale: language === 'es' ? es : enUS
            })}
          </div>

          {/* Time Remaining */}
          <div className={`mt-2 px-2 py-1 rounded-full text-xs font-medium ${
            isPast ? 'bg-white/20' : 'bg-black/20'
          }`}>
            {getTimeRemainingText()}
          </div>
        </div>
      </div>

      {/* Time Blindness Aid - Large countdown */}
      {showTimeBlindnessAid && !isPast && (
        <div className={`mt-4 px-4 py-2 rounded-xl ${
          isToday || isUrgent
            ? 'bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700'
            : 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
        }`}>
          <div className="flex items-center gap-2">
            <Clock size={16} className={isToday || isUrgent ? 'text-red-500' : 'text-gray-500'} />
            <span className={`text-2xl font-bold ${
              isToday || isUrgent ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
            }`}>
              {isToday ? hoursRemaining : daysRemaining}
            </span>
            <span className={`text-sm ${
              isToday || isUrgent ? 'text-red-500' : 'text-gray-500'
            }`}>
              {isToday
                ? (language === 'es' ? 'horas' : 'hours')
                : (language === 'es' ? 'días' : 'days')
              }
            </span>
          </div>
        </div>
      )}

      {/* Convergence indicator text */}
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
        {language === 'es' ? '← Todo converge aquí' : '← Everything converges here'}
      </div>
    </div>
  );
};

// CSS animation for flowing particles (add to index.css)
// @keyframes flow-down {
//   0% { transform: translateY(-10px); opacity: 0; }
//   50% { opacity: 1; }
//   100% { transform: translateY(100vh); opacity: 0; }
// }
// .animate-flow-down { animation: flow-down 2s linear infinite; }
