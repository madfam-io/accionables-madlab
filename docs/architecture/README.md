# Architecture Documentation

This section provides comprehensive documentation of the MADLAB application architecture, covering system design, React patterns, state management, and data flow.

## 📑 Contents

1. **[System Overview](./system-overview.md)** - High-level architecture and technology stack
2. **[React Architecture](./react-architecture.md)** - Component structure and patterns
3. **[State Management](./state-management.md)** - Zustand store design and data flow *(coming soon)*
4. **[Data Flow](./data-flow.md)** - How data moves through the application *(coming soon)*
5. **[Legacy Architecture](./legacy-architecture.md)** - Original architecture design document
6. **[Architecture Comparison](./comparison.md)** - Current vs proposed architecture analysis

## 🏗️ Architecture Principles

### Modern Frontend Architecture
- **Component-based**: Modular React components with clear responsibilities
- **Type Safety**: Full TypeScript coverage for reliability
- **State Management**: Centralized Zustand store with persistence
- **Performance**: Optimized rendering and bundle splitting

### Design Patterns
- **Single Responsibility**: Each component has one clear purpose
- **Composition over Inheritance**: Flexible component composition
- **Immutable State**: Predictable state updates
- **Separation of Concerns**: Clear boundaries between UI, logic, and data

## 🔄 Data Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   projectData   │ -> │   appStore      │ -> │   Components    │
│   (static)      │    │   (Zustand)     │    │   (React)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                       ┌─────────────────┐
                       │  localStorage   │
                       │  (persistence)  │
                       └─────────────────┘
```

## 🎨 UI Architecture

```
App.tsx
├── Header (navigation, theme, language)
├── UnifiedToolbar (search, filters, grouping, export)
├── StatsGrid (project metrics)
├── Content Views
│   ├── ListView → PhaseSection → EnhancedTaskCard
│   ├── GridView → TaskCard
│   ├── GanttChart → Timeline + TaskBars
│   └── GroupedTaskView → Dynamic grouping
├── TeamSummary (team statistics)
└── LoadingOverlay (async states)
```

## 📦 Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + TypeScript | UI components and type safety |
| **State** | Zustand | Lightweight state management |
| **Styling** | Tailwind CSS | Utility-first styling |
| **Build** | Vite | Fast development and builds |
| **Icons** | Lucide React | Consistent iconography |
| **Persistence** | localStorage | Theme and settings persistence |

## 🔍 Next Steps

- Review [React Architecture](./react-architecture.md) for component patterns
- Understand [State Management](./state-management.md) for data handling
- Explore [Data Flow](./data-flow.md) for system interactions