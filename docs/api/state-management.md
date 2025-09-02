# State Management Documentation

## Overview

MADLAB uses **Zustand** for state management, providing a lightweight, TypeScript-first solution with built-in persistence.

## 🏗️ Store Architecture

### Main Application Store (`appStore.ts`)

```typescript
interface AppState {
  // Theme & UI
  theme: 'light' | 'dark' | 'auto';
  language: 'es' | 'en';
  viewMode: 'list' | 'grid' | 'gantt';
  isLoading: boolean;
  loadingMessage: string;
  
  // Task Data
  tasks: Task[];
  filteredTasks: Task[];
  groupedTasks: Map<string, Task[]>;
  
  // Filters
  filters: Filters;
  groupingOption: GroupingOption;
  
  // User State
  currentUser: string | null;
  
  // Gantt Configuration
  ganttConfig: GanttConfig;
  ganttTasks: GanttTask[];
  
  // Actions
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setViewMode: (mode: ViewMode) => void;
  setFilter: (key: keyof Filters, value: any) => void;
  clearFilters: () => void;
  setGroupingOption: (option: GroupingOption) => void;
  setCurrentUser: (user: string | null) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  setLoading: (isLoading: boolean, message?: string) => void;
  updateGanttConfig: (config: Partial<GanttConfig>) => void;
  calculateGanttTasks: () => void;
  applyFilters: () => void;
}
```

## 📊 Data Types

### Task Interface
```typescript
interface Task {
  id: string;
  name: string;
  nameEn: string;
  assignee: string;
  hours: number;
  section: string;
  sectionEn: string;
  phase: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  dependencies: string[];
  manualStatus?: TaskStatus;
  statusHistory?: TaskStatusUpdate[];
  weekNumber?: number;
  startDate?: Date;
  endDate?: Date;
}
```

### Filter Interface
```typescript
interface Filters {
  search: string;
  assignee: string;
  difficulty: number | null;
  phase: number | null;
  duration: 'all' | 'short' | 'medium' | 'long';
}
```

### Gantt Configuration
```typescript
interface GanttConfig {
  startDate: Date;
  endDate: Date;
  viewScale: 'day' | 'week' | 'month';
  showDependencies: boolean;
  showCriticalPath: boolean;
  autoScheduling: boolean;
  snapToGrid: boolean;
  showWeekends: boolean;
}
```

## 🔄 State Flow

### 1. Initial State Loading
```typescript
// Load persisted state from localStorage
const persistedState = localStorage.getItem('app-storage');
const initialState = persistedState ? JSON.parse(persistedState) : defaultState;
```

### 2. State Updates
```typescript
// Example: Updating filters
setFilter: (key, value) => set((state) => {
  const newFilters = { ...state.filters, [key]: value };
  const filteredTasks = filterTasks(state.tasks, newFilters);
  const groupedTasks = groupTasks(filteredTasks, state.groupingOption);
  return { filters: newFilters, filteredTasks, groupedTasks };
})
```

### 3. Computed Values
```typescript
// Tasks are filtered and grouped based on current state
const filteredTasks = filterTasks(tasks, filters);
const groupedTasks = groupTasks(filteredTasks, groupingOption);
```

### 4. Persistence
```typescript
// Automatic persistence on state changes
persist: {
  name: 'app-storage',
  partialize: (state) => ({
    theme: state.theme,
    language: state.language,
    viewMode: state.viewMode,
    currentUser: state.currentUser,
    filters: state.filters,
    groupingOption: state.groupingOption,
    ganttConfig: state.ganttConfig
  })
}
```

## 🎯 Usage Patterns

### Accessing State in Components
```typescript
import { useAppStore } from '../stores/appStore';

function MyComponent() {
  // Select specific state slices
  const theme = useAppStore(state => state.theme);
  const language = useAppStore(state => state.language);
  
  // Or destructure multiple values
  const { tasks, filters, setFilter } = useAppStore();
  
  return (
    // Component JSX
  );
}
```

