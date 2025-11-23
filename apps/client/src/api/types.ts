/**
 * API Response Types
 * These match the backend Drizzle schema exactly
 */

// API Enums (matching backend)
export type ApiTaskStatus = 'not-started' | 'in-progress' | 'completed' | 'blocked' | 'cancelled';
export type ApiTaskDifficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type ApiProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed' | 'archived';

// API User (from backend users table)
export interface ApiUser {
  id: string;
  januaId: string;
  email: string;
  name: string;
  displayName?: string;
  avatarUrl?: string;
  role?: string;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  lastSeenAt?: string;
}

// API Project (from backend projects table)
export interface ApiProject {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  status: ApiProjectStatus;
  startDate?: string;
  targetEndDate?: string;
  endDate?: string;
  createdBy?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// API Task (from backend tasks table)
export interface ApiTask {
  id: string;
  projectId: string;
  legacyId?: string;
  title: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  status: ApiTaskStatus;
  assigneeId?: string;
  estimatedHours?: number;
  difficulty?: ApiTaskDifficulty;
  phase?: number;
  section?: string;
  sectionEn?: string;
  progress: number;
  actualHours?: number;
  startDate?: string;
  endDate?: string;
  completedAt?: string;
  dependencies: string[];
  metadata?: {
    tags?: string[];
    priority?: 'low' | 'medium' | 'high' | 'critical';
    manualStatus?: string;
    notes?: string;
    section?: string;
    sectionEn?: string;
    statusHistory?: Array<{ status: string; timestamp: string; note?: string }>;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
  // Populated fields from joins
  assignee?: ApiUser;
  project?: ApiProject;
}

// API Response Wrappers
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  error?: string;
}

export interface ApiTasksResponse {
  success: boolean;
  data: ApiTask[];
  count: number;
}

export interface ApiProjectsResponse {
  success: boolean;
  data: (ApiProject & {
    stats?: {
      totalTasks: number;
      memberCount: number;
      tasksByStatus: Record<ApiTaskStatus, number>;
    };
  })[];
}

// Query Parameters
export interface TaskFilters {
  projectId?: string;
  assigneeId?: string;
  status?: ApiTaskStatus;
  phase?: number;
  difficulty?: ApiTaskDifficulty;
}

// Mutation Payloads
export interface CreateTaskPayload {
  projectId: string;
  title: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  status?: ApiTaskStatus;
  assigneeId?: string;
  estimatedHours?: number;
  difficulty?: ApiTaskDifficulty;
  phase?: number;
  dependencies?: string[];
  metadata?: Record<string, any>;
}

export interface UpdateTaskPayload {
  title?: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  status?: ApiTaskStatus;
  assigneeId?: string;
  estimatedHours?: number;
  difficulty?: ApiTaskDifficulty;
  phase?: number;
  progress?: number;
  actualHours?: number;
  startDate?: string;
  endDate?: string;
  dependencies?: string[];
  metadata?: Record<string, any>;
}

export interface BulkUpdateTasksPayload {
  taskIds: string[];
  updates: UpdateTaskPayload;
}
