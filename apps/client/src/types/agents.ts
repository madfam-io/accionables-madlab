/**
 * AI Agent System Types
 *
 * Defines the architecture for ND-aware AI agents that fill executive function gaps.
 * Each agent specializes in a specific cognitive support area.
 */

import { NDProfile } from './ndProfile';
import { Task } from '../data/types';
import { CulminatingEvent } from '../stores/appStore';

// ============================================================================
// AGENT IDENTITY & TYPES
// ============================================================================

export type AgentType =
  | 'breakdown'    // Event → Tasks decomposition
  | 'reminder'     // Time-aware nudges
  | 'draft'        // Communication assistance
  | 'calm'         // Overwhelm detection & support
  | 'focus'        // Focus session facilitation
  | 'celebrate';   // Progress celebration

export interface AgentPersonality {
  /** Display name */
  name: string;
  nameEn: string;
  /** Agent's visual icon/emoji */
  avatar: string;
  /** Personality description */
  description: string;
  descriptionEn: string;
  /** Color theme for UI */
  color: string;
  /** Communication tone */
  tone: 'encouraging' | 'neutral' | 'playful' | 'calm';
}

export const AGENT_PERSONALITIES: Record<AgentType, AgentPersonality> = {
  breakdown: {
    name: 'Fragmento',
    nameEn: 'Fragment',
    avatar: '🧩',
    description: 'Te ayudo a dividir grandes metas en pasos manejables',
    descriptionEn: 'I help break big goals into manageable steps',
    color: '#8b5cf6', // violet
    tone: 'encouraging',
  },
  reminder: {
    name: 'Timely',
    nameEn: 'Timely',
    avatar: '⏰',
    description: 'Cuido que el tiempo no se te escape',
    descriptionEn: 'I make sure time doesn\'t slip away',
    color: '#f59e0b', // amber
    tone: 'playful',
  },
  draft: {
    name: 'Palabras',
    nameEn: 'Words',
    avatar: '✍️',
    description: 'Te ayudo a comunicar lo que piensas',
    descriptionEn: 'I help you communicate what you\'re thinking',
    color: '#10b981', // emerald
    tone: 'neutral',
  },
  calm: {
    name: 'Calma',
    nameEn: 'Calm',
    avatar: '🌊',
    description: 'Detecto cuando necesitas un respiro',
    descriptionEn: 'I detect when you need a breather',
    color: '#06b6d4', // cyan
    tone: 'calm',
  },
  focus: {
    name: 'Enfoque',
    nameEn: 'Focus',
    avatar: '🎯',
    description: 'Te acompaño en sesiones de trabajo profundo',
    descriptionEn: 'I accompany you in deep work sessions',
    color: '#ec4899', // pink
    tone: 'encouraging',
  },
  celebrate: {
    name: 'Fiesta',
    nameEn: 'Party',
    avatar: '🎉',
    description: 'Celebro tus logros, grandes y pequeños',
    descriptionEn: 'I celebrate your achievements, big and small',
    color: '#eab308', // yellow
    tone: 'playful',
  },
};

// ============================================================================
// AGENT SUGGESTIONS & ACTIONS
// ============================================================================

export type SuggestionPriority = 'low' | 'medium' | 'high' | 'urgent';
export type SuggestionCategory =
  | 'task-breakdown'
  | 'time-warning'
  | 'focus-start'
  | 'break-suggestion'
  | 'overwhelm-detected'
  | 'celebration'
  | 'draft-help'
  | 'convergence-alert';

export interface AgentSuggestion {
  id: string;
  agentType: AgentType;
  category: SuggestionCategory;
  priority: SuggestionPriority;
  /** Main message */
  message: string;
  messageEn: string;
  /** Optional detailed explanation */
  detail?: string;
  detailEn?: string;
  /** Available actions */
  actions: SuggestionAction[];
  /** When this suggestion was generated */
  createdAt: Date;
  /** Auto-dismiss after this many seconds (null = manual dismiss only) */
  autoDismissSeconds: number | null;
  /** Has user interacted with this suggestion */
  acknowledged: boolean;
  /** Related task ID if applicable */
  relatedTaskId?: string;
  /** Related event ID if applicable */
  relatedEventId?: string;
}

export interface SuggestionAction {
  id: string;
  label: string;
  labelEn: string;
  /** Action type determines what happens when clicked */
  type: 'dismiss' | 'snooze' | 'accept' | 'custom';
  /** For 'custom' type, this identifies the specific action */
  customAction?: string;
  /** Is this the primary/recommended action */
  primary: boolean;
  /** Icon for the action button */
  icon?: string;
}

// ============================================================================
// BREAKDOWN AGENT SPECIFICS
// ============================================================================

export interface TaskBreakdownRequest {
  /** The goal or event to break down */
  target: string;
  targetEn?: string;
  /** Target date for completion */
  deadline?: Date;
  /** Estimated total hours */
  estimatedHours?: number;
  /** Context: related event */
  relatedEvent?: CulminatingEvent;
  /** User's energy level (affects granularity) */
  currentEnergyLevel?: 'low' | 'medium' | 'high';
  /** ND profile for calibration */
  ndProfile: NDProfile;
}

