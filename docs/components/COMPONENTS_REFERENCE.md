# Components Reference

Complete API reference for all MADLAB React components.

## Core Components

### Header

**Location**: `src/components/Header.tsx`

Main application header with language/theme controls and branding.

```typescript
interface HeaderProps {}

export const Header: React.FC<HeaderProps>
```

**Features**:
- Bilingual language toggle (ES/EN)
- Theme selector (Auto/Light/Dark)
- MADLAB branding with logo
- Fully accessible with ARIA labels

**Usage**:
```tsx
import { Header } from './components/Header';

<Header />
```

**Accessibility**:
- `aria-label` on language toggle: "Switch language. Current: {LANG}"
- `aria-pressed` on theme buttons indicating active state
- `role="group"` on theme selector with label
- All icons marked `aria-hidden="true"`

---

### StatsGrid

**Location**: `src/components/StatsGrid.tsx`

Displays project statistics in a responsive grid layout.

```typescript
interface StatsGridProps {}

export const StatsGrid: React.FC<StatsGridProps>
```

**Statistics Shown**:
- Total Tasks (filtered count)
- Project Days (81 days: Aug 11 - Oct 31)
- Estimated Hours (sum of all task hours)
- Team Members (unique assignees, excluding collective terms)

**Features**:
- Responsive grid (2 columns mobile, 4 desktop)
- Live updates when filters change
- ARIA live region for screen readers
- Dark mode support

**Usage**:
```tsx
import { StatsGrid } from './components/StatsGrid';

<StatsGrid />
```

**Accessibility**:
- `role="region"` with descriptive label
- `aria-live="polite"` announces changes
- `aria-atomic="false"` for partial updates

---

### ProgressBar

**Location**: `src/components/ProgressBar.tsx`

Accessible progress indicator with semantic ARIA roles.

```typescript
interface ProgressBarProps {
  value: number;           // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps>
```

**Props**:
- `value` (required): Progress percentage (0-100)
- `size`: Size variant ('sm' | 'md' | 'lg'), defaults to 'md'
- `showLabel`: Display percentage text, defaults to false
- `className`: Additional Tailwind classes

**Usage**:
```tsx
<ProgressBar value={75} size="lg" showLabel />
```

**Accessibility**:
- `role="progressbar"` for semantic meaning
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax` attributes
- `aria-label` describes current progress

---

### TaskCard

**Location**: `src/components/TaskCard.tsx`

Individual task card display with metadata and status.

```typescript
interface TaskCardProps {
  task: Task;
  view?: 'grid' | 'list';
}

export const TaskCard: React.FC<TaskCardProps>
```

**Features**:
- Task name (bilingual)
- Assignee avatar and name
- Estimated hours
- Difficulty level badge
- Dependency indicators
- Progress bar
- Hover effects

**Usage**:
```tsx
<TaskCard task={task} view="grid" />
```

---

### EnhancedTaskCard

**Location**: `src/components/EnhancedTaskCard.tsx`

Extended task card with status controls and detailed metadata.

```typescript
interface EnhancedTaskCardProps {
  task: Task;
  view?: 'grid' | 'list';
  showStatus?: boolean;
}

export const EnhancedTaskCard: React.FC<EnhancedTaskCardProps>
```

**Additional Features** (vs TaskCard):
- Task status control
- Weekly progress tracking
- Collapsible details
- Notes section
- Dependency visualization

**Usage**:
```tsx
<EnhancedTaskCard task={task} showStatus={true} />
```

---

### PhaseSection

**Location**: `src/components/PhaseSection.tsx`

Collapsible section for displaying tasks grouped by phase.

```typescript
interface PhaseSectionProps {
  phase: number;  // 1-5
}

export const PhaseSection: React.FC<PhaseSectionProps>
```

**Features**:
- Collapsible/expandable
- Phase title (bilingual)
- Task count badge
- Progress indicator
- Filtered task list

**Usage**:
```tsx
{[1, 2, 3, 4, 5].map(phase => (
  <PhaseSection key={phase} phase={phase} />
))}
```

---

### GroupedTaskView

**Location**: `src/components/GroupedTaskView.tsx`

Displays tasks grouped by selected grouping option.

```typescript
interface GroupedTaskViewProps {}

export const GroupedTaskView: React.FC<GroupedTaskViewProps>
```

**Grouping Options**:
- By assignee
- By difficulty level
- By week

**Features**:
- Dynamic grouping based on store state
- Empty state messaging
- Responsive layout
- Collapsible groups

**Usage**:
```tsx
<GroupedTaskView />
```

---

### TeamSummary

**Location**: `src/components/TeamSummary.tsx`

Team member statistics and workload visualization.

```typescript
interface TeamSummaryProps {}

