# API Documentation

Comprehensive API reference for all utilities, stores, and services in the MADLAB application.

## 📑 Contents

1. **[Store APIs](./stores.md)** - Zustand store interfaces and actions
2. **[Utility Functions](./utils.md)** - Helper functions and utilities
3. **[Export System](./export-system.md)** - Data export functionality
4. **[Translation System](./translations.md)** - Internationalization system

## 🏪 Store APIs

### AppStore
The main application state store using Zustand with persistence.

```typescript
interface AppState {
  // Theme management
  theme: 'auto' | 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  
  // Language management
  language: 'es' | 'en';
  setLanguage: (language: Language) => void;
  
  // View management
  viewMode: 'grid' | 'list';
  setViewMode: (mode: ViewMode) => void;
  
  // Filtering
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  
  // Computed values
  filteredTasks: Task[];
}
```

## 🔧 Utility Functions

### Export Utilities
```typescript
// Export tasks in various formats
exportTasks(tasks: Task[], options: ExportOptions): void;

// Individual export functions
downloadCSV(tasks: Task[], options: ExportOptions): void;
downloadJSON(tasks: Task[], options: ExportOptions): void;
downloadPDF(tasks: Task[], options: ExportOptions): void;
downloadTXT(tasks: Task[], options: ExportOptions): void;
```

### Performance Utilities
```typescript
// Performance monitoring
performanceMonitor.mark(name: string): void;
performanceMonitor.measure(name: string, start: string, end: string): void;

// Optimization utilities
debounce(func: Function, wait: number): Function;
throttle(func: Function, limit: number): Function;
```

## 🌍 Translation System

### Translation Interface
```typescript
interface Translations {
  [key: string]: {
    es: string;
    en: string;
  };
}

// Usage
const t = translations[language];
const localizedText = t.taskName;
```

## 📊 Data Types

### Core Interfaces
```typescript
interface Task {
  id: string;
  name: string;
  nameEn: string;
  assignee: string;
  hours: number;
  difficulty: number;
  phase: number;
  section: string;
  sectionEn: string;
  dependencies: string[];
}

interface TeamMember {
  name: string;
  tasks: number;
  hours: number;
}

interface ProjectPhase {
  es: string;
  en: string;
}
```

## 🔄 Data Flow

### Store Actions
```typescript
// Theme actions
store.setTheme('dark');          // Set theme
store.getTheme();                // Get current theme

// Language actions
store.setLanguage('en');         // Set language
store.getLanguage();             // Get current language

// Filter actions
store.setFilters({               // Update filters
  search: 'task name',
  assignee: 'John Doe',
  difficulty: [1, 2, 3]
});
store.resetFilters();            // Clear all filters
```

### Export Actions
```typescript
// Export with options
exportTasks(filteredTasks, {
  format: 'pdf',
  scope: 'filtered',
  language: 'es',
  includeFields: {
    id: true,
    name: true,
    assignee: true,
    hours: true,
    difficulty: true,
    dependencies: false,
    phase: true,
    section: true
  }
});
```

## 🎯 Error Handling

### Store Error Patterns
```typescript
// Safe store updates with error handling
try {
  store.setFilters(newFilters);
} catch (error) {
  console.error('Failed to update filters:', error);
  // Fallback behavior
}
```

### Export Error Handling
```typescript
// Export with error handling
try {
  await exportTasks(tasks, options);
} catch (error) {
  console.error('Export failed:', error);
  // Show user-friendly error message
}
```

## 🚀 Performance Considerations

### Store Performance
- **Selective Updates**: Only update changed state slices
- **Computed Values**: Use getters for derived state
- **Persistence**: Selective persistence of user preferences

### Utility Performance
- **Debouncing**: Use for search and filter inputs
- **Throttling**: Use for scroll and resize events
- **Memoization**: Cache expensive calculations

## 📖 Usage Examples

### Basic Store Usage
```typescript
import { useAppStore } from '../stores/appStore';

function MyComponent() {
  const { theme, language, setTheme } = useAppStore();
  
  return (
    <button onClick={() => setTheme('dark')}>
      Current theme: {theme}
    </button>
  );
}
```

### Export System Usage
```typescript
import { exportTasks } from '../utils/exportUtils';
import { useAppStore } from '../stores/appStore';

function ExportButton() {
  const { filteredTasks } = useAppStore();
  
  const handleExport = () => {
    exportTasks(filteredTasks, {
      format: 'csv',
      scope: 'filtered',
      language: 'es',
      includeFields: defaultFields
    });
  };
  
  return <button onClick={handleExport}>Export CSV</button>;
}
```

## 🔍 Type Safety

All APIs are fully typed with TypeScript, providing:
- **Compile-time Error Detection**
- **IntelliSense Support**
- **Refactoring Safety**
- **Documentation in Code**

### Type Definitions
```typescript
// Strict typing for all interfaces
interface ExportOptions {
  format: 'pdf' | 'csv' | 'json' | 'txt';  // Union types
  scope: 'all' | 'filtered';
  language: Language;                       // Reusable types
  includeFields: {                          // Nested objects
    [K in keyof TaskFields]: boolean;       // Mapped types
  };
}
```