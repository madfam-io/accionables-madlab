/**
 * Static configuration constants for the MADLAB project.
 *
 * This file consolidates all static reference data used by the UI.
 * Note: Task data is now fetched from the API via React Query hooks.
 */

// Re-export types
export type { TeamMember, PhaseInfo } from '../data/types';

// Re-export team members
export { teamMembers } from '../data/teamMembers';

// Re-export phase definitions and helpers
export { projectPhases, getPhaseTitle } from '../data/phases';

/**
 * Difficulty level options for task filtering and display
 */
export const DIFFICULTY_OPTIONS = [
  { value: 1, label: '⭐', description: 'Easy' },
  { value: 2, label: '⭐⭐', description: 'Medium' },
  { value: 3, label: '⭐⭐⭐', description: 'Hard' },
  { value: 4, label: '⭐⭐⭐⭐', description: 'Very Hard' },
  { value: 5, label: '⭐⭐⭐⭐⭐', description: 'Expert' },
] as const;

/**
 * Duration categories for task filtering
 */
export const DURATION_OPTIONS = {
  short: { max: 4, label: { es: 'Corta', en: 'Short' } },
  medium: { min: 4, max: 8, label: { es: 'Media', en: 'Medium' } },
  long: { min: 8, label: { es: 'Larga', en: 'Long' } },
} as const;

/**
 * Phase numbers for validation and iteration
 */
export const PHASE_NUMBERS = [1, 2, 3, 4, 5] as const;

/**
 * Project metadata
 */
export const PROJECT_INFO = {
  name: 'MADLAB',
  fullName: 'MADLAB - Gamified Science Learning',
  startDate: '2025-08-11',
  endDate: '2025-10-31',
  durationDays: 81,
  targetStudents: { min: 20, max: 100 },
  sessionDuration: 3, // hours
} as const;
