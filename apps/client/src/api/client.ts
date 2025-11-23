/**
 * API Client
 * Axios-based HTTP client for communicating with the MADLAB Fastify backend
 */

import axios, { type AxiosInstance, type AxiosError } from 'axios';
import type {
  ApiResponse,
  ApiTask,
  ApiTasksResponse,
  ApiProject,
  ApiProjectsResponse,
  TaskFilters,
  CreateTaskPayload,
  UpdateTaskPayload,
  BulkUpdateTasksPayload,
} from './types';

// ============================================================================
// Axios Instance Configuration
// ============================================================================

const apiClient: AxiosInstance = axios.create({
  baseURL: '/api', // Proxied by Vite to http://localhost:3001/api
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (for future auth token injection)
apiClient.interceptors.request.use(
  (config) => {
    // TODO: Add JWT token when Janua IdP is integrated
    // const token = localStorage.getItem('auth_token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (for global error handling)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Global error handling
    if (error.response?.status === 401) {
      // TODO: Handle unauthorized (redirect to login)
      console.error('Unauthorized - please log in');
    } else if (error.response?.status === 500) {
      console.error('Server error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ============================================================================
// API Methods
// ============================================================================

/**
 * Health Check
 */
export async function checkHealth(): Promise<{ success: boolean; message: string }> {
  const { data } = await apiClient.get('/health');
  return data;
}

/**
 * Projects API
 */
export const projectsApi = {
  /**
   * Get all projects with statistics
   */
  async getAll(): Promise<ApiProjectsResponse> {
    const { data } = await apiClient.get<ApiProjectsResponse>('/projects');
    return data;
  },

  /**
   * Get single project by ID
   */
  async getById(id: string): Promise<ApiResponse<ApiProject>> {
    const { data } = await apiClient.get<ApiResponse<ApiProject>>(`/projects/${id}`);
    return data;
  },

  /**
   * Create new project
   */
  async create(payload: Partial<ApiProject>): Promise<ApiResponse<ApiProject>> {
    const { data } = await apiClient.post<ApiResponse<ApiProject>>('/projects', payload);
    return data;
  },

  /**
   * Update project
   */
  async update(id: string, payload: Partial<ApiProject>): Promise<ApiResponse<ApiProject>> {
    const { data } = await apiClient.patch<ApiResponse<ApiProject>>(`/projects/${id}`, payload);
    return data;
  },

  /**
   * Delete project
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    const { data } = await apiClient.delete<ApiResponse<void>>(`/projects/${id}`);
    return data;
  },
};

/**
 * Tasks API
 */
export const tasksApi = {
  /**
   * Get all tasks with optional filtering
   */
  async getAll(filters?: TaskFilters): Promise<ApiTasksResponse> {
    const { data } = await apiClient.get<ApiTasksResponse>('/tasks', {
      params: filters,
    });
    return data;
  },

  /**
   * Get single task by ID
   */
  async getById(id: string): Promise<ApiResponse<ApiTask>> {
    const { data } = await apiClient.get<ApiResponse<ApiTask>>(`/tasks/${id}`);
    return data;
  },

  /**
   * Create new task
   */
  async create(payload: CreateTaskPayload): Promise<ApiResponse<ApiTask>> {
    const { data } = await apiClient.post<ApiResponse<ApiTask>>('/tasks', payload);
    return data;
  },

  /**
   * Update task
   */
  async update(id: string, payload: UpdateTaskPayload): Promise<ApiResponse<ApiTask>> {
    const { data } = await apiClient.patch<ApiResponse<ApiTask>>(`/tasks/${id}`, payload);
    return data;
  },

  /**
   * Bulk update multiple tasks
   */
  async bulkUpdate(payload: BulkUpdateTasksPayload): Promise<ApiResponse<ApiTask[]>> {
    const { data } = await apiClient.patch<ApiResponse<ApiTask[]>>('/tasks/bulk', payload);
    return data;
  },

  /**
   * Delete task
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    const { data } = await apiClient.delete<ApiResponse<void>>(`/tasks/${id}`);
    return data;
  },
};

// Export the configured client for custom requests
export default apiClient;
