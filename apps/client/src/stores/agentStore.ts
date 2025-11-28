import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  AgentType,
  AgentState,
  AgentSuggestion,
  AgentInteraction,
  FocusSession,
  FocusSessionConfig,
  ScheduledReminder,
  OverwhelmDetection,
  AGENT_PERSONALITIES,
} from '../types/agents';

interface AgentStoreState extends AgentState {
  // Focus session configuration
  focusConfig: FocusSessionConfig;

  // Actions
  toggleAgent: (agentType: AgentType) => void;
  enableAgent: (agentType: AgentType) => void;
  disableAgent: (agentType: AgentType) => void;

  // Suggestion management
  addSuggestion: (suggestion: Omit<AgentSuggestion, 'id' | 'createdAt' | 'acknowledged'>) => string;
  dismissSuggestion: (suggestionId: string) => void;
  acknowledgeSuggestion: (suggestionId: string) => void;
  snoozeSuggestion: (suggestionId: string, minutes: number) => void;
  clearAllSuggestions: () => void;
  getSuggestionsByAgent: (agentType: AgentType) => AgentSuggestion[];
  getActiveSuggestions: () => AgentSuggestion[];

  // Focus session management
  startFocusSession: (taskId?: string, durationMinutes?: number) => void;
  endFocusSession: (completionPercentage: number) => void;
  pauseFocusSession: () => void;
  resumeFocusSession: () => void;
  recordDistraction: () => void;
  setFocusConfig: (config: Partial<FocusSessionConfig>) => void;

  // Reminder management
  scheduleReminder: (reminder: Omit<ScheduledReminder, 'id' | 'delivered'>) => string;
  dismissReminder: (reminderId: string) => void;
  snoozeReminder: (reminderId: string, minutes: number) => void;
  getUpcomingReminders: () => ScheduledReminder[];

  // Overwhelm detection
  recordOverwhelmDetection: (detection: OverwhelmDetection) => void;
  clearOverwhelmDetection: () => void;

  // Interaction history
  recordInteraction: (
    suggestionId: string,
    agentType: AgentType,
    action: AgentInteraction['action'],
    feedback?: AgentInteraction['feedback']
  ) => void;
  getAgentEffectiveness: (agentType: AgentType) => number;
}

const DEFAULT_FOCUS_CONFIG: FocusSessionConfig = {
  type: 'pomodoro',
  workDurationMinutes: 25,
  breakDurationMinutes: 5,
  longBreakAfterSessions: 4,
  longBreakDurationMinutes: 15,
  autoStartBreaks: true,
  autoStartNextSession: false,
  playSound: true,
  showNotification: true,
};

