/**
 * Intelligent task scheduling that respects dependencies and balances workload
 */

import { Task } from '../data/types';

interface ScheduledTask {
  taskId: string;
  weekNumber: number;
  dependencies: string[];
  hours: number;
  difficulty: number;
  section: string;
}

interface WeekCapacity {
  weekNumber: number;
  currentHours: number;
  currentTasks: number;
  maxHours: number; // Target max hours per week
}

/**
 * Calculate optimal week assignment for tasks within a phase
 * Considers dependencies, workload balancing, and logical grouping
 */
export function calculateOptimalTaskWeek(
  task: Task,
  allPhaseTasks: Task[],
  phaseWeekRange: { start: number; end: number }
): number {
  // Build dependency graph and schedule
  const scheduled = scheduleTasksWithDependencies(allPhaseTasks, phaseWeekRange);
  const taskSchedule = scheduled.find(s => s.taskId === task.id);
  
  return taskSchedule?.weekNumber || phaseWeekRange.start;
}

/**
 * Schedule all tasks in a phase respecting dependencies and balancing workload
 */
function scheduleTasksWithDependencies(
  tasks: Task[],
  weekRange: { start: number; end: number }
): ScheduledTask[] {
  const scheduled: ScheduledTask[] = [];
  const taskMap = new Map(tasks.map(t => [t.id, t]));
  
  // Initialize week capacities
  const weekCapacities: WeekCapacity[] = [];
  const totalWeeks = weekRange.end - weekRange.start + 1;
  const totalHours = tasks.reduce((sum, t) => sum + t.hours, 0);
  const avgHoursPerWeek = Math.ceil(totalHours / totalWeeks);
  
  for (let week = weekRange.start; week <= weekRange.end; week++) {
    weekCapacities.push({
      weekNumber: week,
      currentHours: 0,
      currentTasks: 0,
      maxHours: avgHoursPerWeek * 1.3 // Allow 30% overflow
    });
  }
  
  // Topological sort to respect dependencies
  const sorted = topologicalSort(tasks);
  
  // Group tasks by section for better cohesion
  const sections = groupBySection(sorted);
  
  // Schedule each section
  sections.forEach(sectionTasks => {
    scheduleSectionTasks(sectionTasks, weekCapacities, weekRange, scheduled, taskMap);
  });
  
  return scheduled;
}

/**
 * Topological sort to order tasks by dependencies
 */
function topologicalSort(tasks: Task[]): Task[] {
  const visited = new Set<string>();
  const sorted: Task[] = [];
  const taskMap = new Map(tasks.map(t => [t.id, t]));
  
  function visit(task: Task) {
    if (visited.has(task.id)) return;
    visited.add(task.id);
    
    // Visit dependencies first
    task.dependencies.forEach(depId => {
      const depTask = taskMap.get(depId);
      if (depTask && !visited.has(depId)) {
        visit(depTask);
      }
    });
    
    sorted.push(task);
  }
  
  // Start with tasks that have no dependencies
  const roots = tasks.filter(t => t.dependencies.length === 0);
  roots.forEach(visit);
  
  // Then visit remaining tasks
  tasks.forEach(t => {
    if (!visited.has(t.id)) {
      visit(t);
    }
  });
  
  return sorted;
}

/**
 * Group tasks by section (e.g., 1.1, 1.2, etc.)
 */
function groupBySection(tasks: Task[]): Task[][] {
  const sections = new Map<string, Task[]>();
  
  tasks.forEach(task => {
    const section = task.id.substring(0, 3);
    if (!sections.has(section)) {
      sections.set(section, []);
    }
    sections.get(section)!.push(task);
  });
  
  return Array.from(sections.values());
}

/**
 * Schedule tasks from a section, respecting dependencies and balancing load
 */
function scheduleSectionTasks(
  sectionTasks: Task[],
  weekCapacities: WeekCapacity[],
  weekRange: { start: number; end: number },
  scheduled: ScheduledTask[],
  taskMap: Map<string, Task>
) {
  sectionTasks.forEach(task => {
    // Find earliest week that satisfies dependencies
    let earliestWeek = weekRange.start;
    
    // Check dependency constraints
    task.dependencies.forEach(depId => {
      const depSchedule = scheduled.find(s => s.taskId === depId);
      if (depSchedule) {
        // Task must be after its dependency
        earliestWeek = Math.max(earliestWeek, depSchedule.weekNumber);
        
        // If dependency is in the same week, try next week for better separation
        const depTask = taskMap.get(depId);
        if (depTask && depTask.hours >= 4) {
          // For substantial dependencies, ensure at least same week or later
          earliestWeek = Math.max(earliestWeek, depSchedule.weekNumber);
        }
      }
    });
    
    // Find best week considering workload balance
    let bestWeek = findBestWeek(
      earliestWeek,
      weekRange.end,
      task.hours,
      weekCapacities
    );
    
    // Update capacity
    const weekCapacity = weekCapacities.find(w => w.weekNumber === bestWeek);
    if (weekCapacity) {
      weekCapacity.currentHours += task.hours;
      weekCapacity.currentTasks += 1;
    }
    
    // Schedule the task
    scheduled.push({
      taskId: task.id,
      weekNumber: bestWeek,
      dependencies: task.dependencies,
      hours: task.hours,
      difficulty: task.difficulty,
      section: task.id.substring(0, 3)
    });
  });
}

/**
 * Find the best week for a task considering workload balance
 */
function findBestWeek(
  earliestWeek: number,
  latestWeek: number,
  taskHours: number,
  weekCapacities: WeekCapacity[]
): number {
  let bestWeek = earliestWeek;
  let bestScore = Infinity;
  
  for (let week = earliestWeek; week <= latestWeek; week++) {
    const capacity = weekCapacities.find(w => w.weekNumber === week);
    if (!capacity) continue;
    
    // Calculate score (lower is better)
    // Consider current load and how well this task fits
    const loadAfterTask = capacity.currentHours + taskHours;
    const overCapacity = Math.max(0, loadAfterTask - capacity.maxHours);
    
    // Penalize overloaded weeks
    const score = capacity.currentHours + (overCapacity * 2);
    
    // Prefer earlier weeks slightly to maintain flow
    const weekPenalty = (week - earliestWeek) * 0.5;
    
    const totalScore = score + weekPenalty;
    
    if (totalScore < bestScore) {
      bestScore = totalScore;
      bestWeek = week;
    }
  }
  
  return bestWeek;
}

/**
 * Get phase week range based on phase number
 */
export function getPhaseWeekRange(phase: number): { start: number; end: number } {
  const phaseWeeks: Record<number, { start: number; end: number }> = {
    1: { start: 33, end: 36 }, // Aug 11 - Sep 5 (4 weeks)
    2: { start: 37, end: 39 }, // Sep 6 - Sep 25 (3 weeks)
    3: { start: 40, end: 40 }, // Sep 26 - Oct 5 (1.5 weeks)
    4: { start: 41, end: 42 }, // Oct 6 - Oct 20 (2 weeks)
    5: { start: 43, end: 44 }  // Oct 21 - Oct 31 (1.5 weeks)
  };
  
  return phaseWeeks[phase] || { start: 33, end: 33 };
}