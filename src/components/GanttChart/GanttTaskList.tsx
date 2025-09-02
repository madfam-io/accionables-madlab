import { useState, forwardRef } from 'react';
import { GanttTask } from '../../stores/appStore';
import { useAppStore } from '../../stores/appStore';
import { TaskStatusControl } from '../TaskStatusControl';
import { ChevronDown, ChevronRight, User, Clock, Calendar } from 'lucide-react';

interface TaskGroup {
  id: string;
  name: string;
  tasks: GanttTask[];
  collapsed?: boolean;
}

interface GanttTaskListProps {
  groups: TaskGroup[];
}

export const GanttTaskList = forwardRef<HTMLDivElement, GanttTaskListProps>(({ groups }, ref) => {
  const { language, togglePhase } = useAppStore();
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  // Match timeline heights exactly
  const ROW_HEIGHT = 60;
  const GROUP_HEADER_HEIGHT = 40;

  const toggleGroup = (group: TaskGroup) => {
    // If it's a phase group, use the main store's phase toggle
    if (group.id.startsWith('phase-')) {
      const phaseNumber = parseInt(group.id.split('-')[1]);
      togglePhase(phaseNumber);
    } else {
      // For non-phase groups, use local state
      const newCollapsed = new Set(collapsedGroups);
      if (newCollapsed.has(group.id)) {
        newCollapsed.delete(group.id);
      } else {
        newCollapsed.add(group.id);
      }
      setCollapsedGroups(newCollapsed);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header to match timeline scale height */}
      <div className="h-[60px] bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-3">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300">Tasks</h3>
      </div>
      
      {/* Scrollable task list */}
      <div ref={ref} className="flex-1 overflow-y-auto">
        {groups.map(group => (
        <div key={group.id}>
          {/* Group Header */}
          {groups.length > 1 && (
            <div 
              className="flex items-center gap-2 px-3 bg-gray-100 dark:bg-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border-b border-gray-200 dark:border-gray-700"
              style={{ height: `${GROUP_HEADER_HEIGHT}px` }}
              onClick={() => toggleGroup(group)}
            >
              {(group.collapsed || collapsedGroups.has(group.id)) ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              <span className="font-medium text-gray-900 dark:text-white">
                {group.name}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({group.tasks.length})
              </span>
            </div>
          )}

          {/* Task List */}
          {!(group.collapsed || collapsedGroups.has(group.id)) && (
            <div>
              {group.tasks.map(task => (
                <div 
                  key={task.id} 
                  className="px-3 py-2 border-l-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer flex items-center"
                  style={{ 
                    borderLeftColor: task.color,
                    height: `${ROW_HEIGHT}px`
                  }}
                >
                  {/* Compact Task Info */}
                  <div className="flex items-center justify-between w-full">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                          {task.id}
                        </span>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {language === 'es' ? task.name : task.nameEn}
                        </h4>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {task.assignee}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.hours}h
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(task.startDate)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      {/* Smart Progress indicator with status control */}
                      <TaskStatusControl 
                        taskId={task.id}
                        currentProgress={task.progress}
                        compact
                      />
                      {task.milestone && (
                        <div className="w-2 h-2 bg-yellow-500 transform rotate-45 flex-shrink-0"></div>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      </div>
    </div>
  );
});