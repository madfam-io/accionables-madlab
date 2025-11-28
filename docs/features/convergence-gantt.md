# Convergence Gantt

> **Status**: Implemented
> **Location**: `apps/client/src/components/GanttChart/`

The Convergence Gantt reimagines traditional timeline views by making the culminating event the focal point. Everything flows toward "the moment."

---

## Overview

### Core Principle
> "Not 'when does this task happen' but 'how does everything sync up at the moment.'"

Traditional Gantt charts show tasks on a timeline. The Convergence Gantt shows tasks flowing toward a shared destination — the culminating event.

### Visual Concept

```
                                    ★ EVENT
                                    │
    ┌─────────────────────────────┐ │
    │ Venue confirmed             │─┤
    └─────────────────────────────┘ │
          ┌───────────────────────┐ │
          │ Equipment delivered   │─┤
          └───────────────────────┘ │
              ┌───────────────────┐ │
              │ Sound check       │─┤
              └───────────────────┘ │
                  ┌───────────────┐ │
                  │ Doors open    │─┘
                  └───────────────┘
```

---

## Components

### EventMarker
Location: `apps/client/src/components/GanttChart/EventMarker.tsx`

The visual focal point displaying the culminating event.

**Features**:
- Event icon based on type (🎵 concert, 🚀 launch, 📝 exam, etc.)
- Event name and date
- Time remaining countdown
- Urgency color coding
- Time blindness aids (large countdown for ADHD profile)
- Flowing particle animations

**Urgency States**:
| State | Color | Condition |
|-------|-------|-----------|
| Past | Emerald | Event completed |
| Today | Red (pulsing) | Event is today |
| Urgent | Orange | 1-3 days remaining |
| Soon | Amber | 4-7 days remaining |
| Normal | Indigo | 8+ days remaining |

### EventSetterModal
Location: `apps/client/src/components/GanttChart/EventSetterModal.tsx`

Modal for creating/editing the culminating event.

**Event Types**:
- 🎵 Concert
- 🚀 Launch
- 📝 Exam
- 🎤 Presentation
- 🏕️ Retreat
- ⏰ Deadline
- ⭐ Custom

**Fields**:
- Event type selector
- Name (bilingual)
- Date picker
- Description (optional)

### Convergence Lines
Location: Rendered in `GanttTimeline.tsx`

SVG bezier curves connecting task bars to the event.

```tsx
// Convergence line calculation
const controlPointX = taskEndX + (eventPosition - taskEndX) * 0.7;
const eventCenterY = 60;

<path
  d={`M ${taskEndX} ${taskY} Q ${controlPointX} ${taskY}, ${eventPosition} ${eventCenterY}`}
  stroke="url(#convergence-gradient)"
  strokeDasharray="8,4"
  className="animate-dash-flow"
/>
```

---

## State Management

### CulminatingEvent Interface

```typescript
// Location: apps/client/src/stores/appStore.ts

interface CulminatingEvent {
  id: string;
  name: string;
  nameEn: string;
  date: Date;
  description?: string;
  descriptionEn?: string;
  type: 'concert' | 'launch' | 'exam' | 'presentation' | 'retreat' | 'deadline' | 'custom';
}
```

### GanttConfig Extension

```typescript
interface GanttConfig {
  // ... existing config
  showConvergence: boolean;  // Toggle convergence visualization
}
```

### Store Actions

```typescript
// Set the culminating event
setCulminatingEvent: (event: CulminatingEvent | null) => void;

// Toggle convergence view
setGanttConfig: ({ showConvergence: boolean }) => void;
```

---

## GanttHeader Controls

Location: `apps/client/src/components/GanttChart/GanttHeader.tsx`

New convergence controls added:

```tsx
{/* Convergence Toggle */}
<button onClick={toggleConvergence}>
  <Sparkles />
  {ganttConfig.showConvergence ? 'Hide' : 'Show'} Convergence
</button>

{/* Event Setter */}
<button onClick={() => setIsEventModalOpen(true)}>
  <Target />
  {culminatingEvent ? culminatingEvent.name : 'Set Event'}
</button>
```

---

## CSS Animations

Location: `apps/client/src/index.css`

### Flowing Particles
```css
@keyframes flow-down {
  0% { transform: translateY(-10px); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translateY(100vh); opacity: 0; }
}

.animate-flow-down {
  animation: flow-down 3s linear infinite;
}
```

### Convergence Line Flow
```css
@keyframes dash-flow {
  to { stroke-dashoffset: -10; }
}

.animate-dash-flow {
  animation: dash-flow 1s linear infinite;
}
```

### Event Pulse
```css
@keyframes convergence-pulse {
  0%, 100% { box-shadow: 0 0 20px currentColor; opacity: 0.8; }
  50% { box-shadow: 0 0 40px currentColor; opacity: 1; }
}
```

---

## Integration with Demo Projects

Users can instantly experience convergence via the landing page:

```typescript
// Location: apps/client/src/pages/LandingPage.tsx

const handleTryDemo = (project: DemoProject) => {
  setCulminatingEvent(project.event);
  setGanttConfig({
    showConvergence: true,
    startDate: new Date(),
    endDate: new Date(project.event.date.getTime() + 7 * 24 * 60 * 60 * 1000),
  });
  navigate('/app');
};
```

Available demo projects:
- Spring Concert (21 days)
- App Launch (14 days)
- Final Exam (10 days)
- Team Retreat (28 days)
- Investor Pitch (7 days)
- Wedding (60 days)

---

## ND Profile Adaptations

The convergence visualization adapts to ND profiles:

### Time Blindness Aids (ADHD)
When `ndProfile.time.timeBlindnessAids` is true:
- Large countdown numbers displayed
- More prominent urgency coloring
- Countdown shown in hours when event is today

### Motion Preferences
When `ndProfile.visual.motion` is 'none':
- Particle animations disabled
- Static convergence lines

---

## Future Enhancements

### Task Auto-Scheduling (Planned)
- AI suggests task dates based on dependencies
- Automatic compression as event approaches

### Critical Path Highlighting (Planned)
- Show which tasks are blocking the event
- Visual warning when critical path is at risk

### Multiplayer Convergence (Planned)
- Multiple team members' tasks flowing to same event
- Color-coded by assignee
- Dependency awareness across people

---

## Related Documentation

- [Product Vision](../product/PRODUCT_VISION.md) - Convergence philosophy
- [ND Profile System](./nd-profiles.md) - Time blindness aids
- [Demo Projects](./demo-projects.md) - Landing page integration
- [Components Reference](../components/COMPONENTS_REFERENCE.md) - GanttChart components

---

*Last Updated: November 2025*
