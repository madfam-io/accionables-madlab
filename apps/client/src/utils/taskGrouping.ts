/**
 * Utilities for grouping tasks by various criteria
 */

import { Task } from '../data/types';
import { useEnhancedTasks } from '../hooks/useEnhancedTasks';
import { tasks as allTasks } from '../data/tasks';
import { GroupingOption } from '../components/GroupingSelector';
import { calculateOptimalTaskWeek, getPhaseWeekRange } from './taskScheduler';

/**
 * Group tasks by the specified grouping option
 */
export function groupTasks(
  tasks: Task[], 
  groupingOption: GroupingOption,
  language: 'es' | 'en' = 'en'
): Map<string, Task[]> {
  const groupedTasks = new Map<string, Task[]>();
  
  if (groupingOption === 'none') {
    groupedTasks.set('all', tasks);
    return groupedTasks;
  }
  
  // For week grouping, we need enhanced tasks with week numbers
  if (groupingOption === 'week') {
    // This is a workaround since hooks can't be used here
    // In practice, this should be passed from the component
    const enhancedTasks = getEnhancedTasksData(tasks, language);
    
    enhancedTasks.forEach(task => {
      const weekKey = `Week ${task.weekNumber}`;
      if (!groupedTasks.has(weekKey)) {
        groupedTasks.set(weekKey, []);
      }
      // Find original task
      const originalTask = tasks.find(t => t.id === task.id);
      if (originalTask) {
        groupedTasks.get(weekKey)!.push(originalTask);
      }
    });
    
    // Sort by week number
    return new Map([...groupedTasks.entries()].sort((a, b) => {
      const weekA = parseInt(a[0].replace('Week ', ''));
      const weekB = parseInt(b[0].replace('Week ', ''));
      return weekA - weekB;
    }));
  }
  
  tasks.forEach(task => {
    let groupKey: string;
    
    switch (groupingOption) {
      case 'phase':
        groupKey = getPhaseLabel(task.phase, language);
        break;
        
      case 'assignee':
        groupKey = task.assignee;
        break;
        
      case 'difficulty':
        groupKey = getDifficultyLabel(task.difficulty, language);
        break;
        
      default:
        groupKey = 'Unknown';
    }
    
    if (!groupedTasks.has(groupKey)) {
      groupedTasks.set(groupKey, []);
    }
    groupedTasks.get(groupKey)!.push(task);
  });
  
  // Sort groups appropriately
  if (groupingOption === 'phase' || groupingOption === 'difficulty') {
    return new Map([...groupedTasks.entries()].sort((a, b) => {
      // Extract numbers for sorting
      const numA = extractNumber(a[0]);
      const numB = extractNumber(b[0]);
      return numA - numB;
    }));
  }
  
  return groupedTasks;
}

/**
 * Get phase label
 */
function getPhaseLabel(phase: number, language: 'es' | 'en'): string {
  const labels = {
    es: {
      1: 'Fase 1: Fundación',
      2: 'Fase 2: Desarrollo de Contenido',
      3: 'Fase 3: Preparación Piloto',
      4: 'Fase 4: Piloto e Iteración',
      5: 'Fase 5: Listo para Lanzamiento'
    },
    en: {
      1: 'Phase 1: Foundation',
      2: 'Phase 2: Content Development',
      3: 'Phase 3: Pilot Preparation',
      4: 'Phase 4: Pilot & Iteration',
      5: 'Phase 5: Launch Ready'
    }
  };
  
  return labels[language][phase as keyof typeof labels.en] || `Phase ${phase}`;
}

/**
 * Get difficulty label
 */
function getDifficultyLabel(difficulty: number, language: 'es' | 'en'): string {
  const labels = {
    es: {
      1: 'Nivel 1: Muy Fácil',
      2: 'Nivel 2: Fácil',
      3: 'Nivel 3: Medio',
      4: 'Nivel 4: Difícil',
      5: 'Nivel 5: Muy Difícil'
    },
    en: {
      1: 'Level 1: Very Easy',
      2: 'Level 2: Easy',
      3: 'Level 3: Medium',
      4: 'Level 4: Hard',
      5: 'Level 5: Very Hard'
    }
  };
  
  return labels[language][difficulty as keyof typeof labels.en] || `Level ${difficulty}`;
}

/**
 * Extract number from string for sorting
 */
function extractNumber(str: string): number {
  const match = str.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
}

/**
 * Helper to get enhanced tasks data without using hooks
 * This is a simplified version for grouping purposes
 */
function getEnhancedTasksData(tasks: Task[], language: 'es' | 'en') {
  // Group tasks by phase for scheduling
  const tasksByPhase = new Map<number, Task[]>();
  
  tasks.forEach(task => {
    if (!tasksByPhase.has(task.phase)) {
      tasksByPhase.set(task.phase, []);
    }
    tasksByPhase.get(task.phase)!.push(task);
  });
  
  // Calculate week numbers for each task
  return tasks.map(task => {
    const phaseTasks = tasksByPhase.get(task.phase) || [];
    const phaseWeekRange = getPhaseWeekRange(task.phase);
    const weekNumber = calculateOptimalTaskWeek(task, phaseTasks, phaseWeekRange);
    
    return {
      ...task,
      weekNumber
    };
  });
}