export const TeamSummary: React.FC<TeamSummaryProps>
```

**Features**:
- Per-member task count
- Total hours allocated
- Average difficulty
- Progress tracking
- Responsive grid layout

**Usage**:
```tsx
<TeamSummary />
```

---

## Toolbar Components

### UnifiedToolbarV2

**Location**: `src/components/UnifiedToolbarV2.tsx`

Main toolbar with filters, search, and view controls.

```typescript
interface UnifiedToolbarV2Props {}

export const UnifiedToolbarV2: React.FC<UnifiedToolbarV2Props>
```

**Features**:
- Search input
- Assignee filter dropdown
- Difficulty filter dropdown
- Grouping selector
- View mode toggle (List/Grid/Gantt)
- Export button
- Responsive layout (stacks on mobile)

**Usage**:
```tsx
<UnifiedToolbarV2 />
```

---

### FilterBar

**Location**: `src/components/FilterBar.tsx`

Standalone filter controls.

```typescript
interface FilterBarProps {
  compact?: boolean;
}

export const FilterBar: React.FC<FilterBarProps>
```

**Usage**:
```tsx
<FilterBar compact={false} />
```

---

### FilterChips

**Location**: `src/components/FilterChips.tsx`

Active filter chips with remove capability.

```typescript
interface FilterChipsProps {}

export const FilterChips: React.FC<FilterChipsProps>
```

**Features**:
- Shows active filters as chips
- Click to remove individual filter
- "Clear all" button when multiple active

**Usage**:
```tsx
<FilterChips />
```

---

### GroupingSelector

**Location**: `src/components/GroupingSelector.tsx`

Dropdown for selecting task grouping option.

```typescript
export type GroupingOption = 'phase' | 'assignee' | 'difficulty' | 'week';

interface GroupingSelectorProps {
  compact?: boolean;
}

export const GroupingSelector: React.FC<GroupingSelectorProps>
```

**Usage**:
```tsx
<GroupingSelector compact={false} />
```

---

## Gantt Chart Components

### GanttChart

**Location**: `src/components/GanttChart/GanttChart.tsx`

Main Gantt chart container component.

```typescript
interface GanttChartProps {}

export const GanttChart: React.FC<GanttChartProps>
```

**Features**:
- Timeline view of all tasks
- Dependency visualization
- Critical path highlighting
- Zoom controls
- Time scale selector (Days/Weeks/Months)
- Drag to adjust dates
- Multi-level grouping

**Usage**:
```tsx
<GanttChart />
```

**Sub-components**:
- `GanttHeader`: Controls and configuration
- `GanttTimeline`: Date/time grid
- `GanttTaskList`: Left sidebar task list
- `GanttTaskBar`: Individual task bar
- `GanttContent`: Main chart area
- `GanttTimeScale`: Time axis
- `GanttSyncedScroll`: Synchronized scrolling

---

## Modal Components

### ExportModal

**Location**: `src/components/ExportModal.tsx`

Modal for exporting project data.

```typescript
interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps>
```

**Features**:
- Multiple format support (PDF, CSV, JSON, TXT)
- Customizable options
- Preview before export
- Bilingual labels

**Usage**:
```tsx
<ExportModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
```

---

### EnhancedExportModal

**Location**: `src/components/EnhancedExportModal.tsx`

Extended export modal with additional options.

```typescript
interface EnhancedExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnhancedExportModal: React.FC<EnhancedExportModalProps>
```

**Additional Features**:
- Column selection
- Filter export scope
- Custom filename
- Date range selection
- Include/exclude options

**Usage**:
```tsx
<EnhancedExportModal isOpen={isOpen} onClose={handleClose} />
```

---

## Utility Components

### LoadingOverlay

**Location**: `src/components/LoadingOverlay.tsx`

Full-screen loading indicator.

```typescript
interface LoadingOverlayProps {}

export const LoadingOverlay: React.FC<LoadingOverlayProps>
```

**Features**:
- Animated spinner
- Optional loading message
- Backdrop overlay
- Controlled by global store

**Usage**:
```tsx
<LoadingOverlay />

// Trigger from anywhere:
useAppStore.getState().setLoading(true, 'Loading tasks...');
```

---

### LoadingSpinner

**Location**: `src/components/LoadingSpinner.tsx`

Inline loading spinner component.

```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps>
```

**Usage**:
```tsx
<LoadingSpinner size="md" color="blue" />
```

---

### Tooltip

**Location**: `src/components/Tooltip.tsx`

Accessible tooltip component.

```typescript
interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps>
```

**Features**:
- Keyboard accessible
- Positioning options
- Dark mode support
- Auto-hiding

**Usage**:
```tsx
<Tooltip content="Click to expand" position="top">
  <button>Expand</button>
