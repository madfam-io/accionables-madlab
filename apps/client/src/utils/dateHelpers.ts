/**
 * Date and week calculation utilities for MADLAB project
 * Provides dynamic week calculations based on phase boundaries and task positioning
 */

// Project configuration - can be updated without breaking anything
export const PROJECT_CONFIG = {
  startDate: new Date(2025, 7, 11), // Aug 11, 2025 (month is 0-indexed)
  endDate: new Date(2025, 9, 31), // Oct 31, 2025
  startWeek: 33, // Aug 11, 2025 is ISO Week 33
  phases: [
    { number: 1, start: new Date(2025, 7, 11), end: new Date(2025, 8, 5) }, // Aug 11 - Sep 5
    { number: 2, start: new Date(2025, 8, 6), end: new Date(2025, 8, 25) }, // Sep 6 - Sep 25
    { number: 3, start: new Date(2025, 8, 26), end: new Date(2025, 9, 5) }, // Sep 26 - Oct 5
    { number: 4, start: new Date(2025, 9, 6), end: new Date(2025, 9, 20) }, // Oct 6 - Oct 20
    { number: 5, start: new Date(2025, 9, 21), end: new Date(2025, 9, 31) } // Oct 21 - Oct 31
  ]
} as const;

/**
 * Get ISO week number for a given date
 */
export function getISOWeek(date: Date): number {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}

/**
 * Get current project week based on today's date
 */
export function getCurrentProjectWeek(): number {
  return getISOWeek(new Date());
}

/**
 * Calculate week number for a task based on its phase and position within phase
 * Uses proper step-wise scheduling within phase boundaries
 */
export function calculateTaskWeek(phase: number, taskIndex: number = 0, totalTasksInPhase: number = 1): number {
  const phaseInfo = PROJECT_CONFIG.phases.find(p => p.number === phase);
  if (!phaseInfo) return PROJECT_CONFIG.startWeek;

  // Calculate the actual weeks for each phase
  const phaseWeeks = {
    1: { start: 33, end: 36 }, // Aug 11 - Sep 5 (4 weeks)
    2: { start: 37, end: 39 }, // Sep 6 - Sep 25 (3 weeks)
    3: { start: 40, end: 40 }, // Sep 26 - Oct 5 (1.5 weeks)
    4: { start: 41, end: 42 }, // Oct 6 - Oct 20 (2 weeks)
    5: { start: 43, end: 44 }  // Oct 21 - Oct 31 (1.5 weeks)
  };

  const phaseRange = phaseWeeks[phase as keyof typeof phaseWeeks];
  if (!phaseRange) return PROJECT_CONFIG.startWeek;

  const phaseDurationWeeks = phaseRange.end - phaseRange.start + 1;

  // For single task or first task, start at phase beginning
  if (totalTasksInPhase <= 1 || taskIndex === 0) return phaseRange.start;
  
  // Distribute tasks across the phase duration
  const taskPosition = taskIndex / (totalTasksInPhase - 1);
  const weekOffset = Math.floor(taskPosition * (phaseDurationWeeks - 1));
  
  return Math.min(phaseRange.start + weekOffset, phaseRange.end);
}

/**
 * Get week range dates for a given week number in 2025
 * For MADLAB project, we calculate based on project phases instead of ISO weeks
 */
export function getWeekRange(weekNumber: number) {
  // For the MADLAB project, we map weeks directly to project timeline
  // Week 33 starts on Aug 11, 2025 (Monday, project start)
  const projectStartDate = new Date(2025, 7, 11); // Aug 11, 2025 (month is 0-indexed)
  const weeksSinceProjectStart = weekNumber - 33; // Week 33 is our week 1
  
  // Calculate the start of the specified week (Monday)
  const weekStart = new Date(projectStartDate);
  // Properly add days by using getTime() and milliseconds
  weekStart.setTime(weekStart.getTime() + (weeksSinceProjectStart * 7 * 24 * 60 * 60 * 1000));
  
  const weekEnd = new Date(weekStart);
  weekEnd.setTime(weekEnd.getTime() + (6 * 24 * 60 * 60 * 1000));

  return {
    start: weekStart,
    end: weekEnd,
    startFormatted: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    endFormatted: weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  };
}

/**
 * Format week display with date range
 */
export function formatWeekWithDates(weekNumber: number): string {
  if (!weekNumber) return '';

  const range = getWeekRange(weekNumber);
  return `Week ${weekNumber} (${range.startFormatted} - ${range.endFormatted})`;
}

/**
 * Get the start date of a week
 */
export function getWeekStart(weekNumber: number): Date {
  const range = getWeekRange(weekNumber);
  return range.start;
}

/**
 * Get the end date of a week
 */
export function getWeekEnd(weekNumber: number): Date {
  const range = getWeekRange(weekNumber);
  return range.end;
}

/**
 * Determine task status based on week comparison
 */
export function getTaskStatus(taskWeek: number, currentWeek: number = getCurrentProjectWeek()): 'past' | 'current' | 'future' {
  if (taskWeek < currentWeek) return 'past';
  if (taskWeek === currentWeek) return 'current';
  return 'future';
}

/**
 * Check if a task should be highlighted as current
 */
export function isCurrentTask(taskWeek: number): boolean {
  return getTaskStatus(taskWeek) === 'current';
}

/**
 * Check if a task is completed (in the past)
 */
export function isCompletedTask(taskWeek: number): boolean {
  return getTaskStatus(taskWeek) === 'past';
}

/**
 * Check if a task is upcoming
 */
export function isFutureTask(taskWeek: number): boolean {
  return getTaskStatus(taskWeek) === 'future';
}

/**
 * Get a human-readable status label
 */
export function getTaskStatusLabel(taskWeek: number, language: 'es' | 'en' = 'en'): string {
  const status = getTaskStatus(taskWeek);
  const labels = {
    past: { es: 'Completada', en: 'Completed' },
    current: { es: 'En Curso', en: 'In Progress' },
    future: { es: 'Pendiente', en: 'Upcoming' }
  };
  return labels[status][language];
}