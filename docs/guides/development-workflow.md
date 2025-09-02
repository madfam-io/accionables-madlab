# Development Workflow Guide

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Git** 2.x or higher
- **VS Code** (recommended) or preferred IDE

### Initial Setup
```bash
# Clone the repository
git clone https://github.com/your-org/madlab.git
cd madlab

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

## 📁 Project Structure

```
madlab/
├── src/                    # Source code
│   ├── components/        # React components
│   ├── data/             # Static data and types
│   ├── hooks/            # Custom React hooks
│   ├── stores/           # Zustand state stores
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Root component
│   └── main.tsx          # Entry point
├── public/                # Static assets
│   ├── icons/            # PWA icons
│   └── manifest.json     # PWA manifest
├── docs/                  # Documentation
├── dist/                  # Build output
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite configuration
└── tailwind.config.js    # Tailwind configuration
```

## 🛠️ Available Scripts

### Development
```bash
# Start dev server with hot reload
npm run dev

# Start on specific port
npm run dev -- --port 3000

# Start with host exposure
npm run dev -- --host
```

### Building
```bash
# Type check
npm run type-check

# Production build
npm run build

# Preview production build
npm run preview
```

### Code Quality
```bash
# Run type checking
npm run type-check

# Format code (if configured)
npm run format

# Lint code (if configured)
npm run lint
```

## 💻 Development Guidelines

### 1. Component Development

#### Creating a New Component
```typescript
// src/components/MyComponent.tsx
import React from 'react';
import { useAppStore } from '../stores/appStore';
import { translations } from '../data/translations';

interface MyComponentProps {
  title: string;
  className?: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ 
  title,
  className = '' 
}) => {
  const { language, theme } = useAppStore();
  const t = translations[language];
  
  return (
    <div className={`component-base ${className}`}>
      <h2>{title}</h2>
      {/* Component content */}
    </div>
  );
};
```

#### Component Checklist
- [ ] TypeScript interface for props
- [ ] Translation support
- [ ] Dark mode styles
- [ ] Responsive design
- [ ] Accessibility features
- [ ] Performance optimization
- [ ] Documentation

### 2. State Management

#### Adding New State
```typescript
// src/stores/appStore.ts
interface AppState {
  // Add new state property
  newFeature: string;
  
  // Add action
  setNewFeature: (value: string) => void;
}

// In create function
setNewFeature: (value) => set({ newFeature: value })
```

#### Using State in Components
```typescript
const { newFeature, setNewFeature } = useAppStore();
// Or selective subscription
const newFeature = useAppStore(state => state.newFeature);
```

### 3. Adding New Features

#### Feature Development Flow
1. **Plan**: Define requirements and design
2. **Branch**: Create feature branch
3. **Implement**: Code the feature
4. **Test**: Verify functionality
5. **Document**: Update documentation
6. **Review**: Code review
7. **Merge**: Integrate to main

#### Feature Structure
```
src/
├── components/
│   └── FeatureName/
│       ├── index.ts
│       ├── FeatureName.tsx
│       ├── FeatureSubComponent.tsx
│       └── types.ts
├── hooks/
│   └── useFeatureName.ts
└── utils/
    └── featureHelpers.ts
```

### 4. Data Management

#### Adding New Tasks
```typescript
// src/data/tasks/phaseX.ts
export const phaseXTasks: Task[] = [
  {
    id: 'unique-id',
    name: 'Spanish name',
    nameEn: 'English name',
    assignee: 'Team Member',
    hours: 4,
    difficulty: 3,
    dependencies: [],
    phase: X,
    section: 'Section Name',
    sectionEn: 'Section Name En'
  }
];
```

#### Updating Translations
```typescript
// src/data/translations.ts
export const translations = {
  es: {
    newKey: 'Texto en español',
    // ...
  },
  en: {
    newKey: 'English text',
    // ...
  }
};
```

## 🎨 Styling Guidelines

### Tailwind CSS Usage
```tsx
// Base classes first, then modifiers
<div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">

// Responsive design (mobile-first)
<div className="text-sm md:text-base lg:text-lg">

