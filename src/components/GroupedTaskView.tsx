import React, { useState } from 'react';
import { useAppStore } from '../stores/appStore';
import { EnhancedTaskCard } from './EnhancedTaskCard';
import { ChevronDown, ChevronUp, Layers, Calendar, Users, TrendingUp } from 'lucide-react';

export const GroupedTaskView: React.FC = () => {
  const { viewMode, groupedTasks, groupingOption, language } = useAppStore();
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  
  const toggleGroup = (groupName: string) => {
    const newCollapsed = new Set(collapsedGroups);
    if (newCollapsed.has(groupName)) {
      newCollapsed.delete(groupName);
    } else {
      newCollapsed.add(groupName);
    }
    setCollapsedGroups(newCollapsed);
  };
  
  const getGroupIcon = (groupName: string) => {
    if (groupingOption === 'phase') return <Layers className="w-4 h-4" />;
    if (groupingOption === 'week') return <Calendar className="w-4 h-4" />;
    if (groupingOption === 'assignee') return <Users className="w-4 h-4" />;
    if (groupingOption === 'difficulty') return <TrendingUp className="w-4 h-4" />;
    return null;
  };
  
  const getGroupStats = (tasks: any[]) => {
    const totalHours = tasks.reduce((sum, task) => sum + task.hours, 0);
    const avgDifficulty = tasks.reduce((sum, task) => sum + task.difficulty, 0) / tasks.length;
    
    return {
      taskCount: tasks.length,
      totalHours,
      avgDifficulty: avgDifficulty.toFixed(1)
    };
  };
  
  // If no grouping, render tasks directly
  if (groupingOption === 'none') {
    const allTasks = groupedTasks.get('all') || [];
    return (
      <div className={`animate-fadeIn ${
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
          : 'space-y-3'
      }`}>
        {allTasks.map((task, index) => (
          <div 
            key={task.id} 
            style={{ animationDelay: `${index * 50}ms` }}
            className="animate-fadeIn"
          >
            <EnhancedTaskCard task={task} />
          </div>
        ))}
      </div>
    );
  }
  
  // Render grouped tasks
  return (
    <div className="space-y-6">
      {Array.from(groupedTasks.entries()).map(([groupName, tasks]) => {
        const isCollapsed = collapsedGroups.has(groupName);
        const stats = getGroupStats(tasks);
        
        return (
          <div key={groupName} className="mb-6">
            <button
              onClick={() => toggleGroup(groupName)}
              className="w-full flex justify-between items-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 transition-all group btn-ripple"
            >
              <div className="flex items-center gap-3">
                {getGroupIcon(groupName)}
                <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white text-left">
                  {groupName}
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <span>{stats.taskCount} {language === 'es' ? 'tareas' : 'tasks'}</span>
                  <span className="text-gray-400">•</span>
                  <span>{stats.totalHours}h</span>
                  <span className="text-gray-400">•</span>
                  <span>{language === 'es' ? 'Dif' : 'Diff'}: {stats.avgDifficulty}</span>
                </div>
                {isCollapsed ? (
                  <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                ) : (
                  <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                )}
              </div>
            </button>

            {!isCollapsed && (
              <div className={`mt-4 animate-fadeIn ${
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
                  : 'space-y-3'
              }`}>
                {tasks.map((task, index) => (
                  <div 
                    key={task.id} 
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="animate-fadeIn"
                  >
                    <EnhancedTaskCard task={task} />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};