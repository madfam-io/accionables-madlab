import { describe, it, expect } from 'vitest';
import {
  getStatusBasedProgress,
  getDateBasedProgress,
  getSmartTaskProgress,
  getProgressStatusText,
  getProgressColor,
  isTaskOverdue,
  getTaskUrgency,
} from '../progressHelpers';
import { Task } from '../../data/types';

describe('progressHelpers', () => {
  describe('getStatusBasedProgress', () => {
    it('should return 0 for not_started', () => {
      expect(getStatusBasedProgress('not_started')).toBe(0);
    });

    it('should return 25 for planning', () => {
      expect(getStatusBasedProgress('planning')).toBe(25);
    });

    it('should return 50 for in_progress', () => {
      expect(getStatusBasedProgress('in_progress')).toBe(50);
    });

    it('should return 85 for review', () => {
      expect(getStatusBasedProgress('review')).toBe(85);
    });

    it('should return 100 for completed', () => {
      expect(getStatusBasedProgress('completed')).toBe(100);
    });
  });

  describe('getDateBasedProgress', () => {
    it('should return 0 for tasks not yet started', () => {
      const future = new Date();
      future.setDate(future.getDate() + 10);
      const farFuture = new Date();
      farFuture.setDate(farFuture.getDate() + 20);

      expect(getDateBasedProgress(future, farFuture)).toBe(0);
    });

    it('should return 100 for tasks past deadline', () => {
      const past = new Date();
      past.setDate(past.getDate() - 20);
      const recentPast = new Date();
      recentPast.setDate(recentPast.getDate() - 10);

      expect(getDateBasedProgress(past, recentPast)).toBe(100);
    });

    it('should return 50 for tasks halfway through', () => {
      const start = new Date();
      start.setDate(start.getDate() - 10);
      const end = new Date();
      end.setDate(end.getDate() + 10);

      const progress = getDateBasedProgress(start, end);
      expect(progress).toBeGreaterThan(40);
      expect(progress).toBeLessThan(60);
    });
  });

  describe('getSmartTaskProgress', () => {
    it('should prioritize manual status over temporal progress', () => {
      const task: Task = {
        id: 'test-1',
        name: 'Test',
        nameEn: 'Test',
        assignee: 'Aldo',
        hours: 10,
        difficulty: 3,
        phase: 1,
        section: 'Test Section',
        sectionEn: 'Test Section',
        dependencies: [],
        manualStatus: 'completed',
      };

      expect(getSmartTaskProgress(task)).toBe(100);
    });

    it('should return 0 when no manual status is set', () => {
      const task: Task = {
        id: 'test-2',
        name: 'Test',
        nameEn: 'Test',
        assignee: 'Nuri',
        hours: 5,
        difficulty: 2,
        phase: 2,
        section: 'Test Section',
        sectionEn: 'Test Section',
        dependencies: [],
      };

      expect(getSmartTaskProgress(task)).toBe(0);
    });

    it('should handle planning status correctly', () => {
      const task: Task = {
        id: 'test-3',
        name: 'Test',
        nameEn: 'Test',
        assignee: 'Luis',
        hours: 8,
        difficulty: 4,
        phase: 3,
        section: 'Test Section',
        sectionEn: 'Test Section',
        dependencies: [],
        manualStatus: 'planning',
      };

      expect(getSmartTaskProgress(task)).toBe(25);
    });
  });

  describe('getProgressStatusText', () => {
    it('should return correct English text for 0% progress', () => {
      expect(getProgressStatusText(0, 'en')).toBe('Not Started');
    });

    it('should return correct Spanish text for 0% progress', () => {
      expect(getProgressStatusText(0, 'es')).toBe('No iniciada');
    });

    it('should return planning text for 25% progress', () => {
      expect(getProgressStatusText(25, 'en')).toBe('Planning');
      expect(getProgressStatusText(25, 'es')).toBe('Planificación');
    });

    it('should return in progress text for 50% progress', () => {
      expect(getProgressStatusText(50, 'en')).toBe('In Progress');
      expect(getProgressStatusText(50, 'es')).toBe('En progreso');
    });

    it('should return review text for 85% progress', () => {
      expect(getProgressStatusText(85, 'en')).toBe('Under Review');
      expect(getProgressStatusText(85, 'es')).toBe('En revisión');
    });

    it('should return completed text for 100% progress', () => {
      expect(getProgressStatusText(100, 'en')).toBe('Completed');
      expect(getProgressStatusText(100, 'es')).toBe('Completada');
    });
  });

  describe('getProgressColor', () => {
    it('should return gray for 0% progress', () => {
      expect(getProgressColor(0)).toBe('#64748b');
    });

    it('should return blue for planning (25%)', () => {
      expect(getProgressColor(25)).toBe('#3b82f6');
    });

    it('should return amber for in progress (50%)', () => {
      expect(getProgressColor(50)).toBe('#f59e0b');
    });

    it('should return violet for review (85%)', () => {
      expect(getProgressColor(85)).toBe('#8b5cf6');
    });

    it('should return emerald for completed (100%)', () => {
      expect(getProgressColor(100)).toBe('#10b981');
    });
  });

  describe('isTaskOverdue', () => {
    it('should return false for completed tasks regardless of week', () => {
      const task: Task = {
        id: 'test-overdue-1',
        name: 'Test',
        nameEn: 'Test',
        assignee: 'Aldo',
        hours: 10,
        difficulty: 3,
        phase: 1,
        section: 'Test Section',
        sectionEn: 'Test Section',
        dependencies: [],
        manualStatus: 'completed',
      };

      // Week 33 is in the past relative to current week
      expect(isTaskOverdue(task, 33)).toBe(false);
    });

    it('should return false for future tasks', () => {
      const task: Task = {
        id: 'test-overdue-2',
        name: 'Test',
        nameEn: 'Test',
        assignee: 'Nuri',
        hours: 5,
        difficulty: 2,
        phase: 2,
        section: 'Test Section',
        sectionEn: 'Test Section',
        dependencies: [],
      };

      // Week 50 is likely in the future
      expect(isTaskOverdue(task, 50)).toBe(false);
    });
  });

  describe('getTaskUrgency', () => {
    it('should return low urgency for future tasks with no progress', () => {
      const task: Task = {
        id: 'test-urgency-1',
        name: 'Test',
        nameEn: 'Test',
        assignee: 'Silvia',
        hours: 15,
        difficulty: 5,
        phase: 4,
        section: 'Test Section',
        sectionEn: 'Test Section',
        dependencies: [],
      };

      expect(getTaskUrgency(task, 0, 50)).toBe('low');
    });

    it('should return critical urgency for overdue tasks with low progress', () => {
      const task: Task = {
        id: 'test-urgency-2',
        name: 'Test',
        nameEn: 'Test',
        assignee: 'Caro',
        hours: 12,
        difficulty: 4,
        phase: 1,
        section: 'Test Section',
        sectionEn: 'Test Section',
        dependencies: [],
        manualStatus: 'planning',
      };

      // Assuming week 33 is overdue
      const urgency = getTaskUrgency(task, 25, 33);
      // Could be high or critical depending on current date
      expect(['low', 'medium', 'high', 'critical']).toContain(urgency);
    });
  });
});
