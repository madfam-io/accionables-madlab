import React, { useMemo } from 'react';
import { useAppStore, GanttTask } from '../../stores/appStore';
import { GanttTaskList } from './GanttTaskList';
import { GanttTimeline } from './GanttTimeline';
import { GanttSyncedScroll } from './GanttSyncedScroll';
import { formatWeekWithDates } from '../../utils/dateHelpers';

interface GanttContentProps {
  ganttTasks: GanttTask[];
}

export const GanttContent: React.FC<GanttContentProps> = ({ ganttTasks }) => {
  const { ganttConfig, collapsedPhases, groupingOption } = useAppStore();

  // Group tasks based on global grouping option from UnifiedToolbar
  const groupedTasks = useMemo(() => {
    if (groupingOption === 'none') {
      return [{ id: 'all', name: 'All Tasks', tasks: ganttTasks }];
    }

    const groups = new Map<string, typeof ganttTasks>();
    
    ganttTasks.forEach(task => {
      let groupKey = '';

      if (groupingOption === 'phase') {
        groupKey = `phase-${task.phase}`;
      } else if (groupingOption === 'assignee') {
        groupKey = task.assignee;
      } else if (groupingOption === 'week') {
        groupKey = `week-${task.weekNumber || 'unscheduled'}`;
      } else if (groupingOption === 'difficulty') {
        groupKey = `difficulty-${task.difficulty}`;
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
      const isCollapsed = groupingOption === 'phase' && 
                         collapsedPhases.has(tasks[0]?.phase || 0);

      // Format group name based on grouping type
      let groupName = key;
      if (groupingOption === 'phase') {
        groupName = `Phase ${tasks[0]?.phase}`;
      } else if (groupingOption === 'week') {
        const weekNum = key.replace('week-', '');
        if (weekNum === 'unscheduled') {
          groupName = 'Unscheduled';
        } else {
          const weekNumber = parseInt(weekNum);
          if (!isNaN(weekNumber)) {
            groupName = formatWeekWithDates(weekNumber);
          }
        }
      } else if (groupingOption === 'difficulty') {
        const difficultyNum = key.replace('difficulty-', '');
        const difficultyLabels: Record<string, string> = {
          '1': 'Easy',
          '2': 'Medium',
          '3': 'Hard',
          '4': 'Very Hard',
          '5': 'Expert'
        };
        groupName = difficultyLabels[difficultyNum] || groupName;
      }

      return {
        id: key,
        name: groupName,
        tasks: groupTasks,
        collapsed: isCollapsed
      };
    });
  }, [ganttTasks, groupingOption, collapsedPhases]);

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