# Demo Projects & Landing Page

> **Status**: Implemented
> **Location**: `apps/client/src/data/demoProjects.ts`, `apps/client/src/pages/LandingPage.tsx`

The demo projects system allows visitors to instantly experience MADLAB's convergence flow without signup.

---

## Overview

### Core Principle
> "No signup required. Experience the flow instantly."

Visitors can click any demo project card and immediately see the app with a pre-configured culminating event.

---

## Demo Projects

### Available Projects

| Project | Icon | Days | Category | Event Type |
|---------|------|------|----------|------------|
| Spring Concert | 🎵 | 21 | Creative | concert |
| App Launch | 🚀 | 14 | Professional | launch |
| Final Exam | 📝 | 10 | Academic | exam |
| Team Retreat | 🏕️ | 28 | Professional | retreat |
| Investor Pitch | 🎤 | 7 | Professional | presentation |
| My Wedding | 💒 | 60 | Personal | custom |

### DemoProject Interface

```typescript
// Location: apps/client/src/data/demoProjects.ts

interface DemoProject {
  id: string;
  name: string;           // Spanish name
  nameEn: string;         // English name
  description: string;
  descriptionEn: string;
  icon: string;           // Emoji icon
  gradient: string;       // Tailwind gradient classes
  event: CulminatingEvent;
  taskCount: number;      // Displayed task count
  daysUntilEvent: number; // Days from now
  category: 'creative' | 'academic' | 'professional' | 'personal';
}
```

### Example Project Definition

```typescript
{
  id: 'concert',
  name: 'Concierto de Primavera',
  nameEn: 'Spring Concert',
  description: 'Organiza un concierto indie en un venue local.',
  descriptionEn: 'Organize an indie concert at a local venue.',
  icon: '🎵',
  gradient: 'from-purple-500 to-pink-500',
  event: {
    id: 'demo-concert',
    name: 'Concierto de Primavera',
    nameEn: 'Spring Concert',
    date: daysFromNow(21),
    type: 'concert',
  },
  taskCount: 24,
  daysUntilEvent: 21,
  category: 'creative',
}
```

---

## Landing Page

### Location
`apps/client/src/pages/LandingPage.tsx`

### Routing
```tsx
// In main.tsx
<Route path="/" element={<LandingPage />} />
<Route path="/app" element={<App />} />
```

### Key Sections

1. **Hero Section**
   - Brand headline: "Project management that gets your brain"
   - Waitlist signup form
   - Theme toggle (light/dark)

2. **Value Propositions**
   - Visual Calm
   - AI That Helps
   - Event Convergence
   - Time Blindness Aids
   - Multiplayer First
   - ND Profiles

3. **Demo Projects Section**
   - "No signup required" badge
   - 6 project cards in grid
   - One-click instant access

4. **Problem Statement**
   - "You've tried everything"
   - Comparison to existing tools

5. **Final CTA**
   - Waitlist signup repeat
   - "Or start with a blank canvas" link

### Demo Card Component

```tsx
function DemoProjectCard({ project, theme, onTry }: DemoProjectCardProps) {
  return (
    <div onClick={onTry} className="group cursor-pointer rounded-2xl">
      {/* Gradient header with icon */}
      <div className={`h-24 bg-gradient-to-r ${project.gradient}`}>
        <span className="text-5xl">{project.icon}</span>
        <div className="badge">{project.daysUntilEvent} days</div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3>{project.nameEn}</h3>
        <p>{project.descriptionEn}</p>
        <button>
          <Play /> Try it
        </button>
      </div>
    </div>
  );
}
```

---

## Try Demo Flow

### Implementation

```typescript
const handleTryDemo = (project: DemoProject) => {
  // 1. Set the culminating event from demo project
  setCulminatingEvent(project.event);

  // 2. Configure Gantt for convergence view
  setGanttConfig({
    showConvergence: true,
    startDate: new Date(),
    endDate: new Date(project.event.date.getTime() + 7 * 24 * 60 * 60 * 1000),
  });

  // 3. Navigate to app
  navigate('/app');
};
```

### User Experience
1. User clicks project card
2. Event is set in store (persisted)
3. Gantt config updated
4. Immediate redirect to `/app`
5. User sees convergence Gantt with event marker

---

## Styling

### Card Gradients
Each project has a unique gradient:

```typescript
const gradients = {
  concert: 'from-purple-500 to-pink-500',
  launch: 'from-blue-500 to-cyan-500',
  exam: 'from-emerald-500 to-teal-500',
  retreat: 'from-amber-500 to-orange-500',
  pitch: 'from-red-500 to-rose-500',
  wedding: 'from-pink-500 to-fuchsia-500',
};
```

### Theme Support
Landing page supports light and dark themes:

```tsx
const [theme, setTheme] = useState<'light' | 'dark'>('dark');

// Dark mode
'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900'

// Light mode
'bg-gradient-to-b from-stone-50 via-white to-stone-100'
```

---

## Waitlist Integration

### Current State
The waitlist form logs to console (placeholder):

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // TODO: Integrate with email service
  console.log('Waitlist signup:', email);
  setSubmitted(true);
};
```

### Future Integration
Planned integrations:
- Resend for transactional emails
- ConvertKit or Buttondown for newsletter
- PostHog for analytics

---

## Helper Functions

### daysFromNow

```typescript
const daysFromNow = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(20, 0, 0, 0); // Default to 8 PM
  return date;
};
```

### getDemoProject

```typescript
export const getDemoProject = (id: string): DemoProject | undefined => {
  return DEMO_PROJECTS.find(p => p.id === id);
};

export const getDemoProjectsByCategory = (
  category: DemoProject['category']
): DemoProject[] => {
  return DEMO_PROJECTS.filter(p => p.category === category);
};
```

---

## Related Documentation

- [Convergence Gantt](./convergence-gantt.md) - Event visualization
- [Brand Positioning](../brand/BRAND_POSITIONING.md) - Marketing copy guidelines
- [Product Vision](../product/PRODUCT_VISION.md) - Event types and scenarios

---

*Last Updated: November 2025*
