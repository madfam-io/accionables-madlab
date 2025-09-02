import React, { useState } from 'react';
import { Task } from '../data/projectData';
import { useAppStore } from '../stores/appStore';
import { translations } from '../data/translations';
import { ProgressBar } from './ProgressBar';
import { useTooltip } from '../hooks/useTooltip';
import { Clock, User, AlertCircle, ChevronDown, ChevronUp, Info } from 'lucide-react';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { language, viewMode } = useAppStore();
  const [showDetails, setShowDetails] = useState(false);
  const { tooltip, bindTooltip } = useTooltip({ delay: 300 });
  const t = translations[language];
  
  // Calculate progress based on dependencies (simulated)
  const getTaskProgress = () => {
    if (task.dependencies.length === 0) return 75; // Independent tasks show 75%
    return Math.min(50 + (task.difficulty * 10), 90); // Dependent tasks show less progress
  };
  
  const progress = getTaskProgress();

  const getDifficultyColor = (difficulty: number) => {
    const colors = [
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    ];
    return colors[difficulty - 1] || colors[0];
  };

  const cardClass = viewMode === 'grid' 
    ? 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300 animate-fadeIn'
    : 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-300 animate-fadeIn mb-3';

  return (
    <>
      <div ref={bindTooltip} className={cardClass}>
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                {task.id}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(task.difficulty)}`}>
                {t.level} {task.difficulty}
              </span>
              <Info className="w-3 h-3 text-gray-400" />
            </div>
            <h3 className="text-sm lg:text-base font-semibold text-gray-900 dark:text-white">
              {language === 'es' ? task.name : task.nameEn}
            </h3>
          </div>
        </div>

      {/* Quick Info */}
      <div className="flex flex-wrap gap-3 text-xs lg:text-sm text-gray-600 dark:text-gray-300 mb-3">
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span>{task.assignee}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{task.hours}h</span>
        </div>
        {task.dependencies.length > 0 && (
          <div className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>{task.dependencies.length} {t.dependencies.toLowerCase()}</span>
          </div>
        )}
      </div>

      {/* Section Info */}
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
        {language === 'es' ? task.section : task.sectionEn}
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <ProgressBar 
          value={progress} 
          showLabel 
          size="sm"
          className="mb-1"
        />
      </div>

      {/* Details Toggle */}
      {task.dependencies.length > 0 && (
        <>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            {showDetails ? (
              <>
                <ChevronUp className="w-3 h-3" />
                {t.hideDependencies}
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" />
                {t.showDependencies}
              </>
            )}
          </button>

          {/* Dependencies List */}
          {showDetails && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.blockingTasks}:
              </p>
              <div className="flex flex-wrap gap-1">
                {task.dependencies.map(dep => (
                  <span
                    key={dep}
                    className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                  >
                    {dep}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      </div>

      {/* Tooltip */}
      {tooltip.isVisible && (
        <div 
          className="fixed z-50 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-lg pointer-events-none max-w-xs"
          style={{ 
            left: tooltip.position.x,
            top: tooltip.position.y,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="space-y-1">
            <div className="font-medium">{task.id} - {language === 'es' ? task.name : task.nameEn}</div>
            <div className="text-xs opacity-90">
              {language === 'es' ? task.section : task.sectionEn}
            </div>
            <div className="text-xs opacity-75">
              {task.assignee} • {task.hours}h • {t.level} {task.difficulty}
            </div>
            {task.dependencies.length > 0 && (
              <div className="text-xs opacity-75">
                {t.dependencies}: {task.dependencies.join(', ')}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};