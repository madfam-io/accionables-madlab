import React from 'react';
import { useAppStore } from '../stores/appStore';
import { TaskStatus } from '../data/types';

interface TaskStatusControlProps {
  taskId: string;
  currentProgress: number;
  compact?: boolean;
}

export const TaskStatusControl: React.FC<TaskStatusControlProps> = ({ 
  taskId, 
  currentProgress,
  compact = false 
}) => {
  const { 
    updateTaskStatus, 
    getTaskStatus, 
    currentUser, 
    tasks, 
    language 
  } = useAppStore();
  
  const task = tasks.find(t => t.id === taskId);
  const currentStatus = getTaskStatus(taskId) || 'not_started';
  
  if (!task) return null;
  
  // Check if current user can update this task
  const canUpdate = task.assignee === currentUser || task.assignee === 'All';
  
  const statusOptions: { value: TaskStatus; label: string; color: string }[] = [
    { value: 'not_started', label: language === 'es' ? 'No iniciada' : 'Not Started', color: 'text-gray-600' },
    { value: 'planning', label: language === 'es' ? 'Planificación' : 'Planning', color: 'text-blue-600' },
    { value: 'in_progress', label: language === 'es' ? 'En progreso' : 'In Progress', color: 'text-amber-600' },
    { value: 'review', label: language === 'es' ? 'En revisión' : 'Under Review', color: 'text-violet-600' },
    { value: 'completed', label: language === 'es' ? 'Completada' : 'Completed', color: 'text-emerald-600' }
  ];
  
  const currentStatusOption = statusOptions.find(opt => opt.value === currentStatus);
  
  const handleStatusChange = (newStatus: TaskStatus) => {
    if (!canUpdate) return;
    
    updateTaskStatus(taskId, newStatus, `Updated by ${currentUser}`);
  };
  
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-end">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {currentProgress}%
          </span>
          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
            <div
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: `${currentProgress}%`,
                backgroundColor: currentProgress === 0 ? '#64748b' : 
                                currentProgress <= 25 ? '#3b82f6' :
                                currentProgress < 85 ? '#f59e0b' :
                                currentProgress < 100 ? '#8b5cf6' : '#10b981'
              }}
            />
          </div>
        </div>
        
        {canUpdate ? (
          <select
            value={currentStatus}
            onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
            className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 min-w-[90px]"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <span className={`text-xs font-medium ${currentStatusOption?.color || 'text-gray-600'}`}>
            {currentStatusOption?.label}
          </span>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Task Status
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {currentProgress}% {language === 'es' ? 'completado' : 'complete'}
        </span>
      </div>
      
      {canUpdate ? (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {statusOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                className={`text-xs px-3 py-2 rounded-md border transition-all ${
                  currentStatus === option.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          
          {!canUpdate && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              {language === 'es' 
                ? `Solo ${task.assignee} puede actualizar esta tarea`
                : `Only ${task.assignee} can update this task`}
            </p>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            currentProgress === 0 ? 'bg-gray-400' :
            currentProgress <= 25 ? 'bg-blue-500' :
            currentProgress < 85 ? 'bg-amber-500' :
            currentProgress < 100 ? 'bg-violet-500' : 'bg-emerald-500'
          }`} />
          <span className={`text-sm font-medium ${currentStatusOption?.color || 'text-gray-600'}`}>
            {currentStatusOption?.label}
          </span>
        </div>
      )}
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-300"
          style={{
            width: `${currentProgress}%`,
            backgroundColor: currentProgress === 0 ? '#64748b' : 
                            currentProgress <= 25 ? '#3b82f6' :
                            currentProgress < 85 ? '#f59e0b' :
                            currentProgress < 100 ? '#8b5cf6' : '#10b981'
          }}
        />
      </div>
    </div>
  );
};