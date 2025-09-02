import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, TaskStatus, TaskStatusUpdate } from '../data/types';
import { tasks as allTasks } from '../data/projectData';
import { getSmartTaskProgress } from '../utils/progressHelpers';
import { GroupingOption } from '../components/GroupingSelector';
import { groupTasks } from '../utils/taskGrouping';

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
  
  // View settings
  viewMode: ViewMode;
  collapsedPhases: Set<number>;
  groupingOption: GroupingOption;
  
  // Tasks and filters
  tasks: Task[];
  filters: Filters;
  filteredTasks: Task[];
  groupedTasks: Map<string, Task[]>;
  
  // Task status management
  taskStatuses: Map<string, TaskStatusUpdate>;
  currentUser: string;
  
  // Loading state
  isLoading: boolean;
  loadingMessage?: string;
  
  // Gantt view
  ganttConfig: GanttConfig;
  ganttTasks: GanttTask[];
  
  // Actions
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setViewMode: (mode: ViewMode) => void;
  setGroupingOption: (option: GroupingOption) => void;
  togglePhase: (phase: number) => void;
  collapseAll: () => void;
  expandAll: () => void;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  setLoading: (isLoading: boolean, message?: string) => void;
  
  // Task status actions
  updateTaskStatus: (taskId: string, status: TaskStatus, notes?: string) => void;
  getTaskStatus: (taskId: string) => TaskStatus | null;
  getTaskProgress: (taskId: string, weekNumber?: number) => number;
  setCurrentUser: (user: string) => void;
  
  // Gantt actions
  setGanttConfig: (config: Partial<GanttConfig>) => void;
  scheduleGanttTasks: () => void;
  updateGanttTask: (taskId: string, updates: Partial<GanttTask>) => void;
}

const filterTasks = (tasks: Task[], filters: Filters): Task[] => {
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

// Gantt scheduling utilities
const calculateTaskDuration = (task: Task): number => {
  const baseDays = Math.ceil(task.hours / 8);
  const complexityMultiplier = {
    1: 1.0,    // Easy
    2: 1.2,    // Medium
    3: 1.5,    // Hard
    4: 2.0,    // Very Hard
    5: 2.5     // Expert
  }[task.difficulty] || 1.0;
  
  return Math.max(1, Math.ceil(baseDays * complexityMultiplier));
};

const addWorkDays = (startDate: Date, workDays: number): Date => {
  const result = new Date(startDate);
  let daysAdded = 0;
  
  while (daysAdded < workDays) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip weekends
      daysAdded++;
    }
  }
  
  return result;
};

const getTaskColor = (task: Task): string => {
  const colors = {
    1: '#10b981', // emerald-500 - Easy
    2: '#3b82f6', // blue-500 - Medium  
    3: '#f59e0b', // amber-500 - Hard
    4: '#f97316', // orange-500 - Very Hard
    5: '#ef4444'  // red-500 - Expert
  };
  return colors[task.difficulty as keyof typeof colors] || colors[1];
};


