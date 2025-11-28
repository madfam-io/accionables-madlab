# System Overview

## Product Mission

MADLAB is an **Event Convergence Orchestrator** designed for neurodivergent minds. Instead of traditional project management where time flows forward from today, everything in MADLAB converges backward toward a **culminating event** - a concert, product launch, wedding, exam, or any pivotal deadline.

> **"The tool adapts to you, not the other way around."**

---

## Core Concepts

### Convergence-Based Planning

Traditional project management treats time as linear progress from start to finish. MADLAB inverts this: your event is the fixed point, and everything flows toward it.

```
Traditional:  Start ───────────────────────▶ Maybe finish?
              (uncertainty increases)

MADLAB:       Tasks ────────────────────────▶ 🎯 Event
              (everything converges to the known endpoint)
```

### Neurodivergency-First Design

The UI adapts based on ND profile:

| Profile | Key Adaptations |
|---------|-----------------|
| **ADHD** | Reduced visual noise, visible timers, frequent dopamine hits |
| **Autism** | Predictable patterns, advance warnings, reduced surprises |
| **Dyslexia** | High contrast, larger text, visual over text indicators |
| **Custom** | Fully calibrated preferences |

### AI Agent System

Six specialized agents that fill executive function gaps:

- **Fragmento** - Breaks overwhelming tasks into doable chunks
- **Timely** - Makes time visible (context-aware reminders)
- **Palabras** - Drafts communications (removes writing paralysis)
- **Calma** - Detects overwhelm patterns
- **Enfoque** - Manages focus sessions (body-doubling companion)
- **Fiesta** - Celebrates progress (dopamine on demand)

---

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           User Interface                                 │
├─────────────────┬────────────────┬────────────────┬────────────────────┤
│   Landing Page  │  ND Profile    │   Agent Panel  │  Convergence Gantt │
│   (Demo Cards)  │   Selector     │  (Suggestions) │  (Event + Tasks)   │
└────────┬────────┴───────┬────────┴───────┬────────┴────────┬───────────┘
         │                │                │                  │
         ▼                ▼                ▼                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          State Layer (Zustand)                           │
├─────────────────────────────────────────────────────────────────────────┤
│  appStore                      │  agentStore                            │
│  ├─ ndProfile                  │  ├─ activeAgents                       │
│  ├─ culminatingEvent           │  ├─ suggestions                        │
│  ├─ ganttConfig                │  ├─ focusSession                       │
│  ├─ theme/language             │  ├─ reminders                          │
│  └─ tasks/filters              │  └─ interactionHistory                 │
└─────────────────────────────────────────────────────────────────────────┘
         │                                │
         ▼                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Persistence Layer                                │
│     localStorage (settings, profile)  │  PostgreSQL (tasks, projects)   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Frontend (`/apps/client`)
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework with hooks |
| TypeScript | Type-safe development |
| Vite | Build tool and dev server |
| Zustand | State management with persistence |
| Tailwind CSS | Utility-first styling |
| Lucide React | Icon library |
| React Router | Client-side routing |

#### Backend (`/apps/server`)
| Technology | Purpose |
|------------|---------|
| Fastify | High-performance API framework |
| Drizzle ORM | Type-safe database operations |
| PostgreSQL | Data persistence |

---

## Data Flow Architecture

### 1. State Management Layer

```typescript
// Main application store (appStore.ts)
interface AppState {
  // ND Profile
  ndProfile: NDProfile | null;
  setNDProfile: (profile: NDProfile | null) => void;

  // Culminating Event
  culminatingEvent: CulminatingEvent | null;
  setCulminatingEvent: (event: CulminatingEvent | null) => void;

  // Gantt Configuration
  ganttConfig: GanttConfig;
  setGanttConfig: (config: Partial<GanttConfig>) => void;

  // UI State
  theme: 'auto' | 'light' | 'dark';
  language: 'es' | 'en';
  viewMode: 'grid' | 'list' | 'gantt';
}

// Agent store (agentStore.ts)
interface AgentStoreState {
  activeAgents: Set<AgentType>;
  suggestions: AgentSuggestion[];
  focusSession: FocusSession | null;
  reminders: Reminder[];
  interactionHistory: AgentInteraction[];
}
```