### Updating State
```typescript
function FilterControls() {
  const { setFilter, clearFilters } = useAppStore();
  
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter('search', e.target.value);
  };
  
  const handleReset = () => {
    clearFilters();
  };
  
  return (
    // Filter UI
  );
}
```

### Subscribing to State Changes
```typescript
useEffect(() => {
  const unsubscribe = useAppStore.subscribe(
    (state) => state.theme,
    (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
    }
  );
  
  return unsubscribe;
}, []);
```

## 🔧 Advanced Patterns

### Selectors with Memoization
```typescript
const selectFilteredTaskCount = (state: AppState) => 
  state.filteredTasks.length;

const selectTasksByAssignee = (assignee: string) => (state: AppState) =>
  state.tasks.filter(task => task.assignee === assignee);
```

### Middleware for Logging
```typescript
const logMiddleware = (config) => (set, get, api) =>
  config(
    (...args) => {
      console.log('Previous state:', get());
      set(...args);
      console.log('New state:', get());
    },
    get,
    api
  );
```

### Async Actions
```typescript
const fetchTasks = async () => {
  const { setLoading, setTasks } = useAppStore.getState();
  
  setLoading(true, 'Loading tasks...');
  try {
    const response = await api.getTasks();
    setTasks(response.data);
  } finally {
    setLoading(false);
  }
};
```

## 🛠️ Performance Optimization

### 1. Selective Subscriptions
```typescript
// Only re-render when specific state changes
const theme = useAppStore(state => state.theme);
// Instead of
const { theme } = useAppStore(); // Subscribes to all changes
```

### 2. Shallow Comparison
```typescript
const filters = useAppStore(
  state => state.filters,
  shallow // Only re-render if filters object changes
);
```

### 3. Computed Values Caching
```typescript
const expensiveComputation = useMemo(() => {
  return performExpensiveOperation(tasks);
}, [tasks]);
```

## 🧪 Testing State

### Testing Store Actions
```typescript
import { renderHook, act } from '@testing-library/react';
import { useAppStore } from '../stores/appStore';

test('updates theme', () => {
  const { result } = renderHook(() => useAppStore());
  
  act(() => {
    result.current.setTheme('dark');
  });
  
  expect(result.current.theme).toBe('dark');
});
```

### Mocking Store in Tests
```typescript
jest.mock('../stores/appStore', () => ({
  useAppStore: jest.fn(() => ({
    theme: 'light',
    language: 'en',
    setTheme: jest.fn()
  }))
}));
```

## 📈 State Debugging

### DevTools Integration
```typescript
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    (set) => ({
      // Store implementation
    }),
    { name: 'AppStore' }
  )
);
```

### State Inspection
```typescript
// Get current state
const currentState = useAppStore.getState();

// Subscribe to all changes
useAppStore.subscribe(console.log);

// Reset state
useAppStore.setState(initialState);
```

## 🔐 Security Considerations

### 1. Sensitive Data
- Never store passwords or tokens in Zustand
- Use secure storage for authentication data
- Clear sensitive data on logout

### 2. Input Validation
- Validate all data before storing
- Sanitize user inputs
- Type-check at runtime for external data

### 3. State Integrity
- Implement state versioning for migrations
- Validate persisted state on load
- Handle corrupted state gracefully

## 📚 Best Practices

1. **Keep Store Flat**: Avoid deeply nested state
2. **Normalize Data**: Use Maps and lookups for performance
3. **Separate Concerns**: Split large stores into smaller ones
4. **Immutable Updates**: Always return new objects
5. **Type Everything**: Full TypeScript coverage
6. **Document Actions**: Clear names and comments
7. **Test Critical Paths**: Cover state mutations with tests

---

*For more details on implementation, see [appStore.ts](../../src/stores/appStore.ts)*