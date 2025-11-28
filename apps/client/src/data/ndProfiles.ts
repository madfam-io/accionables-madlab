import type { NDProfile } from '../types/ndProfile';

/**
 * Default ND Profile Presets
 *
 * Research-informed defaults for different neurodivergent profiles.
 * Users can start with these and customize from here.
 */

export const defaultProfile: NDProfile = {
  id: 'default',
  preset: 'default',
  name: 'Default',
  description: 'Balanced settings suitable for most users',
  visual: {
    colorIntensity: 'balanced',
    density: 'comfortable',
    motion: 'reduced',
    contrast: 'normal',
    fontFamily: 'default',
    fontScale: 1,
  },
  time: {
    timeDisplay: 'relative',
    showCountdown: true,
    timeBlindnessAids: false,
    transitionWarnings: false,
    transitionWarningMinutes: 5,
  },
  notifications: {
    frequency: 'moderate',
    batching: true,
    sounds: false,
    visualAlerts: false,
    reminderStyle: 'neutral',
  },
  information: {
    disclosure: 'progressive',
    explicitness: 'balanced',
    preferredFormat: 'mixed',
    showComplexity: true,
    showTimeEstimates: true,
  },
  motivation: {
    celebrationStyle: 'subtle',
    showStreaks: false,
    gamification: 'light',
    progressStyle: 'visual',
    reinforcementFrequency: 'moderate',
  },
  agents: {
    breakdownAgent: true,
    reminderAgent: true,
    reminderAggressiveness: 'moderate',
    draftAgent: true,
    calmAgent: false,
    autoSimplify: false,
  },
};

export const adhdProfile: NDProfile = {
  id: 'adhd',
  preset: 'adhd',
  name: 'ADHD',
  description: 'Optimized for attention regulation, time blindness, and dopamine-seeking',
  visual: {
    colorIntensity: 'vibrant', // Dopamine-friendly, engaging
    density: 'minimal', // Reduce overwhelm, one thing at a time
    motion: 'reduced', // Reduce distraction but keep some engagement
    contrast: 'high', // Help focus attention
    fontFamily: 'default',
    fontScale: 1.1, // Slightly larger for focus
  },
  time: {
    timeDisplay: 'both', // Multiple representations help
    showCountdown: true, // Visual time pressure
    timeBlindnessAids: true, // Critical for ADHD
    transitionWarnings: true, // Help with task switching
    transitionWarningMinutes: 10, // More lead time
  },
  notifications: {
    frequency: 'frequent', // More reminders needed
    batching: false, // Immediate reminders work better
    sounds: true, // Audio cues help
    visualAlerts: true, // Multi-sensory
    reminderStyle: 'urgent', // Needs urgency to activate
  },
  information: {
    disclosure: 'progressive', // Don't overwhelm upfront
    explicitness: 'explicit', // Clear expectations
    preferredFormat: 'visual', // Visual processing often stronger
    showComplexity: true, // Know what you're getting into
    showTimeEstimates: true, // Help with time estimation
  },
  motivation: {
    celebrationStyle: 'enthusiastic', // Dopamine hits for completion
    showStreaks: true, // Gamification helps
    gamification: 'full', // Engage dopamine system
    progressStyle: 'visual', // See progress clearly
    reinforcementFrequency: 'frequent', // Need more rewards
  },
  agents: {
    breakdownAgent: true, // Critical for "where do I start"
    reminderAgent: true, // Critical for time blindness
    reminderAggressiveness: 'persistent', // Need more nudges
    draftAgent: true, // Help with initiation
    calmAgent: true, // Help with overwhelm
    autoSimplify: true, // Reduce when overwhelmed
  },
};

