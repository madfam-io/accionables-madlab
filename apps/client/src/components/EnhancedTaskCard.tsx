import React, { useState } from 'react';
import { Task } from '../data/types';
import { useAppStore } from '../stores/appStore';
import { translations } from '../data/translations';
import { tasks } from '../data/tasks';
import { useEnhancedTasks } from '../hooks/useEnhancedTasks';
import { TaskStatusControl } from './TaskStatusControl';
import { Clock, User, AlertCircle, ChevronDown, ChevronUp, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';

interface EnhancedTaskCardProps {
  task: Task;
}

export const EnhancedTaskCard: React.FC<EnhancedTaskCardProps> = ({ task }) => {
  const { language, viewMode, getTaskProgress, getTaskStatus } = useAppStore();
  const [showDetails, setShowDetails] = useState(false);
  const t = translations[language];
  
  // Get enhanced task data with week and status info - use ALL tasks for proper indexing
  const allEnhancedTasks = useEnhancedTasks(tasks, language);
  const enhancedTask = allEnhancedTasks.find(et => et.id === task.id) || allEnhancedTasks[0];
  
  // Get smart progress including manual status
  const smartProgress = getTaskProgress(task.id, enhancedTask.weekNumber);
  const manualStatus = getTaskStatus(task.id);
  
  // Determine if task is overdue (past its week but not manually completed)
  const isOverdue = enhancedTask.status === 'past' && manualStatus !== 'completed';
  const isActuallyCompleted = manualStatus === 'completed';
  
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
    // Overdue tasks (past deadline but not completed)
    if (isOverdue) {
      return {
        card: 'bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-300 dark:border-red-700 ring-2 ring-red-200 dark:ring-red-800',
        stripe: 'bg-red-500 animate-pulse',
        badge: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 font-bold',
        indicator: 'text-red-600 dark:text-red-400'
      };
    }
    
    // Actually completed tasks (manually marked as completed)
    if (isActuallyCompleted) {
      return {
        card: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800',
        stripe: 'bg-green-500',
        badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        indicator: 'text-green-600 dark:text-green-400'
      };
    }
    
    // Current week tasks
    if (enhancedTask.status === 'current') {
      return {
        card: 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-300 dark:border-orange-700 shadow-lg shadow-orange-100 dark:shadow-orange-900/20',
        stripe: 'bg-orange-500 shadow-orange-200 dark:shadow-orange-800 shadow-sm',
        badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 font-semibold',
        indicator: 'text-orange-600 dark:text-orange-400'
      };
    }
    
    // Future tasks
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
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle.badge}`}>
              {isOverdue && <AlertTriangle className="w-3 h-3" />}
              {isActuallyCompleted && <CheckCircle className="w-3 h-3" />}
              {!isOverdue && !isActuallyCompleted && enhancedTask.status === 'current' && <Clock className="w-3 h-3" />}
              {!isOverdue && !isActuallyCompleted && enhancedTask.status === 'future' && <Calendar className="w-3 h-3" />}
              {isOverdue ? (language === 'es' ? 'Atrasada' : 'Overdue') :
               isActuallyCompleted ? (language === 'es' ? 'Completada' : 'Completed') :
               enhancedTask.statusLabel}
            </span>
            {isOverdue && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 animate-pulse">
                {language === 'es' ? '¡Acción requerida!' : 'Action Required!'}
              </span>
            )}
          </div>
          
          <h3 className="font-semibold text-gray-900 dark:text-white leading-tight mb-2">
            {language === 'es' ? task.name : task.nameEn}
          </h3>

          {/* Week Display */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">{enhancedTask.weekDisplay}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(task.difficulty)}`}>
            {t.level} {task.difficulty}
          </span>
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

      {/* Smart Progress Section */}
      <div className="mb-3 ml-2">
        <TaskStatusControl 
          taskId={task.id}
          currentProgress={smartProgress}
          compact={viewMode === 'grid'}
        />
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