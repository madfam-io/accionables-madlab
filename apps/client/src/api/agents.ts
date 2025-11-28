/**
 * AI Agents API Client
 * Client for interacting with MADLAB's AI agent endpoints
 */

import apiClient from './client';

// ============================================================================
// Types
// ============================================================================

export interface BreakdownRequest {
    eventName: string;
    eventDescription: string;
    eventDate: string;
    eventType: 'concert' | 'launch' | 'exam' | 'presentation' | 'retreat' | 'deadline' | 'custom';
    teamSize?: number;
    constraints?: string[];
    preferences?: {
        language?: 'es' | 'en';
        detailLevel?: 'minimal' | 'moderate' | 'detailed';
        includeTimeEstimates?: boolean;
    };
}

export interface GeneratedTask {
    title: string;
    titleEn: string;
    description: string;
    estimatedHours: number;
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    phase: number;
    section: string;
    dependencies: string[];
    daysBeforeEvent: number;
}

export interface GeneratedPhase {
    number: number;
    name: string;
    nameEn: string;
    description: string;
}

export interface BreakdownResponse {
    success: boolean;
    agent: 'fragmento';
    data: {
        tasks: GeneratedTask[];
        phases: GeneratedPhase[];
        warnings: string[];
        totalEstimatedHours: number;
        mock?: boolean;
    };
    usage?: {
        inputTokens: number;
        outputTokens: number;
    };
    mock?: boolean;
}

export interface DraftRequest {
    type: 'update' | 'reminder' | 'handoff' | 'announcement';
    context: string;
    recipients: string[];
    tone?: 'formal' | 'casual' | 'urgent';
    language?: 'es' | 'en';
}

export interface DraftResponse {
    success: boolean;
    agent: 'palabras';
    data: {
        draft: string;
        subject?: string;
        keyPoints: string[];
        alternativeOpenings?: string[];
        tone: string;
        mock?: boolean;
    };
    usage?: {
        inputTokens: number;
        outputTokens: number;
    };
    mock?: boolean;
}

export interface AgentStatus {
    available: boolean;
    aiEnabled: boolean;
    description: string;
}

export interface AgentsStatusResponse {
    success: boolean;
    agents: {
        fragmento: AgentStatus;
        palabras: AgentStatus;
        timely: AgentStatus;
        calma: AgentStatus;
        enfoque: AgentStatus;
        fiesta: AgentStatus;
    };
    configuration: {
        aiProvider: string;
        model: string;
        apiKeyConfigured: boolean;
    };
}

// ============================================================================
// API Methods
// ============================================================================

export const agentsApi = {
    /**
     * Get status of all AI agents
     */
    async getStatus(): Promise<AgentsStatusResponse> {
        const { data } = await apiClient.get<AgentsStatusResponse>('/agents/status');
        return data;
    },

    /**
     * Fragmento: Break down an event into tasks
     */
    async breakdown(request: BreakdownRequest): Promise<BreakdownResponse> {
        const { data } = await apiClient.post<BreakdownResponse>('/agents/breakdown', request);
        return data;
    },

    /**
     * Palabras: Draft a communication
     */
    async draft(request: DraftRequest): Promise<DraftResponse> {
        const { data } = await apiClient.post<DraftResponse>('/agents/draft', request);
        return data;
    },
};

// ============================================================================
// React Query Hooks (optional integration)
// ============================================================================

/**
 * Helper to convert generated tasks to the app's task format
 */
export function convertGeneratedTasksToAppFormat(
    tasks: GeneratedTask[],
    projectId: string,
    eventDate: Date
): Array<{
    projectId: string;
    title: string;
    titleEn: string;
    description: string;
    estimatedHours: number;
    difficulty: string;
    phase: number;
    section: string;
    dependencies: string[];
    startDate: Date;
    endDate: Date;
}> {
    return tasks.map((task) => {
        const endDate = new Date(eventDate);
        endDate.setDate(endDate.getDate() - task.daysBeforeEvent);

        const startDate = new Date(endDate);
        startDate.setHours(startDate.getHours() - task.estimatedHours);

        return {
            projectId,
            title: task.title,
            titleEn: task.titleEn,
            description: task.description,
            estimatedHours: task.estimatedHours,
            difficulty: task.difficulty,
            phase: task.phase,
            section: task.section,
            dependencies: task.dependencies,
            startDate,
            endDate,
        };
    });
}

export default agentsApi;
