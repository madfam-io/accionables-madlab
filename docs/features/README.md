# Features Documentation

This directory contains documentation for MADLAB's core features. Each feature is documented with its purpose, implementation details, and integration points.

---

## Core Features

### 🧠 [Neurodivergency Profile System](./nd-profiles.md)
Adaptive UI based on how your brain works. Presets for ADHD, Autism, and Dyslexia, plus custom calibration.

**Key Concepts**:
- Profile presets with research-backed defaults
- Visual, time, notification, and motivation preferences
- CSS class-based adaptation
- Agent behavior integration

---

### 🤖 [AI Agent System](./ai-agents.md)
Specialized AI assistants that fill executive function gaps.

**Agent Types**:
- 🧩 **Fragmento** - Task breakdown
- ⏰ **Timely** - Time awareness
- ✍️ **Palabras** - Communication help
- 🌊 **Calma** - Overwhelm detection
- 🎯 **Enfoque** - Focus sessions
- 🎉 **Fiesta** - Celebrations

---

### 📊 [Convergence Gantt](./convergence-gantt.md)
Timeline visualization where everything flows toward the culminating event.

**Key Concepts**:
- Culminating event as focal point
- Visual convergence lines (SVG bezier curves)
- Time blindness aids
- Urgency color coding

---

### 🚀 [Demo Projects & Landing Page](./demo-projects.md)
One-click demo access from the marketing landing page.

**Demo Projects**:
- Spring Concert (21 days)
- App Launch (14 days)
- Final Exam (10 days)
- Team Retreat (28 days)
- Investor Pitch (7 days)
- My Wedding (60 days)

---

### ✅ [Task Management](./task-management.md)
Core task CRUD operations with filtering, grouping, and export.

*(Existing documentation)*

---

## Feature Integration Map

```
┌─────────────────────────────────────────────────────────────┐
│                      Landing Page                            │
│                  (Demo Project Cards)                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     Main App                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ ND Profile  │  │   Agents    │  │ Convergence │         │
│  │  Selector   │  │   Panel     │  │   Gantt     │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                  │
│         ▼                ▼                ▼                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Zustand App Store                       │   │
│  │  - ndProfile       - agents          - ganttConfig   │   │
│  │  - theme           - suggestions     - event         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Links

| Feature | Status | Primary File |
|---------|--------|--------------|
| ND Profiles | ✅ Implemented | `types/ndProfile.ts` |
| AI Agents | ✅ Architecture | `types/agents.ts` |
| Convergence Gantt | ✅ Implemented | `components/GanttChart/` |
| Demo Projects | ✅ Implemented | `data/demoProjects.ts` |
| Task Management | ✅ Complete | `data/tasks.ts` |

---

## Related Documentation

- [Product Vision](../product/PRODUCT_VISION.md) - Overall product strategy
- [Brand Positioning](../brand/BRAND_POSITIONING.md) - Brand guidelines
- [Architecture Overview](../architecture/README.md) - System design
- [Components Reference](../components/COMPONENTS_REFERENCE.md) - UI components

---

*Last Updated: November 2025*
