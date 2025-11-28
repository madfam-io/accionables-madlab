# Neurodivergency Profile System

> **Status**: Implemented
> **Location**: `apps/client/src/types/ndProfile.ts`, `apps/client/src/data/ndProfiles.ts`

The ND Profile System adapts MADLAB's interface to different neurodivergent thinking styles. Instead of one-size-fits-all, the UI transforms based on the user's needs.

---

## Overview

### Core Principle
> "The tool adapts to you, not the other way around."

Different brains process information differently. The ND Profile System allows users to select a preset or customize their experience across multiple dimensions.

---

## Profile Presets

### Default Profile
Balanced settings suitable for most users.
- Standard visual density
- Moderate notifications
- Light gamification

### ADHD Profile
Optimized for attention regulation and dopamine-seeking behavior.

| Category | Setting | Rationale |
|----------|---------|-----------|
| Visual | Vibrant colors | Dopamine-friendly engagement |
| Visual | Comfortable density | Not overwhelming |
| Time | Time blindness aids ON | Visual time remaining |
| Motivation | Full gamification | Streaks, celebrations |
| Agents | Reminder (persistent) | Fights time blindness |
| Agents | Breakdown (enabled) | Reduces "where do I start" |

### Autism Profile
Optimized for predictability and low sensory stimulation.

| Category | Setting | Rationale |
|----------|---------|-----------|
| Visual | Muted colors | Low sensory stimulation |
| Visual | Dense information | Complete picture upfront |
| Motion | Reduced | Predictable interface |
| Information | Explicit | No implied meaning |
| Notifications | Batched | No surprise interruptions |
| Agents | Calm (enabled) | Overwhelm detection |

### Dyslexia Profile
Optimized for reading accessibility and visual processing.

| Category | Setting | Rationale |
|----------|---------|-----------|
| Visual | Dyslexia-friendly font | OpenDyslexic or similar |
| Visual | Larger font scale (1.1x) | Easier reading |
| Information | Visual format | Icons over text |
| Visual | High contrast | Clear differentiation |

---

## Type Definitions

### NDProfile Interface

```typescript
// Location: apps/client/src/types/ndProfile.ts

interface NDProfile {
  id: string;
  preset: 'default' | 'adhd' | 'autism' | 'dyslexia' | 'custom';
  name: string;
  description: string;
  visual: VisualPreferences;
  time: TimePreferences;
  notifications: NotificationPreferences;
  information: InformationPreferences;
  motivation: MotivationPreferences;
  agents: AgentPreferences;
}
```

### Visual Preferences

```typescript
interface VisualPreferences {
  colorIntensity: 'muted' | 'balanced' | 'vibrant';
  density: 'minimal' | 'comfortable' | 'dense';
  motion: 'none' | 'reduced' | 'full';
  contrast: 'normal' | 'high';
  fontFamily: 'default' | 'dyslexia-friendly' | 'monospace';
  fontScale: number; // 0.8 to 1.4
}
```

### Agent Preferences

```typescript
interface AgentPreferences {
  breakdownAgent: boolean;
  reminderAgent: boolean;
  reminderAggressiveness: 'gentle' | 'moderate' | 'persistent';
  draftAgent: boolean;
  calmAgent: boolean;
  autoSimplify: boolean;
}
```

---

## Implementation

### Profile Store

Profiles are managed in the main app store with persistence:

```typescript
// In appStore.ts
ndProfile: NDProfile;
setNDProfile: (preset: NDPreset) => void;
customizeNDProfile: (overrides: Partial<NDProfile>) => void;
```

### Applying Profiles

The `useNDProfile` hook applies profile settings to the document:

```typescript
// Location: apps/client/src/hooks/useNDProfile.ts

export function useNDProfile() {
  const { ndProfile } = useAppStore();

  useEffect(() => {
    const root = document.documentElement;

    // Apply CSS classes
    root.classList.add(`colors-${ndProfile.visual.colorIntensity}`);
    root.classList.add(`density-${ndProfile.visual.density}`);
    root.classList.add(`motion-${ndProfile.visual.motion}`);

    // Set CSS custom properties
    root.style.setProperty('--nd-font-scale', ndProfile.visual.fontScale.toString());

    // Set data attributes for CSS targeting
    root.dataset.ndProfile = ndProfile.preset;
  }, [ndProfile]);
}
```

### CSS Support

Profile-specific styles in `index.css`:

```css
/* Font families */
.font-dyslexia { font-family: 'OpenDyslexic', sans-serif; }
.font-mono { font-family: 'JetBrains Mono', monospace; }

/* Color intensity */
.colors-muted { filter: saturate(0.7); }
.colors-vibrant { filter: saturate(1.15); }

/* Motion control */
.motion-none *, .motion-none *::before, .motion-none *::after {
  animation: none !important;
  transition: none !important;
}

/* Profile-specific focus indicators */
[data-nd-profile="adhd"] *:focus-visible {
  outline: 3px solid #f59e0b;
}
```

---

## UI Component

### NDProfileSelector

Location: `apps/client/src/components/NDProfileSelector.tsx`

A dropdown component in the header that allows profile switching:

```tsx
import { NDProfileSelector } from './NDProfileSelector';

// In Header.tsx
<NDProfileSelector />
```

Features:
- Shows current profile with icon
- Dropdown with all preset options
- Visual indicator for active profile
- Bilingual labels (ES/EN)

---

## Future Enhancements

### Calibration Flow (Planned)
Interactive onboarding that determines optimal settings through questions:
- Visual comfort tests
- Information processing preferences
- Time relationship assessment
- Motivation pattern detection

### Continuous Learning (Planned)
System learns from usage:
- "You engage more in mornings — adjust reminders?"
- "Tasks with visuals complete faster — add more?"

---

## Related Documentation

- [Product Vision](../product/PRODUCT_VISION.md) - ND profile design rationale
- [AI Agent System](./ai-agents.md) - How agents adapt to profiles
- [Accessibility Guide](../guides/ACCESSIBILITY.md) - WCAG compliance
- [State Management](../api/state-management.md) - Store integration

---

*Last Updated: November 2025*
