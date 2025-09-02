import { useEffect } from 'react';
import { Header } from './components/Header';
import { UnifiedToolbarV2 } from './components/UnifiedToolbarV2';
import { StatsGrid } from './components/StatsGrid';
import { PhaseSection } from './components/PhaseSection';
import { TeamSummary } from './components/TeamSummary';
import { GanttChart } from './components/GanttChart/GanttChart';
import { LoadingOverlay } from './components/LoadingOverlay';
import { GroupedTaskView } from './components/GroupedTaskView';
import { useAppStore } from './stores/appStore';
import './App.css';

function App() {
  const { theme, viewMode, groupingOption } = useAppStore();

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      
      {viewMode === 'gantt' ? (
        /* Gantt View - Full Height */
        <div className="h-[calc(100vh-theme(spacing.20))] flex flex-col">
          <div className="px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <UnifiedToolbarV2 />
          </div>
          <div className="flex-1">
            <GanttChart />
          </div>
        </div>
      ) : (
        /* List/Grid View - Container Layout */
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
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
        </div>
      )}
      
      {/* Loading Overlay */}
      <LoadingOverlay />
    </div>
  );
}

export default App;