</Tooltip>
```

---

## Accessibility Components

### ScreenReaderAnnouncer

**Location**: `src/components/ScreenReaderAnnouncer.tsx`

Invisible component that announces changes to screen readers.

```typescript
interface ScreenReaderAnnouncerProps {}

export const ScreenReaderAnnouncer: React.FC<ScreenReaderAnnouncerProps>
```

**Announces**:
- Filter changes
- Search queries
- View mode switches
- Grouping changes
- Result counts

**Usage**:
```tsx
<ScreenReaderAnnouncer />
```

**Implementation**:
- Uses ARIA live regions
- `aria-live="polite"` for non-urgent updates
- `aria-atomic="true"` for complete messages
- Automatically tracks store changes

---

### KeyboardShortcutsHelp

**Location**: `src/components/KeyboardShortcutsHelp.tsx`

Modal displaying available keyboard shortcuts.

```typescript
interface KeyboardShortcutsHelpProps {}

export const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps>
```

**Features**:
- Press `?` or `Ctrl+/` to open
- Grouped shortcuts by category
- Bilingual descriptions
- Floating action button
- Escape to close

**Usage**:
```tsx
<KeyboardShortcutsHelp />
```

**Shortcut Categories**:
1. Navigation (Tab, Shift+Tab, Enter, Esc)
2. Accessibility (Alt+1, Alt+2)
3. Views (G for Gantt, L for List)
4. Help (?, Ctrl+/)

---

## Task Status Components

### TaskStatusControl

**Location**: `src/components/TaskStatusControl.tsx`

Control for updating task status and progress.

```typescript
interface TaskStatusControlProps {
  taskId: string;
  currentStatus?: TaskStatus;
}

export type TaskStatus = 'not-started' | 'in-progress' | 'completed' | 'blocked';

export const TaskStatusControl: React.FC<TaskStatusControlProps>
```

**Features**:
- Status dropdown
- Progress slider
- Notes textarea
- Auto-save
- User tracking

**Usage**:
```tsx
<TaskStatusControl taskId={task.id} currentStatus={status} />
```

---

### UserSwitcher

**Location**: `src/components/UserSwitcher.tsx`

Switch between team member views.

```typescript
interface UserSwitcherProps {
  compact?: boolean;
}

export const UserSwitcher: React.FC<UserSwitcherProps>
```

**Features**:
- Quick user switching
- Current user indicator
- Avatar display
- Updates current user in store

**Usage**:
```tsx
<UserSwitcher compact={false} />
```

---

## Best Practices

### Component Structure

```tsx
// 1. Imports
import { React, hooks } from 'react';
import { Types } from '../data/types';
import { Store } from '../stores/appStore';
import { Utils } from '../utils';

// 2. Type definitions
interface ComponentProps {
  required: string;
  optional?: number;
}

// 3. Component
export const Component: React.FC<ComponentProps> = ({
  required,
  optional = defaultValue,
}) => {
  // Hooks
  const storeValue = useAppStore(state => state.value);

  // State
  const [localState, setLocalState] = useState(initial);

  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);

  // Handlers
  const handleEvent = () => {
    // Logic
  };

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

### Performance Optimization

```tsx
// 1. Memo for expensive components
export const Component = React.memo(({ data }) => {
  return <ExpensiveRender data={data} />;
});

// 2. useMemo for expensive calculations
const computed = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);

// 3. useCallback for stable callbacks
const handleClick = useCallback(() => {
  doSomething(value);
}, [value]);

// 4. Lazy loading
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### Accessibility Guidelines

```tsx
// 1. Semantic HTML
<button onClick={handleClick}>Click</button>  // ✅
<div onClick={handleClick}>Click</div>        // ❌

// 2. ARIA labels
<button aria-label="Close dialog">
  <X aria-hidden="true" />
</button>

// 3. Keyboard support
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>

// 4. Live regions
<div role="status" aria-live="polite">
  {message}
</div>
```

---

## Testing Components

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Component } from '../Component';

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByText('Expected')).toBeInTheDocument();
  });

  it('should handle interactions', () => {
    render(<Component />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText('Result')).toBeInTheDocument();
  });
});
```

---

**Last Updated**: November 22, 2024
**Total Components**: 30+
**Test Coverage**: 79 unit tests, 19 E2E tests

*Complete, accessible, and well-documented React component library for MADLAB*
