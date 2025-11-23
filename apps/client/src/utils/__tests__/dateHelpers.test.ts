import { describe, it, expect } from 'vitest';
import {
  PROJECT_CONFIG,
  getISOWeek,
  getCurrentProjectWeek,
  calculateTaskWeek,
  getWeekRange,
  formatWeekWithDates,
  getWeekStart,
  getWeekEnd,
  getTaskStatus,
  isCurrentTask,
  isCompletedTask,
  isFutureTask,
  getTaskStatusLabel,
} from '../dateHelpers';

describe('dateHelpers', () => {
  describe('PROJECT_CONFIG', () => {
    it('should have correct project start date', () => {
      expect(PROJECT_CONFIG.startDate.getFullYear()).toBe(2025);
      expect(PROJECT_CONFIG.startDate.getMonth()).toBe(7); // August (0-indexed)
      expect(PROJECT_CONFIG.startDate.getDate()).toBe(11);
    });

    it('should have correct project end date', () => {
      expect(PROJECT_CONFIG.endDate.getFullYear()).toBe(2025);
      expect(PROJECT_CONFIG.endDate.getMonth()).toBe(9); // October (0-indexed)
      expect(PROJECT_CONFIG.endDate.getDate()).toBe(31);
    });

    it('should have 5 phases', () => {
      expect(PROJECT_CONFIG.phases).toHaveLength(5);
    });

    it('should have consecutive phase numbers', () => {
      PROJECT_CONFIG.phases.forEach((phase, index) => {
        expect(phase.number).toBe(index + 1);
      });
    });
  });

  describe('getISOWeek', () => {
    it('should return correct week number for known dates', () => {
      // January 1, 2025 is in week 1
      const jan1 = new Date(2025, 0, 1);
      expect(getISOWeek(jan1)).toBe(1);
    });

    it('should return correct week number for project start', () => {
      const projectStart = new Date(2025, 7, 11);
      expect(getISOWeek(projectStart)).toBe(33);
    });

    it('should handle year boundaries correctly', () => {
      // December 30, 2024 might be in week 1 of 2025 (ISO week date)
      const dec30 = new Date(2024, 11, 30);
      const week = getISOWeek(dec30);
      expect(week).toBeGreaterThan(0);
      expect(week).toBeLessThan(54);
    });
  });

  describe('getCurrentProjectWeek', () => {
    it('should return a valid week number', () => {
      const currentWeek = getCurrentProjectWeek();
      expect(currentWeek).toBeGreaterThan(0);
      expect(currentWeek).toBeLessThan(54);
    });
  });

  describe('calculateTaskWeek', () => {
    it('should return start week for phase 1, first task', () => {
      expect(calculateTaskWeek(1, 0, 5)).toBe(33);
    });

    it('should return start week for phase 2, first task', () => {
      expect(calculateTaskWeek(2, 0, 3)).toBe(37);
    });

    it('should return start week for phase 3, first task', () => {
      expect(calculateTaskWeek(3, 0, 2)).toBe(40);
    });

    it('should return start week for phase 4, first task', () => {
      expect(calculateTaskWeek(4, 0, 4)).toBe(41);
    });

    it('should return start week for phase 5, first task', () => {
      expect(calculateTaskWeek(5, 0, 3)).toBe(43);
    });

    it('should distribute tasks across phase duration', () => {
      // Phase 1 has 4 weeks (33-36)
      const firstTask = calculateTaskWeek(1, 0, 4);
      const lastTask = calculateTaskWeek(1, 3, 4);

      expect(firstTask).toBe(33);
      expect(lastTask).toBeLessThanOrEqual(36);
      expect(lastTask).toBeGreaterThan(firstTask);
    });

    it('should handle single task in phase', () => {
      expect(calculateTaskWeek(1, 0, 1)).toBe(33);
      expect(calculateTaskWeek(2, 0, 1)).toBe(37);
    });

    it('should handle invalid phase gracefully', () => {
      expect(calculateTaskWeek(999, 0, 1)).toBe(PROJECT_CONFIG.startWeek);
    });
  });

  describe('getWeekRange', () => {
    it('should return correct range for week 33 (project start)', () => {
      const range = getWeekRange(33);

      expect(range.start.getFullYear()).toBe(2025);
      expect(range.start.getMonth()).toBe(7); // August
      expect(range.start.getDate()).toBe(11);
    });

    it('should calculate 7-day range', () => {
      const range = getWeekRange(33);
      const daysDiff = Math.round(
        (range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24)
      );

      expect(daysDiff).toBe(6); // 7 days inclusive = 6 days difference
    });

    it('should have formatted dates', () => {
      const range = getWeekRange(33);

      expect(range.startFormatted).toBeDefined();
      expect(range.endFormatted).toBeDefined();
      expect(typeof range.startFormatted).toBe('string');
      expect(typeof range.endFormatted).toBe('string');
    });
  });

  describe('formatWeekWithDates', () => {
    it('should format week with date range', () => {
      const formatted = formatWeekWithDates(33);

      expect(formatted).toContain('Week 33');
      expect(formatted).toContain('Aug');
      expect(formatted).toContain('-');
    });

    it('should return empty string for falsy week', () => {
      expect(formatWeekWithDates(0)).toBe('');
    });
  });

  describe('getWeekStart and getWeekEnd', () => {
    it('should return start date for week', () => {
      const start = getWeekStart(33);

      expect(start.getFullYear()).toBe(2025);
      expect(start.getMonth()).toBe(7);
      expect(start.getDate()).toBe(11);
    });

    it('should return end date for week', () => {
      const end = getWeekEnd(33);
      const start = getWeekStart(33);

      const daysDiff = Math.round(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );

      expect(daysDiff).toBe(6);
    });
  });

  describe('getTaskStatus', () => {
    it('should return past for tasks before current week', () => {
      expect(getTaskStatus(33, 40)).toBe('past');
    });

    it('should return current for tasks in current week', () => {
      expect(getTaskStatus(40, 40)).toBe('current');
    });

    it('should return future for tasks after current week', () => {
      expect(getTaskStatus(45, 40)).toBe('future');
    });
  });

  describe('isCurrentTask', () => {
    it('should return true for current week tasks', () => {
      const currentWeek = getCurrentProjectWeek();
      expect(isCurrentTask(currentWeek)).toBe(true);
    });

    it('should return false for past week tasks', () => {
      const currentWeek = getCurrentProjectWeek();
      expect(isCurrentTask(currentWeek - 5)).toBe(false);
    });
  });

  describe('isCompletedTask', () => {
    it('should return true for past week tasks', () => {
      const currentWeek = getCurrentProjectWeek();
      expect(isCompletedTask(currentWeek - 5)).toBe(true);
    });

    it('should return false for current week tasks', () => {
      const currentWeek = getCurrentProjectWeek();
      expect(isCompletedTask(currentWeek)).toBe(false);
    });
  });

  describe('isFutureTask', () => {
    it('should return true for future week tasks', () => {
      const currentWeek = getCurrentProjectWeek();
      expect(isFutureTask(currentWeek + 5)).toBe(true);
    });

    it('should return false for current week tasks', () => {
      const currentWeek = getCurrentProjectWeek();
      expect(isFutureTask(currentWeek)).toBe(false);
    });
  });

  describe('getTaskStatusLabel', () => {
    it('should return correct English labels', () => {
      const currentWeek = getCurrentProjectWeek();

      expect(getTaskStatusLabel(currentWeek - 5, 'en')).toBe('Completed');
      expect(getTaskStatusLabel(currentWeek, 'en')).toBe('In Progress');
      expect(getTaskStatusLabel(currentWeek + 5, 'en')).toBe('Upcoming');
    });

    it('should return correct Spanish labels', () => {
      const currentWeek = getCurrentProjectWeek();

      expect(getTaskStatusLabel(currentWeek - 5, 'es')).toBe('Completada');
      expect(getTaskStatusLabel(currentWeek, 'es')).toBe('En Curso');
      expect(getTaskStatusLabel(currentWeek + 5, 'es')).toBe('Pendiente');
    });

    it('should default to English when no language specified', () => {
      const currentWeek = getCurrentProjectWeek();
      const label = getTaskStatusLabel(currentWeek);

      expect(['Completed', 'In Progress', 'Upcoming']).toContain(label);
    });
  });
});