export const useAgentStore = create(
  persist<AgentStoreState>(
    (set, get) => ({
      // Initial state
      activeAgents: new Set(['breakdown', 'reminder', 'calm'] as AgentType[]),
      suggestions: [],
      currentFocusSession: null,
      scheduledReminders: [],
      lastOverwhelmDetection: null,
      interactionHistory: [],
      focusConfig: DEFAULT_FOCUS_CONFIG,

      // Agent toggle
      toggleAgent: (agentType) =>
        set((state) => {
          const newActive = new Set(state.activeAgents);
          if (newActive.has(agentType)) {
            newActive.delete(agentType);
          } else {
            newActive.add(agentType);
          }
          return { activeAgents: newActive };
        }),

      enableAgent: (agentType) =>
        set((state) => {
          const newActive = new Set(state.activeAgents);
          newActive.add(agentType);
          return { activeAgents: newActive };
        }),

      disableAgent: (agentType) =>
        set((state) => {
          const newActive = new Set(state.activeAgents);
          newActive.delete(agentType);
          return { activeAgents: newActive };
        }),

      // Suggestions
      addSuggestion: (suggestion) => {
        const id = `suggestion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newSuggestion: AgentSuggestion = {
          ...suggestion,
          id,
          createdAt: new Date(),
          acknowledged: false,
        };

        set((state) => ({
          suggestions: [...state.suggestions, newSuggestion],
        }));

        return id;
      },

      dismissSuggestion: (suggestionId) =>
        set((state) => ({
          suggestions: state.suggestions.filter((s) => s.id !== suggestionId),
        })),

      acknowledgeSuggestion: (suggestionId) =>
        set((state) => ({
          suggestions: state.suggestions.map((s) =>
            s.id === suggestionId ? { ...s, acknowledged: true } : s
          ),
        })),

      snoozeSuggestion: (suggestionId, minutes) => {
        const state = get();
        const suggestion = state.suggestions.find((s) => s.id === suggestionId);
        if (suggestion) {
          get().recordInteraction(suggestionId, suggestion.agentType, 'snoozed');
          set((state) => ({
            suggestions: state.suggestions.filter((s) => s.id !== suggestionId),
          }));
          // Re-add after snooze time (in a real app, this would use a scheduler)
          setTimeout(
            () => {
              set((state) => ({
                suggestions: [...state.suggestions, { ...suggestion, createdAt: new Date() }],
              }));
            },
            minutes * 60 * 1000
          );
        }
      },

      clearAllSuggestions: () => set({ suggestions: [] }),

      getSuggestionsByAgent: (agentType) => {
        return get().suggestions.filter((s) => s.agentType === agentType);
      },

      getActiveSuggestions: () => {
        return get().suggestions.filter((s) => !s.acknowledged);
      },

      // Focus sessions
      startFocusSession: (taskId, durationMinutes) => {
        const config = get().focusConfig;
        const session: FocusSession = {
          id: `focus-${Date.now()}`,
          type: config.type,
          taskId,
          startedAt: new Date(),
          plannedDurationMinutes: durationMinutes || config.workDurationMinutes,
          breaks: [],
          distractionCount: 0,
          completionPercentage: 0,
        };
        set({ currentFocusSession: session });
      },

      endFocusSession: (completionPercentage) =>
        set((state) => {
          if (!state.currentFocusSession) return state;
          return {
            currentFocusSession: {
              ...state.currentFocusSession,
              actualEndedAt: new Date(),
              completionPercentage,
            },
          };
        }),

      pauseFocusSession: () =>
        set((state) => {
          if (!state.currentFocusSession) return state;
          return {
            currentFocusSession: {
              ...state.currentFocusSession,
              breaks: [
                ...state.currentFocusSession.breaks,
                { startedAt: new Date(), type: 'unscheduled' },
              ],
            },
          };
        }),

      resumeFocusSession: () =>
        set((state) => {
          if (!state.currentFocusSession) return state;
          const breaks = [...state.currentFocusSession.breaks];
          const lastBreak = breaks[breaks.length - 1];
          if (lastBreak && !lastBreak.endedAt) {
            breaks[breaks.length - 1] = { ...lastBreak, endedAt: new Date() };
          }
          return {
            currentFocusSession: { ...state.currentFocusSession, breaks },
          };
        }),

      recordDistraction: () =>
        set((state) => {
          if (!state.currentFocusSession) return state;
          return {
            currentFocusSession: {
              ...state.currentFocusSession,
              distractionCount: state.currentFocusSession.distractionCount + 1,
            },
          };
        }),

      setFocusConfig: (config) =>
        set((state) => ({
          focusConfig: { ...state.focusConfig, ...config },
        })),

      // Reminders
      scheduleReminder: (reminder) => {
        const id = `reminder-${Date.now()}`;
        const newReminder: ScheduledReminder = {
          ...reminder,
          id,
          delivered: false,
        };
        set((state) => ({
          scheduledReminders: [...state.scheduledReminders, newReminder],
        }));
        return id;
      },

      dismissReminder: (reminderId) =>
        set((state) => ({
          scheduledReminders: state.scheduledReminders.filter((r) => r.id !== reminderId),
        })),

      snoozeReminder: (reminderId, minutes) =>
        set((state) => ({
          scheduledReminders: state.scheduledReminders.map((r) =>
            r.id === reminderId
              ? { ...r, snoozedUntil: new Date(Date.now() + minutes * 60 * 1000) }
              : r
          ),
        })),

      getUpcomingReminders: () => {
        const now = new Date();
        return get()
          .scheduledReminders.filter((r) => {
            if (r.delivered) return false;
            if (r.snoozedUntil && r.snoozedUntil > now) return false;
            return true;
          })
          .sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime());
      },

      // Overwhelm detection
      recordOverwhelmDetection: (detection) =>
        set({ lastOverwhelmDetection: detection }),

      clearOverwhelmDetection: () =>
        set({ lastOverwhelmDetection: null }),

      // Interactions
      recordInteraction: (suggestionId, agentType, action, feedback) => {
        const interaction: AgentInteraction = {
          suggestionId,
          agentType,
          action,
          timestamp: new Date(),
          feedback,
        };
        set((state) => ({
          interactionHistory: [...state.interactionHistory.slice(-100), interaction], // Keep last 100
        }));
      },

      getAgentEffectiveness: (agentType) => {
        const interactions = get().interactionHistory.filter((i) => i.agentType === agentType);
        if (interactions.length === 0) return 0.5; // Neutral if no data

        const accepted = interactions.filter((i) => i.action === 'accepted').length;
        const helpful = interactions.filter((i) => i.feedback === 'helpful').length;
        const annoying = interactions.filter((i) => i.feedback === 'annoying').length;

        // Simple effectiveness score
        const acceptRate = accepted / interactions.length;
        const helpfulBonus = helpful * 0.1;
        const annoyingPenalty = annoying * 0.2;

        return Math.max(0, Math.min(1, acceptRate + helpfulBonus - annoyingPenalty));
      },
    }),
    {
      name: 'madlab-agents',
      partialize: (state) => ({
        activeAgents: Array.from(state.activeAgents) as unknown as Set<AgentType>,
        focusConfig: state.focusConfig,
        interactionHistory: state.interactionHistory.slice(-50), // Only persist last 50
        scheduledReminders: state.scheduledReminders,
      } as AgentStoreState),
      onRehydrateStorage: () => (state) => {
        if (state && state.activeAgents) {
          // Convert array back to Set
          const agents = state.activeAgents as unknown as AgentType[];
          state.activeAgents = new Set(Array.isArray(agents) ? agents : []);
        }
        // Rehydrate dates in reminders
        if (state && state.scheduledReminders) {
          state.scheduledReminders = state.scheduledReminders.map((r) => ({
            ...r,
            scheduledFor: new Date(r.scheduledFor),
            snoozedUntil: r.snoozedUntil ? new Date(r.snoozedUntil) : undefined,
          }));
        }
        // Rehydrate dates in interaction history
        if (state && state.interactionHistory) {
          state.interactionHistory = state.interactionHistory.map((i) => ({
            ...i,
            timestamp: new Date(i.timestamp),
          }));
        }
      },
    }
  )
);

// Helper hook to get agent personality
export function useAgentPersonality(agentType: AgentType) {
  return AGENT_PERSONALITIES[agentType];
}