// Calculate critical path using CPM (Critical Path Method)
const calculateCriticalPath = (taskMap: Map<string, GanttTask>): Set<string> => {
  const criticalPath = new Set<string>();
  
  // Calculate earliest start and earliest finish for each task
  const earliestTimes = new Map<string, { start: number; finish: number }>();
  const latestTimes = new Map<string, { start: number; finish: number }>();
  
  // Forward pass - calculate earliest times
  const calculateEarliestTimes = (taskId: string, visited: Set<string> = new Set()): number => {
    if (visited.has(taskId)) return earliestTimes.get(taskId)?.finish || 0;
    visited.add(taskId);
    
    const task = taskMap.get(taskId);
    if (!task) return 0;
    
    let earliestStart = 0;
    task.dependencies.forEach(depId => {
      const depFinish = calculateEarliestTimes(depId, visited);
      earliestStart = Math.max(earliestStart, depFinish);
    });
    
    const duration = Math.ceil((task.endDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const earliestFinish = earliestStart + duration;
    
    earliestTimes.set(taskId, { start: earliestStart, finish: earliestFinish });
    return earliestFinish;
  };
  
  // Calculate earliest times for all tasks
  taskMap.forEach((_, taskId) => calculateEarliestTimes(taskId));
  
  // Find project completion time
  let projectEnd = 0;
  earliestTimes.forEach(times => {
    projectEnd = Math.max(projectEnd, times.finish);
  });
  
  // Backward pass - calculate latest times
  const calculateLatestTimes = (taskId: string, visited: Set<string> = new Set()): number => {
    if (visited.has(taskId)) return latestTimes.get(taskId)?.start || projectEnd;
    visited.add(taskId);
    
    const task = taskMap.get(taskId);
    if (!task) return projectEnd;
    
    let latestFinish = projectEnd;
    task.successors.forEach(sucId => {
      const sucStart = calculateLatestTimes(sucId, visited);
      latestFinish = Math.min(latestFinish, sucStart);
    });
    
    const duration = Math.ceil((task.endDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const latestStart = latestFinish - duration;
    
    latestTimes.set(taskId, { start: latestStart, finish: latestFinish });
    return latestStart;
  };
  
  // Calculate latest times for all tasks
  taskMap.forEach((_, taskId) => calculateLatestTimes(taskId));
  
  // Identify critical path - tasks with zero float
  taskMap.forEach((_, taskId) => {
    const earliest = earliestTimes.get(taskId);
    const latest = latestTimes.get(taskId);
    
    if (earliest && latest) {
      const float = latest.start - earliest.start;
      if (float === 0) {
        criticalPath.add(taskId);
      }
    }
  });
  
  return criticalPath;
};

// Manual scheduling - uses step-wise distribution within phases
const manualScheduleProject = (tasks: Task[], projectStart: Date): GanttTask[] => {
  const scheduled: GanttTask[] = [];
  const taskMap = new Map<string, GanttTask>();
  
  // Define phase date constraints for default positioning
  const phaseConstraints: Record<number, { start: Date; end: Date }> = {
    1: { start: new Date('2025-08-11'), end: new Date('2025-09-05') },
    2: { start: new Date('2025-09-06'), end: new Date('2025-09-25') },
    3: { start: new Date('2025-09-26'), end: new Date('2025-10-05') },
    4: { start: new Date('2025-10-06'), end: new Date('2025-10-20') },
    5: { start: new Date('2025-10-21'), end: new Date('2025-10-31') }
  };
  
  // Group tasks by phase for step-wise scheduling
  const tasksByPhase = new Map<number, Task[]>();
  tasks.forEach(task => {
    if (!tasksByPhase.has(task.phase)) {
      tasksByPhase.set(task.phase, []);
    }
    tasksByPhase.get(task.phase)!.push(task);
  });
  
  // Schedule each phase's tasks step-wise
  tasksByPhase.forEach((phaseTasks, phase) => {
    const phaseRange = phaseConstraints[phase];
    if (!phaseRange) return;
    
    const phaseDuration = Math.ceil((phaseRange.end.getTime() - phaseRange.start.getTime()) / (1000 * 60 * 60 * 24));
    const daysPerTask = Math.max(2, Math.floor(phaseDuration / phaseTasks.length));
    
    phaseTasks.forEach((task, index) => {
      // Step-wise: each task starts after the previous one
      const startOffset = index * daysPerTask;
      const startDate = new Date(phaseRange.start);
      startDate.setDate(startDate.getDate() + startOffset);
      
      // Ensure we don't exceed phase boundaries
      if (startDate > phaseRange.end) {
        startDate.setTime(phaseRange.end.getTime());
        startDate.setDate(startDate.getDate() - 2); // Back up 2 days from phase end
      }
      
      const duration = calculateTaskDuration(task);
      let endDate = addWorkDays(startDate, duration);
      
      // Compress if needed to fit within phase
      if (endDate > phaseRange.end) {
        endDate = new Date(phaseRange.end);
      }
      
      const ganttTask: GanttTask = {
        ...task,
        startDate,
        endDate,
        progress: getSmartTaskProgress(task),
        criticalPath: false,
        predecessors: [...task.dependencies],
        successors: [],
        milestone: task.hours === 0,
        color: getTaskColor(task)
      };
      
      taskMap.set(task.id, ganttTask);
      scheduled.push(ganttTask);
    });
  });
  
  // Build successors relationships for proper dependency display
  scheduled.forEach(task => {
    task.dependencies.forEach(depId => {
      const dependency = taskMap.get(depId);
      if (dependency && !dependency.successors.includes(task.id)) {
        dependency.successors.push(task.id);
      }
    });
  });
  
  return scheduled;
};

const scheduleProject = (tasks: Task[], projectStart: Date, showCriticalPath: boolean = false): GanttTask[] => {
  const scheduled: GanttTask[] = [];
  const taskMap = new Map<string, GanttTask>();
  
  // Define phase date constraints
  const phaseConstraints: Record<number, { start: Date; end: Date }> = {
    1: { start: new Date('2025-08-11'), end: new Date('2025-09-05') },
    2: { start: new Date('2025-09-06'), end: new Date('2025-09-25') },
    3: { start: new Date('2025-09-26'), end: new Date('2025-10-05') },
    4: { start: new Date('2025-10-06'), end: new Date('2025-10-20') },
    5: { start: new Date('2025-10-21'), end: new Date('2025-10-31') }
  };
  
  // Create initial gantt tasks
  tasks.forEach(task => {
    const ganttTask: GanttTask = {
      ...task,
      startDate: new Date(projectStart),
      endDate: new Date(projectStart),
      progress: getSmartTaskProgress(task),
      criticalPath: false,
      predecessors: [...task.dependencies],
      successors: [],
      milestone: task.hours === 0,
      color: getTaskColor(task)
    };
    taskMap.set(task.id, ganttTask);
  });
  
  // Topological sort based on dependencies
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const sorted: string[] = [];
  
  const visit = (taskId: string) => {
    if (visited.has(taskId)) return;
    if (visiting.has(taskId)) return; // Circular dependency
    
    visiting.add(taskId);
    const task = taskMap.get(taskId);
    if (task) {
      task.dependencies.forEach(depId => {
        if (taskMap.has(depId)) {
          visit(depId);
        }
      });
    }
    visiting.delete(taskId);
    visited.add(taskId);
    sorted.push(taskId);
  };
  
  Array.from(taskMap.keys()).forEach(visit);
  
  // Group tasks by phase for better scheduling
  const tasksByPhase: Map<number, GanttTask[]> = new Map();
  for (let phase = 1; phase <= 5; phase++) {
    tasksByPhase.set(phase, []);
  }
  sorted.forEach(taskId => {
    const task = taskMap.get(taskId);
    if (task) {
      const phaseTasks = tasksByPhase.get(task.phase) || [];
      phaseTasks.push(task);
      tasksByPhase.set(task.phase, phaseTasks);
    }
  });

  // Schedule tasks phase by phase with step-wise progression
  for (let phase = 1; phase <= 5; phase++) {
    const phaseTasks = tasksByPhase.get(phase) || [];
    const phaseRange = phaseConstraints[phase];
    if (!phaseRange || phaseTasks.length === 0) continue;

    // Calculate available days in phase
    const phaseDurationDays = Math.ceil((phaseRange.end.getTime() - phaseRange.start.getTime()) / (1000 * 60 * 60 * 24));
    
    // Step-wise scheduling: distribute tasks evenly across the phase
    let currentDate = new Date(phaseRange.start);
    let phaseLatestEnd = new Date(phaseRange.start);
    const daysPerTask = Math.max(1, Math.floor(phaseDurationDays / phaseTasks.length));
    
    phaseTasks.forEach((task, index) => {
      // Calculate start date based on step-wise progression
      let earliestStart = new Date(currentDate);
      
      // Check dependencies and adjust if needed
      task.dependencies.forEach(depId => {
        const dependency = taskMap.get(depId);
        if (dependency && dependency.endDate) {
          // If dependency ends after our planned start, adjust
          const depEnd = new Date(dependency.endDate);
          depEnd.setDate(depEnd.getDate() + 1); // Start day after dependency ends
          if (depEnd > earliestStart) {
            earliestStart = depEnd;
          }
        }
      });
      
      // Ensure we don't start before phase begins
      if (earliestStart < phaseRange.start) {
        earliestStart = new Date(phaseRange.start);
      }
      
      // Calculate task duration and end date
      const duration = calculateTaskDuration(task);
      let endDate = addWorkDays(earliestStart, duration);
      
      // Ensure task doesn't exceed phase boundaries
      if (endDate > phaseRange.end) {
        // Compress to fit within phase
        endDate = new Date(phaseRange.end);
        const availableDays = Math.ceil((phaseRange.end.getTime() - earliestStart.getTime()) / (1000 * 60 * 60 * 24));
        if (availableDays <= 0) {
          // If no space, place at phase end with minimal duration
          earliestStart = new Date(phaseRange.end);
          earliestStart.setDate(earliestStart.getDate() - 1);
          endDate = new Date(phaseRange.end);
        }
      }
      
      task.startDate = earliestStart;
      task.endDate = endDate;
      
      // Move current date forward for next task (step-wise)
      currentDate = new Date(endDate);
      currentDate.setDate(currentDate.getDate() + 1);
      
      // Update phase tracking
      if (endDate > phaseLatestEnd) {
        phaseLatestEnd = endDate;
      }
      
      // Dependencies will be processed after all tasks are scheduled
      
      scheduled.push(task);
    });
  }
  
  // Calculate critical path if enabled
  if (showCriticalPath) {
    // Ensure all tasks in taskMap have their successors properly initialized
    taskMap.forEach(task => {
      if (!task.successors) {
        task.successors = [];
      }
    });
    
    // Build successors relationships
    taskMap.forEach(task => {
      task.dependencies.forEach(depId => {
        const dependency = taskMap.get(depId);
        if (dependency && !dependency.successors.includes(task.id)) {
          dependency.successors.push(task.id);
        }
      });
    });
    
    const criticalPathTasks = calculateCriticalPath(taskMap);
    
    console.log('Critical Path Calculation:', {
      totalTasks: taskMap.size,
      criticalTasks: criticalPathTasks.size,
      criticalTaskIds: Array.from(criticalPathTasks)
    });
    
    // Update critical path flag for each task
    scheduled.forEach(task => {
      task.criticalPath = criticalPathTasks.has(task.id);
    });
  }
  
  return scheduled;
};

export const useAppStore = create(
  persist<AppState>(
    (set) => ({
      // Initial state
      theme: 'auto',
      language: 'es',
      viewMode: 'list',
      collapsedPhases: new Set(),
      groupingOption: 'phase' as GroupingOption,
      tasks: allTasks,
      filters: {
        search: '',
        assignee: 'all',
        difficulty: null,
        phase: null,
        duration: 'all'
      },
      filteredTasks: allTasks,
      groupedTasks: new Map([['all', allTasks]]),
      
      // Task status management
      taskStatuses: new Map(),
      currentUser: 'Aldo', // Default user
      
      // Loading state
      isLoading: false,
      loadingMessage: undefined,
      
      // Gantt initial state
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
      ganttTasks: [],
      
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
      
      setViewMode: (viewMode) => set({ viewMode }),
      
      setGroupingOption: (option) => set((state) => {
        const groupedTasks = groupTasks(state.filteredTasks, option, state.language);
        return { groupingOption: option, groupedTasks };
      }),
      
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
      
      setFilter: (key, value) => set((state) => {
        const newFilters = { ...state.filters, [key]: value };
        const filteredTasks = filterTasks(state.tasks, newFilters);
        const groupedTasks = groupTasks(filteredTasks, state.groupingOption, state.language);
        return { filters: newFilters, filteredTasks, groupedTasks };
      }),
      
      clearFilters: () => set((state) => {
        const defaultFilters: Filters = {
          search: '',
          assignee: 'all',
          difficulty: null,
          phase: null,
          duration: 'all'
        };
        return { 
          filters: defaultFilters, 
          filteredTasks: state.tasks 
        };
      }),
      
      applyFilters: () => set((state) => {
        const filteredTasks = filterTasks(state.tasks, state.filters);
        const groupedTasks = groupTasks(filteredTasks, state.groupingOption, state.language);
        return { filteredTasks, groupedTasks };
      }),
      
      setLoading: (isLoading, message) => set(() => ({
        isLoading,
        loadingMessage: message
      })),
      
      // Task status management actions
      updateTaskStatus: (taskId, status, notes) => set((state) => {
        const task = state.tasks.find(t => t.id === taskId);
        if (!task) return state;
        
        // Only assignee or "All" tasks can be updated by anyone
        if (task.assignee !== state.currentUser && task.assignee !== 'All') {
          console.warn(`Only ${task.assignee} can update task ${taskId}`);
          return state;
        }
        
        const newStatuses = new Map(state.taskStatuses);
        newStatuses.set(taskId, {
          status,
          updatedAt: new Date(),
          updatedBy: state.currentUser,
          notes
        });
        
        return { taskStatuses: newStatuses };
      }),
      
      getTaskStatus: (taskId) => {
        const state = useAppStore.getState();
        const statusUpdate = state.taskStatuses.get(taskId);
        return statusUpdate?.status || null;
      },
      
      getTaskProgress: (taskId: string, weekNumber?: number) => {
        const state = useAppStore.getState();
        const task = state.tasks.find(t => t.id === taskId);
        if (!task) return 0;
        
        // Get manual status if set
        const statusUpdate = state.taskStatuses.get(taskId);
        const taskWithStatus = statusUpdate ? 
          { ...task, manualStatus: statusUpdate.status } : task;
        
        return getSmartTaskProgress(taskWithStatus, weekNumber);
      },
      
      setCurrentUser: (user: string) => set({ currentUser: user }),
      
      // Gantt actions
      setGanttConfig: (config: Partial<GanttConfig>) => set((state) => ({
        ganttConfig: { ...state.ganttConfig, ...config }
      })),
      
      scheduleGanttTasks: () => set((state) => {
        // Use auto-scheduling or manual scheduling based on config
        const tasks = state.ganttConfig.autoScheduling
          ? scheduleProject(state.filteredTasks, state.ganttConfig.startDate, state.ganttConfig.showCriticalPath)
          : manualScheduleProject(state.filteredTasks, state.ganttConfig.startDate);
        
        return { ganttTasks: tasks };
      }),
      
      updateGanttTask: (taskId: string, updates: Partial<GanttTask>) => set((state) => ({
        ganttTasks: state.ganttTasks.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        )
      }))
    }),
    {
      name: 'madlab-storage',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        viewMode: state.viewMode,
        collapsedPhases: Array.from(state.collapsedPhases) as any
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