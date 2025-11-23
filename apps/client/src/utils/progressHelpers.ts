/**
 * Smart progress calculation utilities that combine temporal awareness with manual status tracking
 */

import { Task, TaskStatus } from '../data/types';
import { getTaskStatus } from './dateHelpers';

/**
 * Get progress percentage based on manual status
 */
export function getStatusBasedProgress(status: TaskStatus): number {
  const statusMap = {
    not_started: 0,
    planning: 25,      // Planning/preparation phase
    in_progress: 50,   // Active work underway
    review: 85,        // Under review/testing/approval
    completed: 100     // Task completed
  };
  
  return statusMap[status];
}

/**
 * Calculate progress based on current date vs task timeline
 */
export function getDateBasedProgress(startDate: Date, endDate: Date): number {
  const now = new Date();
  
  // Before start date
  if (now < startDate) return 0;
  
  // After end date - consider completed if past deadline
  if (now > endDate) return 100;
  
  // During task period - linear interpolation
  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsed = now.getTime() - startDate.getTime();
  
  return Math.round((elapsed / totalDuration) * 100);
}

/**
 * Smart progress calculation that combines temporal awareness with manual status
 */
export function getSmartTaskProgress(task: Task): number {
  // If manual status is set, always use it - this is the only source of progress
  if (task.manualStatus) {
    return getStatusBasedProgress(task.manualStatus);
  }
  
  // No manual status = task has not been started, return 0% regardless of date
  // Tasks should only show progress when explicitly marked by the user
  return 0;
}

/**
 * Get progress status description
 */
export function getProgressStatusText(progress: number, language: 'es' | 'en' = 'en'): string {
  const texts = {
    es: {
      notStarted: 'No iniciada',
      planning: 'Planificación',
      inProgress: 'En progreso',
      review: 'En revisión',
      completed: 'Completada'
    },
    en: {
      notStarted: 'Not Started',
      planning: 'Planning',
      inProgress: 'In Progress', 
      review: 'Under Review',
      completed: 'Completed'
    }
  };
  
  const t = texts[language];
  
  if (progress === 0) return t.notStarted;
  if (progress <= 25) return t.planning;
  if (progress < 85) return t.inProgress;
  if (progress < 100) return t.review;
  return t.completed;
}

/**
 * Get progress color based on percentage and status
 */
export function getProgressColor(progress: number): string {
  if (progress === 0) return '#64748b'; // gray-500
  if (progress <= 25) return '#3b82f6'; // blue-500 - planning
  if (progress < 85) return '#f59e0b'; // amber-500 - in progress
  if (progress < 100) return '#8b5cf6'; // violet-500 - under review
  return '#10b981'; // emerald-500 - completed
}

/**
 * Check if a task is overdue (past its week but not completed)
 */
export function isTaskOverdue(task: Task, weekNumber?: number): boolean {
  // If manually marked as completed, it's not overdue
  if (task.manualStatus === 'completed') return false;
  
  // Only consider overdue if week has passed AND no manual status is set
  // OR manual status is set but not completed
  if (weekNumber) {
    const temporalStatus = getTaskStatus(weekNumber);
    if (temporalStatus === 'past') {
      // Past week and either no status or status is not completed
      return !task.manualStatus || (task.manualStatus as string) !== 'completed';
    }
  }
  
  return false;
}

/**
 * Get task urgency level based on timeline and progress
 */
export function getTaskUrgency(task: Task, progress: number, weekNumber?: number): 'low' | 'medium' | 'high' | 'critical' {
  const isOverdue = isTaskOverdue(task, weekNumber);
  
  if (isOverdue && progress < 50) return 'critical';
  if (isOverdue || (progress === 0 && weekNumber && getTaskStatus(weekNumber) === 'current')) return 'high';
  if (weekNumber && getTaskStatus(weekNumber) === 'current' && progress < 50) return 'medium';
  
  return 'low';
}