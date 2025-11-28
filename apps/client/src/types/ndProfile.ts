/**
 * Neurodivergency Profile Types
 *
 * Defines the structure for ND-specific UI/UX adaptations
 */

export type NDPreset = 'default' | 'adhd' | 'autism' | 'dyslexia' | 'custom';

export interface VisualPreferences {
  /** Color intensity: 'muted' for calm, 'vibrant' for dopamine-seeking */
  colorIntensity: 'muted' | 'balanced' | 'vibrant';
  /** Information density per screen */
  density: 'minimal' | 'comfortable' | 'dense';
  /** Animation and motion preferences */
  motion: 'none' | 'reduced' | 'full';
  /** Contrast level */
  contrast: 'normal' | 'high';
  /** Font preference */
  fontFamily: 'default' | 'dyslexia-friendly' | 'monospace';
  /** Base font size multiplier */
  fontScale: number;
}

export interface TimePreferences {
  /** How to display time remaining */
  timeDisplay: 'relative' | 'absolute' | 'both';
  /** Show visual countdown to events */
  showCountdown: boolean;
  /** Time blindness aids (prominent time displays) */
  timeBlindnessAids: boolean;
  /** Transition warnings before context switches */
  transitionWarnings: boolean;
  /** Minutes before transition to warn */
  transitionWarningMinutes: number;
}

export interface NotificationPreferences {
  /** Notification frequency */
  frequency: 'minimal' | 'moderate' | 'frequent';
  /** Batch notifications vs immediate */
  batching: boolean;
  /** Sound notifications */
  sounds: boolean;
  /** Visual flash notifications */
  visualAlerts: boolean;
  /** Reminder style */
  reminderStyle: 'gentle' | 'neutral' | 'urgent';
}

export interface InformationPreferences {
  /** How much info to show upfront */
  disclosure: 'progressive' | 'complete';
  /** Prefer explicit or implicit communication */
  explicitness: 'explicit' | 'balanced' | 'implicit';
  /** Preferred content format */
  preferredFormat: 'text' | 'visual' | 'audio' | 'mixed';
  /** Show task complexity indicators */
  showComplexity: boolean;
  /** Show estimated time for tasks */
  showTimeEstimates: boolean;
}

export interface MotivationPreferences {
  /** Celebration style for completed tasks */
  celebrationStyle: 'none' | 'subtle' | 'enthusiastic';
  /** Show streaks and consistency tracking */
  showStreaks: boolean;
  /** Gamification elements */
  gamification: 'none' | 'light' | 'full';
  /** Progress visualization style */
  progressStyle: 'percentage' | 'visual' | 'checklist';
  /** Positive reinforcement frequency */
  reinforcementFrequency: 'rare' | 'moderate' | 'frequent';
}

export interface AgentPreferences {
  /** Enable Breakdown Agent (event → tasks) */
  breakdownAgent: boolean;
  /** Enable Reminder Agent */
  reminderAgent: boolean;
  /** Reminder aggressiveness */
  reminderAggressiveness: 'gentle' | 'moderate' | 'persistent';
  /** Enable Draft Agent (communication help) */
  draftAgent: boolean;
  /** Enable Calm Agent (overwhelm detection) */
  calmAgent: boolean;
  /** Auto-simplify when overwhelm detected */
  autoSimplify: boolean;
}

export interface NDProfile {
  /** Profile identifier */
  id: string;
  /** Preset type */
  preset: NDPreset;
  /** Display name */
  name: string;
  /** Description of this profile */
  description: string;
  /** Visual preferences */
  visual: VisualPreferences;
  /** Time-related preferences */
  time: TimePreferences;
  /** Notification preferences */
  notifications: NotificationPreferences;
  /** Information display preferences */
  information: InformationPreferences;
  /** Motivation and reward preferences */
  motivation: MotivationPreferences;
  /** AI agent preferences */
  agents: AgentPreferences;
  /** Custom overrides (for 'custom' preset) */
  customOverrides?: Partial<NDProfile>;
}

export interface CalibrationAnswer {
  questionId: string;
  answer: string | number | boolean;
}

export interface CalibrationResult {
  recommendedPreset: NDPreset;
  confidence: number;
  profileAdjustments: Partial<NDProfile>;
  explanations: Record<string, string>;
}
