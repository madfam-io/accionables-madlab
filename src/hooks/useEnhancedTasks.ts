/**
 * Hook to dynamically enhance tasks with week numbers, status, and display info
 * This ensures all tasks have temporal awareness without hardcoding
 */

import { useMemo } from 'react';
import { Task } from '../data/types';
import { 
  getTaskStatus, 
  formatWeekWithDates,
  getTaskStatusLabel 
} from '../utils/dateHelpers';
import { calculateOptimalTaskWeek, getPhaseWeekRange } from '../utils/taskScheduler';

interface EnhancedTask extends Task {
  weekNumber: number;
  weekDisplay: string;
  status: 'past' | 'current' | 'future';
  statusLabel: string;
}

/**
 * Enhances tasks with dynamic temporal properties
 */
export function useEnhancedTasks(tasks: Task[], language: 'es' | 'en' = 'en'): EnhancedTask[] {
  return useMemo(() => {
    // Group tasks by phase for intelligent scheduling
    const tasksByPhase = new Map<number, Task[]>();
    
    tasks.forEach(task => {
      if (!tasksByPhase.has(task.phase)) {
        tasksByPhase.set(task.phase, []);
      }
      tasksByPhase.get(task.phase)!.push(task);
    });

    // Enhance each task with dynamic properties
    return tasks.map(task => {
      const phaseTasks = tasksByPhase.get(task.phase) || [];
      const phaseWeekRange = getPhaseWeekRange(task.phase);
      
      // Calculate week number using intelligent scheduling
      const weekNumber = calculateOptimalTaskWeek(task, phaseTasks, phaseWeekRange);
      
      // Calculate status based on current date
      const status = getTaskStatus(weekNumber);
      
      // Format week display
      const weekDisplay = formatWeekWithDates(weekNumber);
      
      // Get status label
      const statusLabel = getTaskStatusLabel(weekNumber, language);

      return {
        ...task,
        weekNumber,
        weekDisplay,
        status,
        statusLabel
      } as EnhancedTask;
    });
  }, [tasks, language]);
}

/**
 * Get tasks for a specific status
 */
export function useTasksByStatus(tasks: Task[], status: 'past' | 'current' | 'future'): EnhancedTask[] {
  const enhancedTasks = useEnhancedTasks(tasks);
  return enhancedTasks.filter(task => task.status === status);
}

/**
 * Get current week tasks
 */
export function useCurrentTasks(tasks: Task[]): EnhancedTask[] {
  return useTasksByStatus(tasks, 'current');
}

/**
 * Get completed tasks
 */
export function useCompletedTasks(tasks: Task[]): EnhancedTask[] {
  return useTasksByStatus(tasks, 'past');
}

/**
 * Get upcoming tasks  
 */
export function useUpcomingTasks(tasks: Task[]): EnhancedTask[] {
  return useTasksByStatus(tasks, 'future');
}