import { useState, useEffect, useMemo } from 'react';
import { Play, Pause, Square, Coffee, Target, AlertTriangle } from 'lucide-react';
import { useAgentStore } from '../../stores/agentStore';
import { useAppStore } from '../../stores/appStore';
import { AGENT_PERSONALITIES } from '../../types/agents';

interface FocusTimerProps {
  taskId?: string;
  taskName?: string;
  onComplete?: () => void;
}

export function FocusTimer({ taskId, taskName, onComplete }: FocusTimerProps) {
  const { language } = useAppStore();
  const {
    currentFocusSession,
    focusConfig,
    startFocusSession,
    endFocusSession,
    pauseFocusSession,
    resumeFocusSession,
    recordDistraction,
  } = useAgentStore();

  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  const focusPersonality = AGENT_PERSONALITIES.focus;

  // Calculate initial time when session starts
  useEffect(() => {
    if (currentFocusSession && !currentFocusSession.actualEndedAt) {
      const elapsed = Math.floor(
        (Date.now() - new Date(currentFocusSession.startedAt).getTime()) / 1000
      );
      const totalSeconds = currentFocusSession.plannedDurationMinutes * 60;
      setTimeRemaining(Math.max(0, totalSeconds - elapsed));
    }
  }, [currentFocusSession]);

  // Timer countdown
  useEffect(() => {
    if (!currentFocusSession || isPaused || currentFocusSession.actualEndedAt) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Session complete
          if (!isBreak) {
            endFocusSession(100);
            onComplete?.();
            // Auto-start break if configured
            if (focusConfig.autoStartBreaks) {
              setIsBreak(true);
              return focusConfig.breakDurationMinutes * 60;
            }
          } else {
            setIsBreak(false);
            // Auto-start next session if configured
            if (focusConfig.autoStartNextSession) {
              startFocusSession(taskId, focusConfig.workDurationMinutes);
              return focusConfig.workDurationMinutes * 60;
            }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [
    currentFocusSession,
    isPaused,
    isBreak,
    focusConfig,
    endFocusSession,
    onComplete,
    startFocusSession,
    taskId,
  ]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = useMemo(() => {
    if (!currentFocusSession) return 0;
    const totalSeconds = currentFocusSession.plannedDurationMinutes * 60;
    return ((totalSeconds - timeRemaining) / totalSeconds) * 100;
  }, [currentFocusSession, timeRemaining]);

  const handleStart = () => {
    startFocusSession(taskId, focusConfig.workDurationMinutes);
    setTimeRemaining(focusConfig.workDurationMinutes * 60);
    setIsPaused(false);
    setIsBreak(false);
  };

  const handlePause = () => {
    setIsPaused(true);
    pauseFocusSession();
  };

  const handleResume = () => {
    setIsPaused(false);
    resumeFocusSession();
  };

  const handleStop = () => {
    const completionPercentage = Math.round(progress);
    endFocusSession(completionPercentage);
    setTimeRemaining(0);
    setIsPaused(false);
    setIsBreak(false);
  };

  const handleDistraction = () => {
    recordDistraction();
  };

  const isActive = currentFocusSession && !currentFocusSession.actualEndedAt;

  return (
    <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-pink-200 dark:border-pink-800">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{focusPersonality.avatar}</span>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">
            {language === 'es' ? focusPersonality.name : focusPersonality.nameEn}
          </h3>
          {taskName && (
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Target size={12} />
              {taskName}
            </p>
          )}
        </div>
      </div>

      {/* Timer Display */}
      <div className="text-center my-6">
        <div className="relative inline-flex items-center justify-center">
          {/* Progress Ring */}
          <svg className="w-40 h-40 transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke={isBreak ? '#06b6d4' : '#ec4899'}
              strokeWidth="8"
              strokeDasharray={440}
              strokeDashoffset={440 - (440 * progress) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          {/* Time */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={`text-4xl font-mono font-bold ${
                isBreak
                  ? 'text-cyan-600 dark:text-cyan-400'
                  : 'text-pink-600 dark:text-pink-400'
              }`}
            >
              {formatTime(timeRemaining)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isBreak
                ? language === 'es'
                  ? 'Descanso'
                  : 'Break'
                : language === 'es'
                  ? 'Enfoque'
                  : 'Focus'}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        {!isActive ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-medium transition-colors"
          >
            <Play size={20} />
            {language === 'es' ? 'Comenzar' : 'Start'}
          </button>
        ) : (
          <>
            {isPaused ? (
              <button
                onClick={handleResume}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors"
              >
                <Play size={18} />
                {language === 'es' ? 'Continuar' : 'Resume'}
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-colors"
              >
                <Pause size={18} />
                {language === 'es' ? 'Pausar' : 'Pause'}
              </button>
            )}
            <button
              onClick={handleStop}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
            >
              <Square size={18} />
              {language === 'es' ? 'Terminar' : 'Stop'}
            </button>
          </>
        )}
      </div>

      {/* Distraction Counter */}
      {isActive && !isBreak && (
        <div className="mt-4 pt-4 border-t border-pink-200 dark:border-pink-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'es' ? 'Distracciones' : 'Distractions'}:{' '}
              <span className="font-bold text-pink-600 dark:text-pink-400">
                {currentFocusSession?.distractionCount || 0}
              </span>
            </span>
            <button
              onClick={handleDistraction}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <AlertTriangle size={14} />
              {language === 'es' ? 'Me distraje' : 'Got distracted'}
            </button>
          </div>
        </div>
      )}

      {/* Break Reminder */}
      {isBreak && (
        <div className="mt-4 flex items-center justify-center gap-2 text-cyan-600 dark:text-cyan-400">
          <Coffee size={18} />
          <span className="text-sm">
            {language === 'es'
              ? 'Toma un descanso, te lo mereces'
              : 'Take a break, you deserve it'}
          </span>
        </div>
      )}
    </div>
  );
}
