// Task and team member type definitions

export type TaskStatus = 'not_started' | 'planning' | 'in_progress' | 'review' | 'completed';

export interface TaskStatusUpdate {
  status: TaskStatus;
  updatedAt: Date;
  updatedBy: string;
  notes?: string;
}

export interface Task {
  id: string;
  name: string;
  nameEn: string;
  assignee: string;
  hours: number;
  section: string;
  sectionEn: string;
  phase: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  dependencies: string[];
  // Manual status tracking
  manualStatus?: TaskStatus;
  statusHistory?: TaskStatusUpdate[];
  // Dynamic properties calculated at runtime
  weekNumber?: number;
  weekDisplay?: string;
  status?: 'past' | 'current' | 'future';
}

export interface TeamMember {
  name: string;
  role: string;
  roleEn: string;
  avatar: string;
}

export interface PhaseInfo {
  number: number;
  title: {
    es: string;
    en: string;
  };
  dateRange: string;
  taskCount: number;
}