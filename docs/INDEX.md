# MADLAB Documentation Index

Complete documentation index for MADLAB - the Event Convergence Orchestrator designed for neurodivergent minds. This index serves as the central navigation hub for developers, contributors, and users.

---

## Product Vision

> **"The tool adapts to you, not the other way around."**

MADLAB transforms how neurodivergent people plan toward big moments. Instead of traditional project management, everything flows backward from your culminating event - a concert, product launch, wedding, or any pivotal deadline.

**Core Innovation**: Convergence-based planning with specialized AI agents that fill executive function gaps.

---

## Quick Start

### For Users
1. Visit the [Landing Page](../apps/client/src/pages/LandingPage.tsx)
2. Try a one-click demo (Spring Concert, App Launch, etc.)
3. Select your ND profile (ADHD, Autism, Dyslexia, or customize)
4. Watch your tasks converge toward your event

### For Developers
1. Review [System Overview](./architecture/system-overview.md)
2. Study [React Architecture](./architecture/react-architecture.md)
3. Explore [Feature Documentation](./features/README.md)
4. Read [Frontend Integration Guide](./guides/FRONTEND_INTEGRATION_GUIDE.md)

---

## Core Features

| Feature | Description | Documentation | Status |
|---------|-------------|---------------|--------|
| **Convergence Gantt** | Timeline where tasks flow toward your event | [convergence-gantt.md](./features/convergence-gantt.md) | Implemented |
| **ND Profile System** | Adaptive UI for different neurotypes | [nd-profiles.md](./features/nd-profiles.md) | Implemented |
| **AI Agent System** | Specialized assistants for executive function | [ai-agents.md](./features/ai-agents.md) | Architecture Ready |
| **Demo Projects** | One-click instant demos from landing | [demo-projects.md](./features/demo-projects.md) | Implemented |
| **Task Management** | CRUD, filtering, grouping, export | [task-management.md](./features/task-management.md) | Complete |

### AI Agents

Six specialized agents that fill executive function gaps:

| Agent | Purpose | ND Benefit |
|-------|---------|------------|
| **Fragmento** | Task breakdown | Reduces "where do I start" paralysis |
| **Timely** | Context-aware reminders | Makes time visible |
| **Palabras** | Communication drafts | Removes writing paralysis |
| **Calma** | Overwhelm detection | Prevents shutdown/meltdown |
| **Enfoque** | Focus sessions | Body-doubling companion |
| **Fiesta** | Celebrations | Dopamine hits for progress |

---

## Documentation Structure

### Features
- **[Features Overview](./features/README.md)** - All product features
- **[ND Profile System](./features/nd-profiles.md)** - Adaptive UI documentation
- **[AI Agent System](./features/ai-agents.md)** - Agent architecture and behavior
- **[Convergence Gantt](./features/convergence-gantt.md)** - Timeline visualization
- **[Demo Projects](./features/demo-projects.md)** - One-click demo system

### Product & Brand
- **[Product Vision](./product/PRODUCT_VISION.md)** - Complete product strategy
- **[Brand Positioning](./brand/BRAND_POSITIONING.md)** - Brand guidelines

### Architecture
- **[Architecture Overview](./architecture/README.md)** - System design and patterns
- **[System Overview](./architecture/system-overview.md)** - High-level architecture
- **[React Architecture](./architecture/react-architecture.md)** - Component patterns
- **[State Management](./api/state-management.md)** - Zustand store design

### Components
- **[Components Overview](./components/README.md)** - Component library guide
- **[Components Reference](./components/COMPONENTS_REFERENCE.md)** - Detailed component APIs

### API Reference
- **[API Overview](./api/README.md)** - Complete API reference
- **[State Management](./api/state-management.md)** - Store interfaces

### Developer Guides
- **[Guides Overview](./guides/README.md)** - Developer workflow guides
- **[Frontend Integration](./guides/FRONTEND_INTEGRATION_GUIDE.md)** - Complete frontend guide
- **[Accessibility Guide](./guides/ACCESSIBILITY.md)** - Accessibility standards

### Development
- **[Development Overview](./development/README.md)** - Implementation guides
- **[Business Logic](./development/BUSINESS_LOGIC_IMPLEMENTATION.md)** - Core logic
- **[Testing Guide](./development/TESTING.md)** - Testing strategies

### Tutorials
- **[Tutorials Overview](./tutorials/README.md)** - Hands-on learning
- **[Adding Tasks](./tutorials/adding-tasks.md)** - Task management tutorial
- **[Advanced Tutorials](./tutorials/ADVANCED_TUTORIALS.md)** - Advanced techniques

### Infrastructure & Deployment
- **[Infrastructure Overview](./infrastructure/README.md)** - Infrastructure setup
- **[Deployment Overview](./deployment/README.md)** - Production deployment

---

## Feature Integration Map

