import React, { useEffect } from 'react';
import { useAppStore } from '../../stores/appStore';
import { GanttHeader } from './GanttHeader';
import { GanttContent } from './GanttContent';

export const GanttChart: React.FC = () => {
  const { ganttTasks, scheduleGanttTasks, filteredTasks } = useAppStore();

  // Auto-schedule tasks when component mounts or filtered tasks change
  useEffect(() => {
    scheduleGanttTasks();
  }, [filteredTasks, scheduleGanttTasks]);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      <GanttHeader />
      <GanttContent />
    </div>
  );
};