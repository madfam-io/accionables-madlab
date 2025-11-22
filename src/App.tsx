import { useEffect } from 'react';
import { Header } from './components/Header';
import { UnifiedToolbarV2 } from './components/UnifiedToolbarV2';
import { StatsGrid } from './components/StatsGrid';
import { PhaseSection } from './components/PhaseSection';
import { TeamSummary } from './components/TeamSummary';
import { GanttChart } from './components/GanttChart/GanttChart';
import { LoadingOverlay } from './components/LoadingOverlay';
import { GroupedTaskView } from './components/GroupedTaskView';
import { ScreenReaderAnnouncer } from './components/ScreenReaderAnnouncer';
import { KeyboardShortcutsHelp } from './components/KeyboardShortcutsHelp';
import { useAppStore } from './stores/appStore';
import './App.css';

function App() {
  const {
    theme,
    viewMode,
    groupingOption,
    accessibilityPreferences,
    setViewMode,
    setAccessibilityPreference,
  } = useAppStore();

  useEffect(() => {
    // Apply theme on mount and when it changes
    const root = document.documentElement;
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      root.classList.toggle('dark', prefersDark);
    } else {
      root.setAttribute('data-theme', theme);
      root.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  // Apply accessibility preferences
  useEffect(() => {
    const root = document.documentElement;

    // Reduced motion
    if (accessibilityPreferences.reduceMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.style.setProperty('--transition-duration', '0.01ms');
      root.classList.add('reduce-motion');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
      root.classList.remove('reduce-motion');
    }

    // High contrast
    if (accessibilityPreferences.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Font size
    root.classList.remove('font-large', 'font-x-large');
    if (accessibilityPreferences.fontSize === 'large') {
      root.classList.add('font-large');
    } else if (accessibilityPreferences.fontSize === 'x-large') {
      root.classList.add('font-x-large');
    }
  }, [accessibilityPreferences]);

  // Listen for system reduced motion preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setAccessibilityPreference('reduceMotion', e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setAccessibilityPreference]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      // Alt+1: Skip to main content
      if (e.altKey && e.key === '1') {
        e.preventDefault();
        document.getElementById('main-content')?.focus();
      }

      // Alt+2: Skip to toolbar
      if (e.altKey && e.key === '2') {
        e.preventDefault();
        document.getElementById('toolbar')?.focus();
      }

      // G: Switch to Gantt view
      if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        setViewMode('gantt');
      }

      // L: Switch to List view
      if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        setViewMode('list');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setViewMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Skip Navigation Links for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <a href="#toolbar" className="skip-link">
        Skip to toolbar
      </a>

      <Header />
      
      {viewMode === 'gantt' ? (
        /* Gantt View - Full Height */
        <main id="main-content" className="h-[calc(100vh-theme(spacing.20))] flex flex-col">
          <div id="toolbar" className="px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <UnifiedToolbarV2 />
          </div>
          <div className="flex-1">
            <GanttChart />
          </div>
        </main>
      ) : (
        /* List/Grid View - Container Layout */
        <main id="main-content" className="container mx-auto px-4 py-6">
          <div id="toolbar" className="mb-6">
            <UnifiedToolbarV2 />
          </div>
          
          {/* Stats Grid */}
          <StatsGrid />
          
          {/* Task Display - Either grouped or by phase */}
          {groupingOption === 'phase' ? (
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map(phase => (
                <PhaseSection key={phase} phase={phase} />
              ))}
            </div>
          ) : (
            <GroupedTaskView />
          )}

          {/* Team Summary */}
          <TeamSummary />
        </main>
      )}


      {/* Loading Overlay */}
      <LoadingOverlay />

      {/* Screen Reader Announcer for Dynamic Updates */}
      <ScreenReaderAnnouncer />

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp />
    </div>
  );
}

export default App;