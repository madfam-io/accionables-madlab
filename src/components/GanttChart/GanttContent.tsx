import React, { useMemo } from 'react';
import { useAppStore } from '../../stores/appStore';
import { GanttTaskList } from './GanttTaskList';
import { GanttTimeline } from './GanttTimeline';
import { GanttSyncedScroll } from './GanttSyncedScroll';

export const GanttContent: React.FC = () => {
  const { ganttTasks, ganttConfig, collapsedPhases } = useAppStore();

  // Group tasks based on configuration
  const groupedTasks = useMemo(() => {
    if (ganttConfig.groupBy === 'none') {
      return [{ id: 'all', name: 'All Tasks', tasks: ganttTasks }];
    }

    const groups = new Map<string, typeof ganttTasks>();
    
    ganttTasks.forEach(task => {
      let groupKey = '';

      if (ganttConfig.groupBy === 'phase') {
        groupKey = `phase-${task.phase}`;
      } else if (ganttConfig.groupBy === 'assignee') {
        groupKey = task.assignee;
      }

      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(task);
    });

    return Array.from(groups.entries()).map(([key, tasks]) => {
      const groupTasks = tasks.sort((a, b) => {
        // Sort by start date within groups
        return a.startDate.getTime() - b.startDate.getTime();
      });

      // Filter out collapsed phases if grouping by phase
      const isCollapsed = ganttConfig.groupBy === 'phase' && 
                         collapsedPhases.has(tasks[0]?.phase || 0);

      return {
        id: key,
        name: ganttConfig.groupBy === 'phase' ? `Phase ${tasks[0]?.phase}` : key,
        tasks: groupTasks,
        collapsed: isCollapsed
      };
    });
  }, [ganttTasks, ganttConfig.groupBy, collapsedPhases]);

  if (ganttTasks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="text-lg mb-2">No tasks scheduled</div>
          <div className="text-sm">Tasks will appear here once auto-scheduling is enabled</div>
        </div>
      </div>
    );
  }

  return (
    <GanttSyncedScroll>
      {({ taskListRef, timelineRef }) => (
        <div className="flex-1 flex">
          {/* Task List Panel - 30% width */}
          <div className="w-[30%] min-w-[300px] border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-hidden">
            <GanttTaskList ref={taskListRef} groups={groupedTasks} />
          </div>
          
          {/* Timeline Panel - 70% width - Remove overflow-hidden to allow proper scrolling */}
          <div className="flex-1 bg-white dark:bg-gray-900">
            <GanttTimeline ref={timelineRef} groups={groupedTasks} />
          </div>
        </div>
      )}
    </GanttSyncedScroll>
  );
};