# AI Agent System

> **Status**: Architecture Implemented, Core UI Ready
> **Location**: `apps/client/src/types/agents.ts`, `apps/client/src/stores/agentStore.ts`

The AI Agent System provides specialized assistants that fill executive function gaps for neurodivergent users. Each agent has a distinct personality and purpose.

---

## Overview

### Core Principle
> "Agents fill the gaps so you can focus on what matters."

Instead of one generic AI assistant, MADLAB provides specialized agents that each handle a specific cognitive support need.

---

## Agent Types

### 🧩 Fragmento (Breakdown Agent)
**Purpose**: Transforms big goals into manageable steps

| Attribute | Value |
|-----------|-------|
| Spanish Name | Fragmento |
| English Name | Fragment |
| Color | Violet (#8b5cf6) |
| Tone | Encouraging |

**Capabilities**:
- Takes event descriptions and generates task trees
- Suggests task dependencies
- Estimates hours per task
- Assigns difficulty ratings

**ND Benefit**: Reduces "where do I start" paralysis

---

### ⏰ Timely (Reminder Agent)
**Purpose**: Context-aware nudges that fight time blindness

| Attribute | Value |
|-----------|-------|
| Spanish Name | Timely |
| English Name | Timely |
| Color | Amber (#f59e0b) |
| Tone | Playful |

**Capabilities**:
- Smart reminders before tasks/events
- Daily planning prompts
- Focus check-ins
- Convergence milestone alerts

**Aggressiveness Levels**:
- `gentle`: Polite, easily dismissed
- `moderate`: Persistent but not annoying
- `persistent`: Won't give up (ADHD mode)

**ND Benefit**: Makes time visible and manageable

---

### ✍️ Palabras (Draft Agent)
**Purpose**: Helps communicate thoughts into words

| Attribute | Value |
|-----------|-------|
| Spanish Name | Palabras |
| English Name | Words |
| Color | Emerald (#10b981) |
| Tone | Neutral |

**Capabilities**:
- Drafts communication messages
- Generates update summaries
- Creates handoff notes
- Suggests response templates

**ND Benefit**: Removes writing paralysis

---

### 🌊 Calma (Calm Agent)
**Purpose**: Detects overwhelm and provides support

| Attribute | Value |
|-----------|-------|
| Spanish Name | Calma |
| English Name | Calm |
| Color | Cyan (#06b6d4) |
| Tone | Calm |

**Capabilities**:
- Detects overwhelm signals (rapid switching, high scroll, etc.)
- Suggests breathing exercises
- Offers to simplify the view
- Celebrates small wins

**Overwhelm Indicators**:
- `rapid-task-switching`
- `high-scroll-velocity`
- `long-inactive-period`
- `late-night-usage`
- `deadline-proximity-stress`

**ND Benefit**: Prevents shutdown/meltdown

---

### 🎯 Enfoque (Focus Agent)
**Purpose**: Facilitates deep work sessions

| Attribute | Value |
|-----------|-------|
| Spanish Name | Enfoque |
| English Name | Focus |
| Color | Pink (#ec4899) |
| Tone | Encouraging |

**Capabilities**:
- Pomodoro-style focus timer
- Distraction tracking
- Break reminders
- Session completion celebrations

**Session Types**:
- `pomodoro`: 25 work / 5 break
- `deep-work`: 90 work / 20 break
- `sprint`: 15 work / 2 break
- `custom`: User-defined

**ND Benefit**: Body-doubling companion for solo work

---

### 🎉 Fiesta (Celebrate Agent)
**Purpose**: Celebrates achievements big and small

| Attribute | Value |
|-----------|-------|
| Spanish Name | Fiesta |
| English Name | Party |
| Color | Yellow (#eab308) |
| Tone | Playful |

**Capabilities**:
- Task completion celebrations
- Streak recognition
- Milestone announcements
- Positive reinforcement

**ND Benefit**: Dopamine hits for progress

---

## Type Definitions

### Agent Suggestion

```typescript
// Location: apps/client/src/types/agents.ts

interface AgentSuggestion {
  id: string;
  agentType: AgentType;
  category: SuggestionCategory;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  message: string;
  messageEn: string;
  detail?: string;
  detailEn?: string;
  actions: SuggestionAction[];
  createdAt: Date;
  autoDismissSeconds: number | null;
  acknowledged: boolean;
}

interface SuggestionAction {
  id: string;
  label: string;
  labelEn: string;
  type: 'dismiss' | 'snooze' | 'accept' | 'custom';
  customAction?: string;
  primary: boolean;
}
```

### Focus Session

```typescript
interface FocusSession {
  id: string;
  type: 'pomodoro' | 'deep-work' | 'sprint' | 'custom';
  taskId?: string;
  startedAt: Date;
  plannedDurationMinutes: number;
  actualEndedAt?: Date;
  breaks: FocusBreak[];
  distractionCount: number;
  completionPercentage: number;
}
```

---

## State Management

### Agent Store

```typescript
// Location: apps/client/src/stores/agentStore.ts

const useAgentStore = create(persist<AgentStoreState>(
  (set, get) => ({
    activeAgents: new Set(['breakdown', 'reminder', 'calm']),
    suggestions: [],
    currentFocusSession: null,
    scheduledReminders: [],
    interactionHistory: [],

    // Actions
    toggleAgent: (type) => { /* ... */ },
    addSuggestion: (suggestion) => { /* ... */ },
    dismissSuggestion: (id) => { /* ... */ },
    snoozeSuggestion: (id, minutes) => { /* ... */ },
    startFocusSession: (taskId, duration) => { /* ... */ },
    recordDistraction: () => { /* ... */ },
    getAgentEffectiveness: (type) => { /* ... */ },
  })
));
```

### Effectiveness Tracking

Agents learn from user interactions:

```typescript
getAgentEffectiveness: (agentType) => {
  const interactions = get().interactionHistory.filter(i => i.agentType === agentType);
  const accepted = interactions.filter(i => i.action === 'accepted').length;
  const helpful = interactions.filter(i => i.feedback === 'helpful').length;
  const annoying = interactions.filter(i => i.feedback === 'annoying').length;

  // Calculate effectiveness score (0-1)
  return Math.max(0, Math.min(1,
    (accepted / interactions.length) + (helpful * 0.1) - (annoying * 0.2)
  ));
}
```

---

## UI Components

### AgentPanel
Location: `apps/client/src/components/Agents/AgentPanel.tsx`

Displays active suggestions and agent controls:
- Collapsible panel (sidebar/floating/bottom positions)
- Agent toggle switches with effectiveness meters
- Suggestion cards with actions

### AgentSuggestionCard
Location: `apps/client/src/components/Agents/AgentSuggestionCard.tsx`

Individual suggestion display:
- Agent avatar and name
- Message with detail expansion
- Action buttons (accept/dismiss/snooze)
- Priority-based styling

### FocusTimer
Location: `apps/client/src/components/Agents/FocusTimer.tsx`

Pomodoro-style focus session UI:
- Circular progress ring
- Time remaining display
- Play/pause/stop controls
- Distraction counter
- Break mode indicator

---

## Profile Integration

Agents adapt based on ND profile settings:

```typescript
// From ndProfile.agents
interface AgentPreferences {
  breakdownAgent: boolean;
  reminderAgent: boolean;
  reminderAggressiveness: 'gentle' | 'moderate' | 'persistent';
  draftAgent: boolean;
  calmAgent: boolean;
  autoSimplify: boolean;
}
```

Example adaptations:
- **ADHD**: Reminder agent set to `persistent`, breakdown agent enabled
- **Autism**: Calm agent enabled with `autoSimplify`
- **Default**: Gentle reminders, minimal agents

---

## Future Enhancements

### AI Integration (Planned)
- Claude API for natural language task breakdown
- Smart communication drafting
- Context-aware suggestions

### Advanced Agents (Planned)
- **Logistics Agent**: Generates checklists, packing lists
- **Sync Agent**: Keeps team members aligned
- **Script Agent**: Generates scripts for phone calls, meetings

---

## Related Documentation

- [ND Profile System](./nd-profiles.md) - Profile-agent integration
- [Product Vision](../product/PRODUCT_VISION.md) - Agent design philosophy
- [State Management](../api/state-management.md) - Store architecture
- [Components Reference](../components/COMPONENTS_REFERENCE.md) - UI components

---

*Last Updated: November 2025*
