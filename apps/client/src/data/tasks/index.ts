import { Task } from '../types';
import { phase1Tasks } from './phase1';
import { phase2Tasks } from './phase2';
import { phase3Tasks } from './phase3';
import { phase4Tasks } from './phase4';
import { phase5Tasks } from './phase5';

// Combine all phase tasks
export const tasks: Task[] = [
  ...phase1Tasks,
  ...phase2Tasks,
  ...phase3Tasks,
  ...phase4Tasks,
  ...phase5Tasks
];

// Helper functions
export const getTasksByPhase = (phase: number): Task[] => {
  return tasks.filter(task => task.phase === phase);
};

export const getTasksByAssignee = (assignee: string): Task[] => {
  return tasks.filter(task => task.assignee === assignee);
};

export const getTaskDependencies = (taskId: string): Task[] => {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return [];
  return tasks.filter(t => task.dependencies.includes(t.id));
};

export const getProjectStats = () => {
  const totalTasks = tasks.length;
  const totalHours = tasks.reduce((sum, task) => sum + task.hours, 0);
  const tasksByPhase = [1, 2, 3, 4, 5].map(phase => ({
    phase,
    count: tasks.filter(t => t.phase === phase).length,
    hours: tasks.filter(t => t.phase === phase).reduce((sum, t) => sum + t.hours, 0)
  }));
  
  const tasksByAssignee = ['Aldo', 'Nuri', 'Luis', 'Silvia', 'Caro', 'All'].map(assignee => ({
    assignee,
    count: tasks.filter(t => t.assignee === assignee).length,
    hours: tasks.filter(t => t.assignee === assignee).reduce((sum, t) => sum + t.hours, 0)
  }));
  
  return {
    totalTasks,
    totalHours,
    tasksByPhase,
    tasksByAssignee
  };
};

// Export individual phase tasks for direct access if needed
export {
  phase1Tasks,
  phase2Tasks,
  phase3Tasks,
  phase4Tasks,
  phase5Tasks
};