```
                    ┌─────────────────────────────────────┐
                    │           Landing Page              │
                    │       (Demo Project Cards)          │
                    └─────────────────┬───────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Main App                                        │
│                                                                              │
│  ┌─────────────┐  ┌─────────────────┐  ┌─────────────┐  ┌───────────────┐  │
│  │ ND Profile  │  │   Agent Panel   │  │ Convergence │  │    Event      │  │
│  │  Selector   │  │  (Suggestions)  │  │   Gantt     │  │   Marker      │  │
│  └──────┬──────┘  └────────┬────────┘  └──────┬──────┘  └───────┬───────┘  │
│         │                  │                  │                  │          │
│         └──────────────────┼──────────────────┼──────────────────┘          │
│                            │                  │                              │
│                            ▼                  ▼                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                        Zustand Stores                                  │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐       │  │
│  │  │   appStore      │  │   agentStore    │  │  (future)       │       │  │
│  │  │ - ndProfile     │  │ - suggestions   │  │                 │       │  │
│  │  │ - ganttConfig   │  │ - focusSession  │  │                 │       │  │
│  │  │ - event         │  │ - reminders     │  │                 │       │  │
│  │  │ - theme         │  │ - interactions  │  │                 │       │  │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend (`/apps/client`)
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework with hooks |
| TypeScript | Type-safe development |
| Vite | Build tool and dev server |
| Zustand | State management with persistence |
| Tailwind CSS | Utility-first styling |
| Lucide React | Icon library |
| React Router | Client-side routing |

### Backend (`/apps/server`)
| Technology | Purpose |
|------------|---------|
| Fastify | API framework |
| Drizzle ORM | Database operations |
| PostgreSQL | Data persistence |

### Testing
| Technology | Purpose |
|------------|---------|
| Vitest | Unit testing |
| Playwright | E2E testing |

---

## Key Directories

```
apps/
├── client/
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Agents/         # Agent UI (Panel, Suggestions, Timer)
│   │   │   ├── GanttChart/     # Convergence Gantt visualization
│   │   │   └── ...             # Other UI components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── stores/             # Zustand stores (app, agent)
│   │   ├── types/              # TypeScript definitions
│   │   │   ├── ndProfile.ts    # ND profile types
│   │   │   └── agents.ts       # Agent system types
│   │   ├── data/               # Static data
│   │   │   ├── ndProfiles.ts   # Profile presets
│   │   │   └── demoProjects.ts # Demo project templates
│   │   ├── pages/              # Page components
│   │   │   └── LandingPage.tsx # Marketing landing
│   │   └── api/                # API client
│   └── e2e/                    # E2E tests
└── server/
    └── src/
        ├── routes/             # API endpoints
        └── db/                 # Database schema
docs/
├── features/                   # Feature documentation
├── product/                    # Product vision
├── brand/                      # Brand guidelines
├── architecture/               # System design
├── components/                 # Component reference
├── api/                        # API documentation
├── guides/                     # Developer guides
├── development/                # Implementation guides
├── tutorials/                  # Learning tutorials
├── infrastructure/             # Infrastructure docs
└── deployment/                 # Deployment guides
```

---

## Common Commands

```bash
# Development
npm run dev              # Start client dev server (localhost:5173)
npm run dev:server       # Start API server (localhost:3001)
npm run dev:all          # Start both concurrently

# Testing
npm test                 # Run unit tests
npm run test:e2e         # Run Playwright E2E tests

# Building
npm run build            # Build all workspaces

# Docker (for PostgreSQL)
npm run docker:up        # Start PostgreSQL container
npm run docker:down      # Stop container
```

---

## Cross-Reference Map

| If you're looking for... | Go to... |
|--------------------------|----------|
| How profiles adapt the UI | [nd-profiles.md](./features/nd-profiles.md) |
| Agent behavior and types | [ai-agents.md](./features/ai-agents.md) |
| Convergence visualization | [convergence-gantt.md](./features/convergence-gantt.md) |
| Demo project setup | [demo-projects.md](./features/demo-projects.md) |
| State management patterns | [state-management.md](./api/state-management.md) |
| Component APIs | [COMPONENTS_REFERENCE.md](./components/COMPONENTS_REFERENCE.md) |
| Product strategy | [PRODUCT_VISION.md](./product/PRODUCT_VISION.md) |
| Brand guidelines | [BRAND_POSITIONING.md](./brand/BRAND_POSITIONING.md) |

---

## External Resources

- **[React Documentation](https://react.dev)** - React 18 features
- **[TypeScript Handbook](https://typescriptlang.org/docs)** - TypeScript reference
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Utility-first CSS
- **[Zustand](https://github.com/pmndrs/zustand)** - State management
- **[Vite Guide](https://vitejs.dev/guide)** - Build tool

---

## Documentation Roadmap

### Completed
- [x] Architecture documentation
- [x] State management documentation
- [x] ND Profile System documentation
- [x] AI Agent System documentation
- [x] Convergence Gantt documentation
- [x] Demo Projects documentation
- [x] Product Vision documentation
- [x] Brand Positioning documentation
- [x] Features overview and README

### In Progress
- [ ] Complete component documentation
- [ ] Advanced tutorials
- [ ] Testing documentation

### Planned
- [ ] Interactive examples
- [ ] Video tutorials
- [ ] Plugin development guides

---

**MADLAB Documentation v3.0** | Event Convergence Orchestrator for Neurodivergent Minds

*36+ documentation files | Comprehensive guides | Last Updated: November 2025*

*Built for brains that work differently*