export interface TaskBreakdownResult {
  /** Generated subtasks */
  tasks: GeneratedTask[];
  /** Suggested order (critical path) */
  suggestedOrder: string[];
  /** Total estimated hours */
  totalHours: number;
  /** Confidence in the breakdown */
  confidence: number;
  /** Agent's explanation */
  explanation: string;
  explanationEn: string;
}

export interface GeneratedTask {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  estimatedHours: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  dependencies: string[];
  /** Tags for categorization */
  tags: string[];
  /** Suggested assignee based on task type */
  suggestedAssignee?: string;
}

// ============================================================================
// REMINDER AGENT SPECIFICS
// ============================================================================

export type ReminderTrigger =
  | 'time-before-event'
  | 'time-before-task'
  | 'daily-planning'
  | 'focus-check-in'
  | 'break-time'
  | 'end-of-day'
  | 'task-overdue'
  | 'convergence-milestone';

export interface ReminderConfig {
  trigger: ReminderTrigger;
  /** Minutes/hours before event to trigger */
  leadTime?: number;
  /** Unit for lead time */
  leadTimeUnit?: 'minutes' | 'hours' | 'days';
  /** Specific time of day (for daily triggers) */
  timeOfDay?: string; // HH:mm format
  /** Days of week (0=Sunday) */
  daysOfWeek?: number[];
  /** Is this reminder enabled */
  enabled: boolean;
  /** Custom message override */
  customMessage?: string;
}

export interface ScheduledReminder {
  id: string;
  config: ReminderConfig;
  scheduledFor: Date;
  relatedTaskId?: string;
  relatedEventId?: string;
  delivered: boolean;
  snoozedUntil?: Date;
}

// ============================================================================
// CALM AGENT SPECIFICS
// ============================================================================

export type OverwhelmIndicator =
  | 'rapid-task-switching'
  | 'high-scroll-velocity'
  | 'long-inactive-period'
  | 'multiple-failed-attempts'
  | 'late-night-usage'
  | 'deadline-proximity-stress';

export interface OverwhelmDetection {
  indicators: OverwhelmIndicator[];
  confidenceLevel: number; // 0-1
  suggestedIntervention: 'gentle-nudge' | 'breathing-exercise' | 'take-break' | 'simplify-view';
  detectedAt: Date;
}

export interface CalmingIntervention {
  type: 'breathing' | 'grounding' | 'simplify' | 'pause' | 'celebrate-small-win';
  duration: number; // seconds
  message: string;
  messageEn: string;
  instructions?: string[];
  instructionsEn?: string[];
}

// ============================================================================
// FOCUS AGENT SPECIFICS
// ============================================================================

export type FocusSessionType = 'pomodoro' | 'deep-work' | 'sprint' | 'custom';

export interface FocusSession {
  id: string;
  type: FocusSessionType;
  taskId?: string;
  startedAt: Date;
  plannedDurationMinutes: number;
  actualEndedAt?: Date;
  breaks: FocusBreak[];
  distractionCount: number;
  completionPercentage: number;
}

export interface FocusBreak {
  startedAt: Date;
  endedAt?: Date;
  type: 'scheduled' | 'unscheduled';
  reason?: string;
}

export interface FocusSessionConfig {
  type: FocusSessionType;
  workDurationMinutes: number;
  breakDurationMinutes: number;
  longBreakAfterSessions: number;
  longBreakDurationMinutes: number;
  autoStartBreaks: boolean;
  autoStartNextSession: boolean;
  playSound: boolean;
  showNotification: boolean;
}

// ============================================================================
// AGENT STATE MANAGEMENT
// ============================================================================

export interface AgentState {
  /** Which agents are currently active */
  activeAgents: Set<AgentType>;
  /** Pending suggestions from all agents */
  suggestions: AgentSuggestion[];
  /** Current focus session if any */
  currentFocusSession: FocusSession | null;
  /** Scheduled reminders */
  scheduledReminders: ScheduledReminder[];
  /** Last overwhelm detection */
  lastOverwhelmDetection: OverwhelmDetection | null;
  /** Agent interaction history (for learning) */
  interactionHistory: AgentInteraction[];
}

export interface AgentInteraction {
  suggestionId: string;
  agentType: AgentType;
  action: 'accepted' | 'dismissed' | 'snoozed' | 'ignored';
  timestamp: Date;
  /** Feedback if provided */
  feedback?: 'helpful' | 'not-helpful' | 'annoying';
}

// ============================================================================
// AGENT CONTEXT (passed to agents for decision making)
// ============================================================================

export interface AgentContext {
  /** Current user's ND profile */
  ndProfile: NDProfile;
  /** Current language */
  language: 'es' | 'en';
  /** Current time */
  now: Date;
  /** Tasks visible to user */
  tasks: Task[];
  /** Culminating event if set */
  culminatingEvent: CulminatingEvent | null;
  /** User behavior signals */
  behaviorSignals: BehaviorSignals;
  /** Recent agent interactions */
  recentInteractions: AgentInteraction[];
}

export interface BehaviorSignals {
  /** Time since last user activity */
  idleTimeSeconds: number;
  /** Number of view switches in last 5 minutes */
  viewSwitchCount: number;
  /** Scroll velocity (pixels per second average) */
  scrollVelocity: number;
  /** Current hour of day (0-23) */
  currentHour: number;
  /** Tasks completed today */
  tasksCompletedToday: number;
  /** Current focus session active */
  inFocusSession: boolean;
}
