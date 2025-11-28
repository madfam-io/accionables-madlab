# MADLAB Documentation

## Event Convergence Orchestrator for Neurodivergent Minds

> **"The tool adapts to you, not the other way around."**

MADLAB transforms how neurodivergent people plan toward big moments. Instead of traditional project management where you work forward from today, everything flows backward from your **culminating event** - a concert, product launch, wedding, or any pivotal deadline.

---

## Quick Start

### For Users
1. Visit the landing page
2. Click a demo project (Spring Concert, App Launch, etc.)
3. Select your ND profile (ADHD, Autism, Dyslexia, or customize)
4. Watch your tasks converge toward your event

### For Developers
```bash
# Install dependencies
npm install

# Start development (client + server)
npm run dev:all

# Or just the client
npm run dev

# Build for production
npm run build
```

---

## Documentation Hub

### Core Features
| Feature | Description | Docs |
|---------|-------------|------|
| **Convergence Gantt** | Timeline where tasks flow toward your event | [convergence-gantt.md](./features/convergence-gantt.md) |
| **ND Profile System** | Adaptive UI for different neurotypes | [nd-profiles.md](./features/nd-profiles.md) |
| **AI Agent System** | Specialized assistants for executive function | [ai-agents.md](./features/ai-agents.md) |
| **Demo Projects** | One-click instant demos | [demo-projects.md](./features/demo-projects.md) |

### Documentation Sections

| Section | Description |
|---------|-------------|
| **[Features](./features/README.md)** | All product features with implementation details |
| **[Architecture](./architecture/README.md)** | System design and patterns |
| **[Components](./components/README.md)** | React component library |
| **[API Reference](./api/README.md)** | Store and utility APIs |
| **[Developer Guides](./guides/README.md)** | Integration and workflow guides |
| **[Product Vision](./product/PRODUCT_VISION.md)** | Product strategy |
| **[Brand](./brand/BRAND_POSITIONING.md)** | Brand guidelines |

---

## The Product

### Core Innovation

**Convergence-based planning** - Instead of time flowing forward, everything converges toward the big moment:

```
                    Tasks                              Event
                      │                                  │
     ─────●─────────────────────────────────────────────▶
            ───●──────────────────────────────────────▶
                  ────●───────────────────────────────▶
                         ─────●──────────────────────▶
                                  ───●──────────────▶
                                         ──●───────▶
                                                   🎯
```

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

### ND Profiles

The UI adapts based on how your brain works:

- **ADHD**: Reduced visual noise, visible timers, frequent dopamine hits
- **Autism**: Predictable patterns, advance warnings, reduced surprises
- **Dyslexia**: High contrast, larger text, visual indicators over text
- **Custom**: Calibrate every preference to your needs

---

## Technology Stack

### Frontend (`/apps/client`)
- **React 18** - UI framework with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Zustand** - State management with persistence
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing

### Backend (`/apps/server`)
- **Fastify** - API framework
- **Drizzle ORM** - Database operations
- **PostgreSQL** - Data persistence

### Testing
- **Vitest** - Unit testing
- **Playwright** - E2E testing

---

## Project Structure

```
apps/
├── client/
│   └── src/
│       ├── components/         # React components
│       │   ├── Agents/         # Agent UI
│       │   └── GanttChart/     # Convergence Gantt
│       ├── hooks/              # Custom React hooks
│       ├── stores/             # Zustand stores
│       ├── types/              # TypeScript definitions
│       ├── data/               # Static data
│       └── pages/              # Page components
└── server/
    └── src/
        ├── routes/             # API endpoints
        └── db/                 # Database schema

docs/
├── features/                   # Feature documentation
├── architecture/               # System design
├── components/                 # Component reference
├── api/                        # API documentation
├── guides/                     # Developer guides
├── product/                    # Product vision
└── brand/                      # Brand guidelines
```

---

## Commands

```bash
# Development
npm run dev              # Client dev server (localhost:5173)
npm run dev:server       # API server (localhost:3001)
npm run dev:all          # Both concurrently

# Testing
npm test                 # Unit tests
npm run test:e2e         # E2E tests

# Building
npm run build            # Production build

# Database (Docker)
npm run docker:up        # Start PostgreSQL
npm run docker:down      # Stop PostgreSQL
```

---

## Key Features

### Implemented
- Convergence Gantt with culminating events
- ND Profile system with presets
- AI Agent architecture (types and store)
- Demo projects from landing page
- Bilingual support (ES/EN)
- Theme system (Auto/Light/Dark)
- Task management with filtering
- Multi-format export (PDF/CSV/JSON/TXT)
- Responsive design

### Coming Soon
- Full agent behavior implementation
- Real-time collaboration
- Mobile app
- Calendar integrations

---

## Contributing

1. Read the [Frontend Integration Guide](./guides/FRONTEND_INTEGRATION_GUIDE.md)
2. Follow the [Development Workflow](./guides/development-workflow.md)
3. Check [Component Reference](./components/COMPONENTS_REFERENCE.md) for patterns
4. Review [Accessibility Guide](./guides/ACCESSIBILITY.md)

---

**MADLAB v3.0** | Event Convergence Orchestrator for Neurodivergent Minds

*Built for brains that work differently*

*Last Updated: November 2025*