export const autismProfile: NDProfile = {
  id: 'autism',
  preset: 'autism',
  name: 'Autism',
  description: 'Optimized for predictability, sensory comfort, and explicit communication',
  visual: {
    colorIntensity: 'muted', // Reduce sensory input
    density: 'comfortable', // Structured but not sparse
    motion: 'none', // Minimize sensory surprises
    contrast: 'normal', // Avoid harsh contrasts
    fontFamily: 'monospace', // Predictable spacing
    fontScale: 1,
  },
  time: {
    timeDisplay: 'absolute', // Concrete times preferred
    showCountdown: true, // Predictability
    timeBlindnessAids: false, // Usually not needed
    transitionWarnings: true, // Critical for transitions
    transitionWarningMinutes: 15, // More preparation time
  },
  notifications: {
    frequency: 'minimal', // Reduce interruptions
    batching: true, // Predictable notification times
    sounds: false, // Avoid sensory surprises
    visualAlerts: false, // Subtle only
    reminderStyle: 'gentle', // Non-intrusive
  },
  information: {
    disclosure: 'complete', // All info upfront, no surprises
    explicitness: 'explicit', // Say exactly what you mean
    preferredFormat: 'text', // Often prefer written
    showComplexity: true, // Know what to expect
    showTimeEstimates: true, // Plan accurately
  },
  motivation: {
    celebrationStyle: 'subtle', // Not overwhelming
    showStreaks: true, // Pattern completion satisfying
    gamification: 'light', // Some structure, not chaotic
    progressStyle: 'checklist', // Clear completion states
    reinforcementFrequency: 'moderate',
  },
  agents: {
    breakdownAgent: true, // Clear structure
    reminderAgent: true, // Predictable reminders
    reminderAggressiveness: 'gentle', // Not intrusive
    draftAgent: true, // Communication support
    calmAgent: true, // Overwhelm detection
    autoSimplify: false, // Prefer control over auto-changes
  },
};

export const dyslexiaProfile: NDProfile = {
  id: 'dyslexia',
  preset: 'dyslexia',
  name: 'Dyslexia',
  description: 'Optimized for reading comfort, visual processing, and audio alternatives',
  visual: {
    colorIntensity: 'muted', // Reduce visual stress
    density: 'minimal', // Less text per screen
    motion: 'reduced',
    contrast: 'normal', // High contrast can cause visual stress
    fontFamily: 'dyslexia-friendly', // OpenDyslexic or similar
    fontScale: 1.2, // Larger text
  },
  time: {
    timeDisplay: 'relative', // Simpler to parse
    showCountdown: true,
    timeBlindnessAids: false,
    transitionWarnings: false,
    transitionWarningMinutes: 5,
  },
  notifications: {
    frequency: 'moderate',
    batching: true,
    sounds: true, // Audio helps
    visualAlerts: false,
    reminderStyle: 'neutral',
  },
  information: {
    disclosure: 'progressive', // Less reading at once
    explicitness: 'explicit', // Clear, simple language
    preferredFormat: 'audio', // Audio alternatives
    showComplexity: true,
    showTimeEstimates: true,
  },
  motivation: {
    celebrationStyle: 'subtle',
    showStreaks: false,
    gamification: 'light',
    progressStyle: 'visual', // Icons over text
    reinforcementFrequency: 'moderate',
  },
  agents: {
    breakdownAgent: true,
    reminderAgent: true,
    reminderAggressiveness: 'moderate',
    draftAgent: true, // Writing assistance valuable
    calmAgent: false,
    autoSimplify: false,
  },
};

export const ndProfilePresets: Record<string, NDProfile> = {
  default: defaultProfile,
  adhd: adhdProfile,
  autism: autismProfile,
  dyslexia: dyslexiaProfile,
};

/**
 * Get a profile by preset name
 */
export function getProfile(preset: string): NDProfile {
  return ndProfilePresets[preset] || defaultProfile;
}

/**
 * Create a custom profile by merging a base preset with overrides
 */
export function createCustomProfile(
  basePreset: string,
  overrides: Partial<NDProfile>
): NDProfile {
  const base = getProfile(basePreset);
  return {
    ...base,
    ...overrides,
    id: 'custom',
    preset: 'custom',
    name: 'Custom',
    description: `Custom profile based on ${base.name}`,
    visual: { ...base.visual, ...overrides.visual },
    time: { ...base.time, ...overrides.time },
    notifications: { ...base.notifications, ...overrides.notifications },
    information: { ...base.information, ...overrides.information },
    motivation: { ...base.motivation, ...overrides.motivation },
    agents: { ...base.agents, ...overrides.agents },
  };
}
