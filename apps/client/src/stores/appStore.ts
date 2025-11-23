import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, TaskStatus } from '../data/types';
import { GroupingOption } from '../components/GroupingSelector';
import { groupTasks } from '../utils/taskGrouping';
import { getISOWeek } from '../utils/dateHelpers';
import { getSmartTaskProgress } from '../utils/progressHelpers';

export type Theme = 'auto' | 'light' | 'dark';
export type Language = 'es' | 'en';
export type ViewMode = 'grid' | 'list' | 'gantt';

interface Filters {
  search: string;
  assignee: string;
  difficulty: number | null;
  phase: number | null;
  duration: 'all' | 'short' | 'medium' | 'long';
}

export type TimeScale = 'days' | 'weeks' | 'months';
export type GroupBy = 'phase' | 'assignee' | 'none';

interface AccessibilityPreferences {
  reduceMotion: boolean;
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'x-large';
  announceChanges: boolean;
}

interface GanttConfig {
  timeScale: TimeScale;
  startDate: Date;
  endDate: Date;
  zoomLevel: number;
  showDependencies: boolean;
  groupBy: GroupBy;
  autoScheduling: boolean;
  showCriticalPath: boolean;
}

export interface GanttTask extends Task {
  startDate: Date;
  endDate: Date;
  progress: number;
  criticalPath: boolean;
  predecessors: string[];
  successors: string[];
  milestone: boolean;
  color: string;
}

interface AppState {
  // Theme and language
  theme: Theme;
  language: Language;

  // Accessibility preferences
  accessibilityPreferences: AccessibilityPreferences;

  // View settings
  viewMode: ViewMode;
  collapsedPhases: Set<number>;
  groupingOption: GroupingOption;

  // Filters (UI state only - filtering happens in components now)
  filters: Filters;

  // Current user for permission checks
  currentUser: string;

  // Gantt view configuration
  ganttConfig: GanttConfig;

  // Actions
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setAccessibilityPreference: <K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K]
  ) => void;
  setViewMode: (mode: ViewMode) => void;
  setGroupingOption: (option: GroupingOption) => void;
  togglePhase: (phase: number) => void;
  collapseAll: () => void;
  expandAll: () => void;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  clearFilters: () => void;
  setCurrentUser: (user: string) => void;
  setGanttConfig: (config: Partial<GanttConfig>) => void;
}

/**
 * Utility: Filter tasks based on current filters
 * This is now a pure function that components can call with tasks from React Query
 */
export const filterTasks = (tasks: Task[], filters: Filters): Task[] => {
  return tasks.filter(task => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!task.name.toLowerCase().includes(searchLower) &&
          !task.nameEn.toLowerCase().includes(searchLower) &&
          !task.id.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    // Assignee filter
    if (filters.assignee && filters.assignee !== 'all' && task.assignee !== filters.assignee) {
      return false;
    }

    // Difficulty filter
    if (filters.difficulty && task.difficulty !== filters.difficulty) {
      return false;
    }

    // Phase filter
    if (filters.phase && task.phase !== filters.phase) {
      return false;
    }

    // Duration filter
    if (filters.duration !== 'all') {
      if (filters.duration === 'short' && task.hours > 2) return false;
      if (filters.duration === 'medium' && (task.hours <= 2 || task.hours > 5)) return false;
      if (filters.duration === 'long' && task.hours <= 5) return false;
    }

    return true;
  });
};

/**
 * Refactored App Store - UI State Only
 * Task data is now managed by React Query
 */
export const useAppStore = create(
  persist<AppState>(
    (set) => ({
      // Initial state
      theme: 'auto',
      language: 'es',
      accessibilityPreferences: {
        reduceMotion: typeof window !== 'undefined'
          ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
          : false,
        highContrast: false,
        fontSize: 'normal',
        announceChanges: true,
      },
      viewMode: 'list',
      collapsedPhases: new Set(),
      groupingOption: 'phase' as GroupingOption,
      filters: {
        search: '',
        assignee: 'all',
        difficulty: null,
        phase: null,
        duration: 'all'
      },
      currentUser: 'Aldo', // Default user
      ganttConfig: {
        timeScale: 'weeks' as TimeScale,
        startDate: new Date('2025-08-11'),
        endDate: new Date('2025-10-31'),
        zoomLevel: 1,
        showDependencies: true,
        groupBy: 'phase' as GroupBy,
        autoScheduling: true,
        showCriticalPath: false
      },

      // Actions
      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document
        const root = document.documentElement;
        if (theme === 'auto') {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
          root.setAttribute('data-theme', theme);
        }
      },

      setLanguage: (language) => set({ language }),

      setAccessibilityPreference: (key, value) =>
        set((state) => ({
          accessibilityPreferences: {
            ...state.accessibilityPreferences,
            [key]: value,
          },
        })),

      setViewMode: (viewMode) => set({ viewMode }),

      setGroupingOption: (option) => set({ groupingOption: option }),

      togglePhase: (phase) => set((state) => {
        const newCollapsed = new Set(state.collapsedPhases);
        if (newCollapsed.has(phase)) {
          newCollapsed.delete(phase);
        } else {
          newCollapsed.add(phase);
        }
        return { collapsedPhases: newCollapsed };
      }),

      collapseAll: () => set({ collapsedPhases: new Set([1, 2, 3, 4, 5]) }),

      expandAll: () => set({ collapsedPhases: new Set() }),

      setFilter: (key, value) => set((state) => ({
        filters: { ...state.filters, [key]: value }
      })),

      clearFilters: () => set({
        filters: {
          search: '',
          assignee: 'all',
          difficulty: null,
          phase: null,
          duration: 'all'
        }
      }),

      setCurrentUser: (user: string) => set({ currentUser: user }),

      setGanttConfig: (config: Partial<GanttConfig>) => set((state) => ({
        ganttConfig: { ...state.ganttConfig, ...config }
      })),
    }),
    {
      name: 'madlab-storage',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        viewMode: state.viewMode,
        collapsedPhases: Array.from(state.collapsedPhases) as any,
        filters: state.filters,
        ganttConfig: state.ganttConfig,
      }) as any,
      onRehydrateStorage: () => (state) => {
        if (state && state.collapsedPhases) {
          // Convert array back to Set after rehydration
          const phases = state.collapsedPhases as any;
          state.collapsedPhases = new Set(Array.isArray(phases) ? phases : []);
        }
      }
    }
  )
);

// Export Gantt scheduling utilities for use in Gantt components
export { getISOWeek, getSmartTaskProgress };
