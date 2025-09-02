# Components Documentation

This section provides comprehensive documentation for all React components in the MADLAB application, including APIs, usage examples, and styling guidelines.

## 📑 Contents

1. **[Component Library](./component-library.md)** - Overview of all components
2. **[React Components API](./react-components.md)** - Detailed component APIs
3. **[Custom Hooks](./hooks.md)** - Reusable hook documentation
4. **[Styling Guidelines](./styling.md)** - Design system and styling patterns

## 🧩 Component Categories

### Core Components
- **App**: Root application container
- **Header**: Navigation with theme/language controls
- **LoadingOverlay**: Full-screen loading indicator
- **LoadingSpinner**: Inline loading animation
- **Tooltip**: Contextual information popover
- **ProgressBar**: Visual progress indicator

### Task Management Components
- **TaskCard**: Compact task display for grid view
- **EnhancedTaskCard**: Detailed task card with status
- **TaskStatusControl**: Task status management UI
- **PhaseSection**: Phase container with task list
- **GroupedTaskView**: Dynamic task grouping display

### Control Components
- **UnifiedToolbar**: Main control toolbar with search, filters, grouping
- **FilterBar**: Legacy filter controls
- **FilterChips**: Active filter indicators
- **GroupingSelector**: Task grouping options
- **UserSwitcher**: Team member selector

### Data Display Components  
- **StatsGrid**: Project statistics cards
- **TeamSummary**: Team member overview
- **ExportModal**: Export options dialog
- **EnhancedExportModal**: Advanced export features

### Gantt Chart Components
- **GanttChart**: Main Gantt container
- **GanttHeader**: Gantt control header
- **GanttTimeline**: Timeline visualization
- **GanttTaskBar**: Individual task bars
- **GanttTaskList**: Task list sidebar

## 🎨 Design System

### Component Styling
- **Tailwind CSS**: Utility-first styling approach
- **Dark Mode**: Complete dark theme support
- **Responsive**: Mobile-first responsive design
- **Animations**: Smooth transitions and effects

### Accessibility Features
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG AA compliant colors
- **Touch Targets**: 44px minimum touch targets

## 🔧 Component Patterns

### Props Interface Pattern
```typescript
interface ComponentProps {
  // Required props
  data: RequiredType;
  
  // Optional props with defaults
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  
  // Event handlers
  onClick?: (event: MouseEvent) => void;
  
  // Render props
  children?: React.ReactNode;
}
```

### State Management Pattern
```typescript
// Local state for UI-specific state
const [isOpen, setIsOpen] = useState(false);

// Global state from Zustand store
const { theme, language } = useAppStore();
```

### Styling Pattern
```typescript
// Conditional styling with theme support
const baseClasses = 'base-styles';
const themeClasses = theme === 'dark' ? 'dark-styles' : 'light-styles';
const sizeClasses = size === 'lg' ? 'large-styles' : 'default-styles';

const className = `${baseClasses} ${themeClasses} ${sizeClasses}`;
```

## 📖 Usage Examples

### Basic Component Usage
```tsx
import { TaskCard } from './components/TaskCard';

function MyComponent() {
  return (
    <TaskCard
      task={taskData}
      onTaskClick={handleTaskClick}
      showDetails={true}
    />
  );
}
```

### Advanced Composition
```tsx
import { PhaseSection, TaskCard } from './components';

function ProjectView() {
  return (
    <PhaseSection phase={1}>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </PhaseSection>
  );
}
```

## 🚀 Performance Considerations

### Optimization Strategies
- **React.memo**: Prevent unnecessary re-renders
- **useCallback**: Memoize event handlers
- **useMemo**: Cache expensive calculations
- **Lazy Loading**: Load components on demand

### Bundle Size Impact
- **Tree Shaking**: Only import used components
- **Code Splitting**: Separate bundles for large components
- **Dynamic Imports**: Load components when needed

## 🧪 Testing Guidelines

### Component Testing
- **Unit Tests**: Test component behavior in isolation
- **Integration Tests**: Test component interactions
- **Accessibility Tests**: Verify ARIA and keyboard navigation
- **Visual Regression Tests**: Catch styling changes

### Testing Utilities
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from './TaskCard';

test('renders task information', () => {
  render(<TaskCard task={mockTask} />);
  expect(screen.getByText(mockTask.name)).toBeInTheDocument();
});
```

## 🎯 Development Guidelines

### Creating New Components
1. Follow the established patterns and conventions
2. Include TypeScript interfaces for all props
3. Add accessibility features from the start
4. Include dark mode support
5. Write comprehensive tests

### Code Review Checklist
- [ ] Props interface defined and documented
- [ ] Accessibility features implemented
- [ ] Dark mode styles included
- [ ] Performance optimizations applied
- [ ] Tests written and passing
- [ ] Documentation updated