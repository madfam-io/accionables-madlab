import React, { useMemo } from 'react';
import { useAppStore } from '../../stores/appStore';
import { GanttHeader } from './GanttHeader';
import { GanttContent } from './GanttContent';
import { scheduleProject, manualScheduleProject } from '../../utils/ganttScheduling';
import { Task } from '../../data/types';

interface GanttChartProps {
  tasks: Task[];
}

export const GanttChart: React.FC<GanttChartProps> = ({ tasks }) => {
  const { ganttConfig } = useAppStore();

  // Schedule tasks for Gantt display
  const ganttTasks = useMemo(() => {
    if (tasks.length === 0) return [];

    return ganttConfig.autoScheduling
      ? scheduleProject(tasks, ganttConfig.startDate, ganttConfig.showCriticalPath)
      : manualScheduleProject(tasks, ganttConfig.startDate);
  }, [tasks, ganttConfig]);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      <GanttHeader />
      <GanttContent ganttTasks={ganttTasks} />
    </div>
  );
};
