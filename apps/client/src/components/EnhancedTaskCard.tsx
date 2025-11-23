import React, { useState } from 'react';
import { Task } from '../data/types';
import { useAppStore } from '../stores/appStore';
import { translations } from '../data/translations';
import { Clock, User, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface EnhancedTaskCardProps {
  task: Task;
}

export const EnhancedTaskCard: React.FC<EnhancedTaskCardProps> = ({ task }) => {
  const { language, viewMode } = useAppStore();
  const [showDetails, setShowDetails] = useState(false);
  const t = translations[language];

  // Simplified version - no progress tracking for now
  const smartProgress = 0;
  const isOverdue = false;
  const isActuallyCompleted = false;
  
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

  const getStatusClasses = () => {
    // Simplified - just return default styling
    return {
      card: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
      stripe: 'bg-blue-500',
      badge: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      indicator: 'text-blue-600 dark:text-blue-400'
    };
  };

  const statusStyle = getStatusClasses();

  const baseCardClass = `rounded-lg shadow-sm border p-4 hover:shadow-lg transform transition-all duration-300 animate-fadeIn relative overflow-hidden ${statusStyle.card}`;
  
  const cardClass = viewMode === 'grid' 
    ? `${baseCardClass} hover:-translate-y-1`
    : `${baseCardClass} hover:-translate-y-0.5 mb-3`;

  return (
    <div className={cardClass}>
      {/* Status Stripe */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusStyle.stripe}`}></div>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-3 ml-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
              {task.id}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(task.difficulty)}`}>
              {t.level} {task.difficulty}
            </span>
          </div>

          <h3 className="font-semibold text-gray-900 dark:text-white leading-tight mb-2">
            {language === 'es' ? task.name : task.nameEn}
          </h3>

          {/* Section Display */}
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            {language === 'es' ? task.section : task.sectionEn}
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="space-y-2 mb-3 ml-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <User className="w-4 h-4" />
            <span>{task.assignee}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{task.hours}h</span>
          </div>
        </div>
      </div>

      {/* Progress - simplified for now */}
      <div className="mb-3 ml-2">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
            style={{ width: `${smartProgress}%` }}
          />
        </div>
      </div>

      {/* Dependencies Section */}
      <div className="ml-2">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          {showDetails ? (
            <>
              <ChevronUp className="w-3 h-3" />
              {t.hideDetails}
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" />
              {t.showDetails}
            </>
          )}
        </button>

        {showDetails && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1 mb-1">
                <AlertCircle className="w-3 h-3" />
                <span className="font-medium">{t.dependencies}:</span>
              </div>
              {task.dependencies.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {task.dependencies.map(dep => (
                    <span key={dep} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                      {dep}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-green-600 dark:text-green-400">{t.none}</span>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};