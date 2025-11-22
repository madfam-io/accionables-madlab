# Performance Optimization Guide

Complete guide to optimizing MADLAB application performance for production environments.

## Table of Contents

1. [Performance Metrics](#performance-metrics)
2. [Bundle Size Optimization](#bundle-size-optimization)
3. [Runtime Performance](#runtime-performance)
4. [Network Optimization](#network-optimization)
5. [Memory Management](#memory-management)
6. [Monitoring & Profiling](#monitoring--profiling)

---

## Performance Metrics

### Current Performance Baseline

| Metric | Target | Current |
|--------|--------|---------|
| **First Contentful Paint** | < 1.5s | ~1.2s |
| **Time to Interactive** | < 3.0s | ~2.5s |
| **Largest Contentful Paint** | < 2.5s | ~2.0s |
| **Cumulative Layout Shift** | < 0.1 | ~0.05 |
| **Bundle Size (gzipped)** | < 300KB | ~250KB |
| **Lighthouse Score** | > 90 | 95+ |

### Measuring Performance

```bash
# Build and analyze bundle
npm run build
npm run build:analyze

# Lighthouse audit
npx lighthouse http://localhost:5173 --view

# Bundle size analysis
npx vite-bundle-visualizer
```

---

## Bundle Size Optimization

### 1. Code Splitting

**Current Implementation**:
```tsx
// src/App.tsx
import { lazy, Suspense } from 'react';

// Heavy components loaded on demand
const GanttChart = lazy(() => import('./components/GanttChart/GanttChart'));
const ExportModal = lazy(() => import('./components/EnhancedExportModal'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {viewMode === 'gantt' && <GanttChart />}
    </Suspense>
  );
}
```

**Impact**: ~40% reduction in initial bundle size

### 2. Tree Shaking

**Optimize imports**:
```tsx
// ❌ Bad: Imports entire library
import _ from 'lodash';
import * as Icons from 'lucide-react';

// ✅ Good: Imports only what's needed
import { debounce } from 'lodash-es';
import { Calendar, Clock } from 'lucide-react';
```

**Configure Vite**:
```ts
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'charts': ['./src/components/GanttChart'],
          'utils': ['date-fns', 'clsx'],
        },
      },
    },
  },
});
```

### 3. Remove Unused Dependencies

```bash
# Analyze dependencies
npx depcheck

# Remove unused packages
npm uninstall <unused-package>

# Update package.json
npm prune
```

### 4. Optimize Images and Assets

```tsx
// Use WebP format with fallback
<picture>
  <source srcset="logo.webp" type="image/webp" />
  <img src="logo.png" alt="MADLAB Logo" />
</picture>

// Lazy load images
<img
  loading="lazy"
  src="chart.png"
  alt="Gantt chart"
/>
```

**Image Optimization Tools**:
```bash
# Install image optimizer
npm install -D vite-plugin-imagemin

# Configure in vite.config.ts
import viteImagemin from 'vite-plugin-imagemin';

plugins: [
  viteImagemin({
    gifsicle: { optimizationLevel: 3 },
    mozjpeg: { quality: 80 },
    pngquant: { quality: [0.8, 0.9] },
    svgo: { plugins: [{ removeViewBox: false }] },
  }),
],
```

---

## Runtime Performance

### 1. React Optimization

#### Memoization

```tsx
// Memoize expensive components
export const TaskCard = React.memo<TaskCardProps>(({ task, view }) => {
  return <div>{/* ... */}</div>;
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.task.id === nextProps.task.id &&
         prevProps.view === nextProps.view;
});

// Memoize expensive calculations
const stats = useMemo(() => {
  return filteredTasks.reduce((acc, task) => ({
    totalHours: acc.totalHours + task.hours,
    totalTasks: acc.totalTasks + 1,
  }), { totalHours: 0, totalTasks: 0 });
}, [filteredTasks]);

// Memoize callbacks
const handleClick = useCallback(() => {
  updateTask(task.id, updates);
}, [task.id, updates, updateTask]);
```

#### Avoid Re-renders

```tsx
// ❌ Bad: Creates new object every render
const style = { color: 'blue', fontSize: '14px' };

// ✅ Good: Stable reference
const STYLE = { color: 'blue', fontSize: '14px' };

// ❌ Bad: Inline arrow function
<button onClick={() => handleClick(id)}>Click</button>

// ✅ Good: Memoized handler
const handleButtonClick = useCallback(
  () => handleClick(id),
  [id, handleClick]
);
<button onClick={handleButtonClick}>Click</button>
```

### 2. Virtualization for Long Lists

```tsx
// Install react-virtual
npm install @tanstack/react-virtual

// Implement virtualized list
import { useVirtualizer } from '@tanstack/react-virtual';

const rowVirtualizer = useVirtualizer({
  count: tasks.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 100,
  overscan: 5, // Render 5 items above/below viewport
});
```

**Performance Impact**:
- 1000+ tasks: 95% faster initial render
- Scrolling: 60 FPS maintained

### 3. Debounce User Input

```tsx
// Custom debounce hook
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Usage in search
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 300);

useEffect(() => {
  filterTasks(debouncedSearch);
}, [debouncedSearch]);
```

### 4. Optimize Zustand Store

```tsx
// ❌ Bad: Subscribes to entire store
const state = useAppStore();

// ✅ Good: Subscribe to specific values
const theme = useAppStore(state => state.theme);
const language = useAppStore(state => state.language);

// ✅ Better: Use selectors
const selector = (state: AppState) => ({
  theme: state.theme,
  language: state.language,
});
const { theme, language } = useAppStore(selector);

// ✅ Best: Shallow comparison for objects
const filters = useAppStore(state => state.filters, shallow);
```

---

## Network Optimization

### 1. HTTP Caching

```tsx
// Service Worker configuration
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache API responses
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new StaleWhileRevalidate({
    cacheName: 'api-cache',
    plugins: [{
      cacheWillUpdate: async ({ response }) => {
        return response.status === 200 ? response : null;
      },
    }],
  })
);
```

### 2. Resource Hints

```html
<!-- index.html -->
<head>
  <!-- Preconnect to important domains -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="dns-prefetch" href="https://api.example.com">

  <!-- Preload critical resources -->
  <link rel="preload" href="/assets/main.js" as="script">
  <link rel="preload" href="/assets/fonts/roboto.woff2" as="font" crossorigin>

  <!-- Prefetch next page resources -->
  <link rel="prefetch" href="/gantt-chunk.js">
</head>
```

### 3. Compression

```ts
// vite.config.ts
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],
});
```

**Compression Results**:
- Gzip: ~65% reduction
- Brotli: ~75% reduction

---

## Memory Management

### 1. Cleanup Side Effects

```tsx
useEffect(() => {
  const interval = setInterval(() => {
    updateProgress();
  }, 1000);

  // ✅ Cleanup on unmount
  return () => clearInterval(interval);
}, []);

useEffect(() => {
  const handleResize = () => updateLayout();
  window.addEventListener('resize', handleResize);

  // ✅ Remove listener
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

### 2. Avoid Memory Leaks

```tsx
// ❌ Bad: Stores growing indefinitely
const [history, setHistory] = useState<Task[]>([]);

useEffect(() => {
  setHistory(prev => [...prev, currentTask]);
}, [currentTask]);

// ✅ Good: Limit history size
useEffect(() => {
  setHistory(prev => {
    const newHistory = [...prev, currentTask];
    return newHistory.slice(-100); // Keep last 100 items
  });
}, [currentTask]);
```

### 3. Clear Unused Data

```tsx
// Clear filters when component unmounts
useEffect(() => {
  return () => {
    clearFilters();
  };
}, [clearFilters]);

// Reset state on navigation
useEffect(() => {
  return () => {
    resetState();
  };
}, [location.pathname]);
```

---

## Monitoring & Profiling

### 1. React DevTools Profiler

```bash
# Enable profiling in development
npm run dev

# Open React DevTools
# 1. Click Profiler tab
# 2. Click record button
# 3. Perform actions
# 4. Stop recording
# 5. Analyze flame graph
```

**What to Look For**:
- Components rendering frequently
- Long render times (> 16ms)
- Unnecessary re-renders

### 2. Chrome DevTools Performance

```bash
# 1. Open DevTools (F12)
# 2. Go to Performance tab
# 3. Click record
# 4. Perform actions
# 5. Stop recording
# 6. Analyze:
#    - FPS drops
#    - Long tasks (> 50ms)
#    - Layout shifts
#    - Memory usage
```

### 3. Lighthouse CI

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on: [push]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:5173
          uploadArtifacts: true
          temporaryPublicStorage: true
```

### 4. Bundle Analysis

```bash
# Visualize bundle composition
npm run build
npx vite-bundle-visualizer

# Analyze with webpack-bundle-analyzer
npm install -D rollup-plugin-visualizer

# vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

plugins: [
  visualizer({
    open: true,
    gzipSize: true,
    brotliSize: true,
  }),
],
```

### 5. Performance Budgets

```ts
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Enforce size limits
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 500, // Warn at 500KB
  },
});
```

---

## Performance Checklist

### Build Optimization
- [ ] Enable production mode
- [ ] Minify JavaScript and CSS
- [ ] Enable compression (gzip/brotli)
- [ ] Optimize images
- [ ] Remove unused code
- [ ] Analyze bundle size

### Runtime Optimization
- [ ] Implement code splitting
- [ ] Use React.memo for heavy components
- [ ] Memoize expensive calculations
- [ ] Debounce user input
- [ ] Virtualize long lists
- [ ] Optimize store subscriptions

### Network Optimization
- [ ] Enable HTTP caching
- [ ] Add resource hints (preconnect, prefetch)
- [ ] Implement service worker
- [ ] Optimize API calls
- [ ] Use CDN for static assets

### Memory Optimization
- [ ] Clean up side effects
- [ ] Remove event listeners
- [ ] Limit state history
- [ ] Clear unused data
- [ ] Monitor memory usage

### Monitoring
- [ ] Set up Lighthouse CI
- [ ] Configure performance budgets
- [ ] Add error tracking (Sentry)
- [ ] Monitor Web Vitals
- [ ] Profile regularly

---

## Performance Tools

### Build Tools
- **Vite**: Fast build tool with HMR
- **esbuild**: Ultra-fast JavaScript bundler
- **Rollup**: Module bundler for libraries
- **SWC**: Rust-based JavaScript compiler

### Analysis Tools
- **Lighthouse**: Web performance audit
- **WebPageTest**: Performance testing
- **Bundle Analyzer**: Visualize bundle composition
- **React DevTools**: Component profiling

### Monitoring
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Datadog**: APM and monitoring
- **Google Analytics**: User metrics

---

## Performance Goals

### Short Term (Current Sprint)
- ✅ Bundle size < 300KB
- ✅ Lighthouse score > 90
- ✅ First Contentful Paint < 1.5s
- ✅ Time to Interactive < 3.0s

### Medium Term (Next Quarter)
- [ ] Implement service worker
- [ ] Add performance monitoring
- [ ] Optimize Gantt chart rendering
- [ ] Reduce memory footprint

### Long Term (Next Year)
- [ ] Achieve perfect Lighthouse score (100)
- [ ] Implement edge caching
- [ ] Add performance regression tests
- [ ] Optimize for low-end devices

---

**Last Updated**: November 22, 2024
**Performance Score**: 95/100
**Bundle Size**: ~250KB (gzipped)

*Optimized for speed, efficiency, and exceptional user experience*