// State-based styling
<button className="hover:bg-blue-600 focus:ring-2 active:scale-95">
```

### Custom CSS
```css
/* src/App.css */
@layer components {
  .custom-class {
    @apply base-tailwind-classes;
    /* Custom properties */
  }
}
```

### Theme Variables
```css
:root {
  --primary-color: theme('colors.blue.600');
  --background: theme('colors.white');
}

[data-theme="dark"] {
  --primary-color: theme('colors.blue.400');
  --background: theme('colors.gray.900');
}
```

## 🧪 Testing Strategy

### Unit Testing
```typescript
// Component testing
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

test('renders component', () => {
  render(<MyComponent title="Test" />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

### Integration Testing
```typescript
// Store testing
import { renderHook, act } from '@testing-library/react';
import { useAppStore } from '../stores/appStore';

test('updates state correctly', () => {
  const { result } = renderHook(() => useAppStore());
  act(() => {
    result.current.setTheme('dark');
  });
  expect(result.current.theme).toBe('dark');
});
```

## 🐛 Debugging

### Development Tools

#### React DevTools
- Install browser extension
- Inspect component tree
- Monitor state changes
- Profile performance

#### VS Code Extensions
- **ES7+ React snippets**
- **Tailwind CSS IntelliSense**
- **TypeScript Hero**
- **Prettier**
- **ESLint**

### Common Issues

#### Build Errors
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

#### Type Errors
```bash
# Check TypeScript errors
npm run type-check

# Generate type declarations
npx tsc --declaration --emitDeclarationOnly
```

#### Performance Issues
```typescript
// Use React DevTools Profiler
// Check for:
// - Unnecessary re-renders
// - Large component trees
// - Expensive computations
// - Missing memoization
```

## 📦 Dependency Management

### Adding Dependencies
```bash
# Production dependency
npm install package-name

# Development dependency
npm install -D package-name

# Specific version
npm install package-name@version
```

### Updating Dependencies
```bash
# Check outdated
npm outdated

# Update specific package
npm update package-name

# Update all
npm update
```

### Security Audits
```bash
# Run security audit
npm audit

# Auto-fix vulnerabilities
npm audit fix

# Force fixes (use cautiously)
npm audit fix --force
```

## 🚀 Performance Optimization

### Code Splitting
```typescript
// Lazy load components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Use with Suspense
<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

### Memoization
```typescript
// Memoize expensive computations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Memoize components
const MemoizedComponent = memo(Component);
```

### Bundle Optimization
```typescript
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash', 'date-fns']
        }
      }
    }
  }
};
```

## 📝 Documentation

### Code Documentation
```typescript
/**
 * Component description
 * @param props - Component props
 * @returns JSX element
 */
export const Component: React.FC<Props> = (props) => {
  // Implementation
};
```

### README Updates
- Keep README current with changes
- Document new features
- Update API references
- Add usage examples

## 🔄 Git Workflow

### Branch Strategy
```bash
# Feature branch
git checkout -b feature/feature-name

# Bug fix branch
git checkout -b fix/bug-description

# Hotfix branch
git checkout -b hotfix/critical-fix
```

### Commit Messages
```bash
# Format: type(scope): description

feat(tasks): add bulk task import
fix(gantt): correct date calculation
docs(api): update state management docs
style(ui): improve dark mode colors
refactor(store): optimize filter logic
test(components): add TaskCard tests
chore(deps): update dependencies
```

### Pull Request Process
1. Create feature branch
2. Make changes
3. Run tests
4. Update documentation
5. Create pull request
6. Address review feedback
7. Merge when approved

## 🚢 Deployment Preparation

### Pre-deployment Checklist
- [ ] All tests passing
- [ ] Type checking passes
- [ ] Build succeeds
- [ ] No console errors
- [ ] Performance metrics met
- [ ] Documentation updated
- [ ] Version bumped
- [ ] CHANGELOG updated

### Build Optimization
```bash
# Production build with analysis
npm run build -- --analyze

# Check bundle size
npx vite-bundle-visualizer
```

---

*For deployment instructions, see [Deployment Guide](./deployment.md)*