### 2. Component Layer

```
App
├── LandingPage
│   └── DemoProjectCard[]
│
├── MainApp
│   ├── Header
│   │   ├── NDProfileSelector
│   │   └── LanguageToggle / ThemeToggle
│   │
│   ├── Sidebar (or integrated)
│   │   ├── AgentPanel
│   │   │   ├── AgentSuggestionCard[]
│   │   │   └── FocusTimer
│   │   └── AgentToggle[]
│   │
│   └── MainContent
│       ├── UnifiedToolbar
│       └── GanttChart
│           ├── GanttHeader (with EventSetterModal trigger)
│           ├── GanttTimeline
│           │   ├── EventMarker
│           │   ├── ConvergenceLines (SVG)
│           │   └── GanttTaskBar[]
│           └── GanttTaskList
```

### 3. Type Definitions

```typescript
// ND Profile (types/ndProfile.ts)
interface NDProfile {
  id: string;
  name: string;
  preferences: {
    visual: VisualPreferences;
    time: TimePreferences;
    notifications: NotificationPreferences;
    motivation: MotivationPreferences;
  };
}

// Culminating Event
interface CulminatingEvent {
  id: string;
  name: string;
  nameEn: string;
  date: Date;
  type: 'concert' | 'launch' | 'exam' | 'wedding' | 'presentation' | 'deadline' | 'custom';
  description?: string;
  urgencyLevel?: 'low' | 'medium' | 'high' | 'critical';
}

// Agent types (types/agents.ts)
type AgentType = 'fragmento' | 'timely' | 'palabras' | 'calma' | 'enfoque' | 'fiesta';

interface AgentSuggestion {
  id: string;
  agentType: AgentType;
  type: 'task_breakdown' | 'reminder' | 'communication' | 'calm_down' | 'focus_start' | 'celebration';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  content: { es: string; en: string };
  contextTrigger: string;
  createdAt: Date;
  expiresAt?: Date;
  status: 'pending' | 'dismissed' | 'snoozed' | 'acknowledged';
}
```

---

## UI/UX Architecture

### Design System

- **Colors**: Blue/indigo primary, adaptive to theme
- **Typography**: System fonts, responsive sizing
- **Spacing**: 4px grid system
- **Animations**: Smooth transitions, convergence line animations

### Responsive Breakpoints

```css
sm: 640px   /* Mobile */
md: 768px   /* Tablet */
lg: 1024px  /* Laptop */
xl: 1280px  /* Desktop */
2xl: 1536px /* Large screens */
```

### Accessibility Features

- ARIA labels for screen readers
- Keyboard navigation
- High contrast mode support
- Touch-friendly targets (minimum 44px)
- Reduced motion preferences

---

## Performance Architecture

### Bundle Optimization
- Code splitting by route
- Tree shaking unused code
- Lazy loading components
- Asset optimization

### Runtime Performance
- React.memo for expensive components
- useMemo/useCallback for stability
- Zustand selective subscriptions
- SVG optimization for convergence lines

---

## Security

### Client-Side
- TypeScript type safety
- React's built-in XSS protection
- Input validation

### Data
- localStorage for non-sensitive settings
- PostgreSQL for persistent data
- No sensitive data stored client-side

---

## Development Workflow

```bash
npm run dev          # Client dev server
npm run dev:server   # API server
npm run dev:all      # Both concurrently
npm run build        # Production build
npm run lint         # Code linting
npm test             # Unit tests
npm run test:e2e     # E2E tests
```

---

## Success Metrics

### Performance
- Initial load: < 2 seconds
- Bundle size: < 300KB (gzipped)
- Lighthouse score: > 90

### User Experience
- Mobile responsive: 100% feature parity
- Accessibility: WCAG AA compliant
- ND accommodations: Research-backed defaults

---

*Last Updated: November 2025*
