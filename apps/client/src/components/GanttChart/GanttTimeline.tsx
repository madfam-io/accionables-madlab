import { useMemo, forwardRef, useRef, useEffect, useImperativeHandle } from 'react';
import { GanttTask, useAppStore } from '../../stores/appStore';
import { GanttTimeScale } from './GanttTimeScale';
import { GanttTaskBar } from './GanttTaskBar';
import { EventMarker } from './EventMarker';

interface TaskGroup {
  id: string;
  name: string;
  tasks: GanttTask[];
  collapsed?: boolean;
}

interface GanttTimelineProps {
  groups: TaskGroup[];
}

export const GanttTimeline = forwardRef<HTMLDivElement, GanttTimelineProps>(({ groups }, ref) => {
  const { ganttConfig, culminatingEvent } = useAppStore();
  const scaleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Expose contentRef through the forwarded ref
  useImperativeHandle(ref, () => contentRef.current!, []);

  // Calculate timeline dimensions and scale
  const timelineData = useMemo(() => {
    const startDate = new Date(ganttConfig.startDate);
    const endDate = new Date(ganttConfig.endDate);
    
    // Calculate total timeline width based on time scale and zoom
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let baseWidth: number;
    switch (ganttConfig.timeScale) {
      case 'days':
        baseWidth = daysDiff * 30; // 30px per day
        break;
      case 'weeks':
        baseWidth = Math.ceil(daysDiff / 7) * 100; // 100px per week
        break;
      case 'months':
        baseWidth = Math.ceil(daysDiff / 30) * 120; // 120px per month
        break;
    }

    const totalWidth = baseWidth * ganttConfig.zoomLevel;
    
    // Calculate pixel position for a given date
    const getDatePosition = (date: Date): number => {
      const dayFromStart = Math.ceil((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      return (dayFromStart / daysDiff) * totalWidth;
    };

    return {
      startDate,
      endDate,
      totalWidth,
      getDatePosition,
      daysDiff
    };
  }, [ganttConfig]);

  // Calculate row height for proper spacing
  const ROW_HEIGHT = 60;
  const GROUP_HEADER_HEIGHT = 40;
  
  // Calculate total height needed - accounting for collapsed groups
  const totalHeight = useMemo(() => {
    return groups.reduce((height, group) => {
      const groupHeight = GROUP_HEADER_HEIGHT;
      const tasksHeight = group.collapsed ? 0 : (group.tasks.length * ROW_HEIGHT);
      return height + groupHeight + tasksHeight;
    }, 0);
  }, [groups]);

  // Today line position
  const todayPosition = useMemo(() => {
    const today = new Date();
    if (today >= timelineData.startDate && today <= timelineData.endDate) {
      return timelineData.getDatePosition(today);
    }
    return null;
  }, [timelineData]);

  // Culminating event position
  const eventPosition = useMemo(() => {
    if (!culminatingEvent || !ganttConfig.showConvergence) return null;
    const eventDate = new Date(culminatingEvent.date);
    if (eventDate >= timelineData.startDate && eventDate <= timelineData.endDate) {
      return timelineData.getDatePosition(eventDate);
    }
    return null;
  }, [culminatingEvent, ganttConfig.showConvergence, timelineData]);

  // Sync horizontal scrolling between scale header and content
  useEffect(() => {
    const scale = scaleRef.current;
    const content = contentRef.current;
    
    if (!scale || !content) return;

    let isSyncing = false;

    const syncScroll = (source: HTMLDivElement, target: HTMLDivElement) => {
      if (isSyncing) return;
      isSyncing = true;
      target.scrollLeft = source.scrollLeft;
      requestAnimationFrame(() => {
        isSyncing = false;
      });
    };

    const handleScaleScroll = () => syncScroll(scale, content);
    const handleContentScroll = () => syncScroll(content, scale);

    scale.addEventListener('scroll', handleScaleScroll);
    content.addEventListener('scroll', handleContentScroll);

    return () => {
      scale.removeEventListener('scroll', handleScaleScroll);
      content.removeEventListener('scroll', handleContentScroll);
    };
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Time Scale Header - Scrollable horizontally, hidden scrollbar */}
      <div ref={scaleRef} className="overflow-x-auto overflow-y-hidden scrollbar-hide">
        <GanttTimeScale 
          startDate={timelineData.startDate}
          endDate={timelineData.endDate}
          totalWidth={timelineData.totalWidth}
          timeScale={ganttConfig.timeScale}
        />
      </div>

      {/* Timeline Content - Scrollable both horizontally and vertically */}
      <div 
        ref={contentRef}
        className="flex-1 overflow-auto bg-white dark:bg-gray-900"
        style={{ minHeight: totalHeight }}
      >
        <div 
          className="relative"
          style={{ 
            width: timelineData.totalWidth,
            height: totalHeight
          }}
        >
          {/* Grid Lines */}
          <div className="absolute inset-0">
            {/* Vertical grid lines */}
            {Array.from({ length: Math.ceil(timelineData.daysDiff / 7) + 1 }, (_, i) => {
              const weekStart = new Date(timelineData.startDate);
              weekStart.setDate(weekStart.getDate() + (i * 7));
              const position = timelineData.getDatePosition(weekStart);
              
              return (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 border-l border-gray-200 dark:border-gray-700"
                  style={{ left: position }}
                />
              );
            })}

            {/* Horizontal grid lines */}
            {groups.map((group, groupIndex) => {
              let groupY = 0;
              // Calculate Y position accounting for collapsed groups
              for (let i = 0; i < groupIndex; i++) {
                const prevGroup = groups[i];
                groupY += GROUP_HEADER_HEIGHT;
                if (!prevGroup.collapsed) {
                  groupY += prevGroup.tasks.length * ROW_HEIGHT;
                }
              }
              
              // Only render grid lines for visible tasks
              return !group.collapsed ? group.tasks.map((_, taskIndex) => (
                <div
                  key={`${group.id}-${taskIndex}`}
                  className="absolute left-0 right-0 border-b border-gray-100 dark:border-gray-800"
                  style={{ 
                    top: groupY + GROUP_HEADER_HEIGHT + (taskIndex * ROW_HEIGHT) + ROW_HEIGHT - 1
                  }}
                />
              )) : null;
            })}
          </div>

          {/* Today Line */}
          {todayPosition !== null && (
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20"
              style={{ left: todayPosition }}
            >
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-red-500 rounded-full"></div>
            </div>
          )}

          {/* Convergence Lines - Visual paths from tasks to event */}
          {eventPosition !== null && ganttConfig.showConvergence && (
            <svg className="absolute inset-0 pointer-events-none z-5 overflow-visible">
              <defs>
                <linearGradient id="convergence-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              {groups.flatMap((group, groupIndex) => {
                let groupY = 0;
                for (let i = 0; i < groupIndex; i++) {
                  const prevGroup = groups[i];
                  groupY += GROUP_HEADER_HEIGHT;
                  if (!prevGroup.collapsed) {
                    groupY += prevGroup.tasks.length * ROW_HEIGHT;
                  }
                }
                return !group.collapsed ? group.tasks.map((task, taskIndex) => {
                  const taskY = groupY + GROUP_HEADER_HEIGHT + (taskIndex * ROW_HEIGHT) + (ROW_HEIGHT / 2);
                  const taskEndX = timelineData.getDatePosition(task.endDate);

                  // Only draw convergence lines for tasks ending before the event
                  if (taskEndX >= eventPosition) return null;

                  // Bezier curve from task end to event
                  const controlPointX = taskEndX + (eventPosition - taskEndX) * 0.7;
                  const eventCenterY = 60; // Center of the event marker

                  return (
                    <path
                      key={`convergence-${task.id}`}
                      d={`M ${taskEndX} ${taskY} Q ${controlPointX} ${taskY}, ${eventPosition} ${eventCenterY}`}
                      stroke="url(#convergence-gradient)"
                      strokeWidth="2"
                      fill="none"
                      className="animate-dash-flow"
                      strokeDasharray="8,4"
                      opacity={task.criticalPath ? 0.8 : 0.4}
                    />
                  );
                }) : [];
              })}
            </svg>
          )}

          {/* Culminating Event Marker */}
          {eventPosition !== null && culminatingEvent && (
            <EventMarker
              event={culminatingEvent}
              x={eventPosition}
              totalHeight={totalHeight}
            />
          )}

          {/* Task Bars */}
          {groups.map((group, groupIndex) => {
            let groupY = 0;
            // Calculate Y position accounting for collapsed groups
            for (let i = 0; i < groupIndex; i++) {
              const prevGroup = groups[i];
              groupY += GROUP_HEADER_HEIGHT;
              if (!prevGroup.collapsed) {
                groupY += prevGroup.tasks.length * ROW_HEIGHT;
              }
            }

            return (
              <div key={group.id}>
                {/* Group Header Background - matches task list */}
                {groups.length > 1 && (
                  <div
                    className="absolute left-0 right-0 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700"
                    style={{
                      top: groupY,
                      height: GROUP_HEADER_HEIGHT
                    }}
                  />
                )}

                {/* Task Bars - Only render if not collapsed */}
                {!group.collapsed && group.tasks.map((task, taskIndex) => {
                  const taskY = groupY + GROUP_HEADER_HEIGHT + (taskIndex * ROW_HEIGHT);
                  const startX = timelineData.getDatePosition(task.startDate);
                  const endX = timelineData.getDatePosition(task.endDate);
                  const taskWidth = Math.max(20, endX - startX); // Minimum 20px width

                  return (
                    <GanttTaskBar
                      key={task.id}
                      task={task}
                      x={startX}
                      y={taskY}
                      width={taskWidth}
                      height={ROW_HEIGHT - 20} // Leave some padding
                    />
                  );
                })}
              </div>
            );
          })}

          {/* Dependencies (if enabled) */}
          {ganttConfig.showDependencies && (
            <svg className="absolute inset-0 pointer-events-none z-10">
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#3b82f6"
                  />
                </marker>
                <marker
                  id="arrowhead-critical"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#dc2626"
                  />
                </marker>
              </defs>
              
              {groups.flatMap((group, groupIndex) => {
                // Calculate group Y position
                let groupY = 0;
                for (let i = 0; i < groupIndex; i++) {
                  const prevGroup = groups[i];
                  groupY += GROUP_HEADER_HEIGHT;
                  if (!prevGroup.collapsed) {
                    groupY += prevGroup.tasks.length * ROW_HEIGHT;
                  }
                }

                // Only process visible tasks
                return !group.collapsed ? group.tasks.flatMap((task, taskIndex) => {
                  const taskY = groupY + GROUP_HEADER_HEIGHT + (taskIndex * ROW_HEIGHT) + (ROW_HEIGHT / 2);
                  
                  return task.dependencies.map(depId => {
                    // Find the dependency task and its position
                    let depTaskY = 0;
                    let depTask = null;
                    
                    for (let gi = 0; gi < groups.length; gi++) {
                      const depGroup = groups[gi];
                      let depGroupY = 0;
                      
                      // Calculate Y position for this group
                      for (let i = 0; i < gi; i++) {
                        const prevGroup = groups[i];
                        depGroupY += GROUP_HEADER_HEIGHT;
                        if (!prevGroup.collapsed) {
                          depGroupY += prevGroup.tasks.length * ROW_HEIGHT;
                        }
                      }
                      
                      if (!depGroup.collapsed) {
                        const taskInGroup = depGroup.tasks.findIndex(t => t.id === depId);
                        if (taskInGroup >= 0) {
                          depTask = depGroup.tasks[taskInGroup];
                          depTaskY = depGroupY + GROUP_HEADER_HEIGHT + (taskInGroup * ROW_HEIGHT) + (ROW_HEIGHT / 2);
                          break;
                        }
                      }
                    }
                    
                    if (!depTask) return null;

                    // Calculate X positions
                    const fromX = timelineData.getDatePosition(depTask.endDate);
                    const toX = timelineData.getDatePosition(task.startDate);
                    
                    // Check if both tasks are on critical path
                    const isCriticalDependency = task.criticalPath && depTask.criticalPath;
                    
                    // Simple L-shaped connector for better visibility
                    const path = taskY === depTaskY 
                      ? `M ${fromX} ${depTaskY} L ${toX} ${taskY}` // Straight line for same row
                      : `M ${fromX} ${depTaskY} L ${fromX + 20} ${depTaskY} L ${fromX + 20} ${taskY} L ${toX} ${taskY}`; // L-shape for different rows
                    
                    return (
                      <g key={`${task.id}-${depId}`}>
                        {/* Shadow for better visibility */}
                        <path
                          d={path}
                          stroke="rgba(0,0,0,0.2)"
                          strokeWidth="4"
                          fill="none"
                          opacity="0.3"
                        />
                        {/* Main arrow */}
                        <path
                          d={path}
                          stroke={isCriticalDependency ? "#dc2626" : "#3b82f6"}
                          strokeWidth={isCriticalDependency ? "3" : "2"}
                          fill="none"
                          markerEnd={isCriticalDependency ? "url(#arrowhead-critical)" : "url(#arrowhead)"}
                          opacity={isCriticalDependency ? "1" : "0.8"}
                          strokeDasharray={isCriticalDependency ? "0" : "5,3"}
                        />
                      </g>
                    );
                  });
                }) : [];
              })}
            </svg>
          )}
        </div>
      </div>
    </div>
  );
});