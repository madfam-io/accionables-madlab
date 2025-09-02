import React, { useRef, useEffect, ReactNode } from 'react';

interface GanttSyncedScrollProps {
  children: (refs: {
    taskListRef: React.RefObject<HTMLDivElement>;
    timelineRef: React.RefObject<HTMLDivElement>;
  }) => ReactNode;
}

export const GanttSyncedScroll: React.FC<GanttSyncedScrollProps> = ({ children }) => {
  const taskListRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const isSyncing = useRef(false);

  useEffect(() => {
    const taskList = taskListRef.current;
    const timeline = timelineRef.current;
    
    if (!taskList || !timeline) return;

    // Sync vertical scrolling between task list and timeline
    const syncScroll = (source: HTMLDivElement, target: HTMLDivElement) => {
      if (isSyncing.current) return;
      
      isSyncing.current = true;
      target.scrollTop = source.scrollTop;
      
      // Reset flag after animation frame
      requestAnimationFrame(() => {
        isSyncing.current = false;
      });
    };

    const handleTaskListScroll = () => syncScroll(taskList, timeline);
    const handleTimelineScroll = () => syncScroll(timeline, taskList);

    taskList.addEventListener('scroll', handleTaskListScroll);
    timeline.addEventListener('scroll', handleTimelineScroll);

    return () => {
      taskList.removeEventListener('scroll', handleTaskListScroll);
      timeline.removeEventListener('scroll', handleTimelineScroll);
    };
  }, []);

  return <>{children({ taskListRef, timelineRef })}</>;
};