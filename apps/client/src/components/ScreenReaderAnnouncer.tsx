import { useEffect, useRef } from 'react';
import { useAppStore } from '../stores/appStore';

/**
 * ScreenReaderAnnouncer - Invisible component for announcing changes to screen readers
 * Uses ARIA live regions to announce filter changes, view changes, and other updates
 */
export const ScreenReaderAnnouncer: React.FC = () => {
  const { filteredTasks, viewMode, groupingOption, language, filters } = useAppStore();
  const previousFiltersRef = useRef(filters);
  const previousViewModeRef = useRef(viewMode);
  const previousGroupingRef = useRef(groupingOption);
  const announcementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const announcements: string[] = [];

    // Announce filter changes
    const prevFilters = previousFiltersRef.current;
    if (filters.search !== prevFilters.search && filters.search) {
      announcements.push(
        language === 'es'
          ? `Buscando: ${filters.search}`
          : `Searching for: ${filters.search}`
      );
    }

    if (filters.assignee !== prevFilters.assignee) {
      const assigneeText = filters.assignee || (language === 'es' ? 'Todos' : 'All');
      announcements.push(
        language === 'es'
          ? `Filtrado por asignado: ${assigneeText}`
          : `Filtering by assignee: ${assigneeText}`
      );
    }

    if (filters.difficulty !== prevFilters.difficulty) {
      const difficultyText = filters.difficulty || (language === 'es' ? 'Todos' : 'All');
      announcements.push(
        language === 'es'
          ? `Filtrado por dificultad: ${difficultyText}`
          : `Filtering by difficulty: ${difficultyText}`
      );
    }

    // Announce view mode changes
    if (viewMode !== previousViewModeRef.current) {
      const viewText =
        viewMode === 'gantt'
          ? language === 'es'
            ? 'Vista de Gantt'
            : 'Gantt view'
          : language === 'es'
            ? 'Vista de lista'
            : 'List view';
      announcements.push(
        language === 'es' ? `Cambiado a ${viewText}` : `Switched to ${viewText}`
      );
    }

    // Announce grouping changes
    if (groupingOption !== previousGroupingRef.current) {
      const groupingLabels = {
        phase: language === 'es' ? 'fase' : 'phase',
        assignee: language === 'es' ? 'asignado' : 'assignee',
        difficulty: language === 'es' ? 'dificultad' : 'difficulty',
        week: language === 'es' ? 'semana' : 'week',
      };
      const groupingText = groupingLabels[groupingOption as keyof typeof groupingLabels];
      announcements.push(
        language === 'es'
          ? `Agrupado por ${groupingText}`
          : `Grouped by ${groupingText}`
      );
    }

    // Announce results count
    if (
      filters !== prevFilters ||
      viewMode !== previousViewModeRef.current ||
      groupingOption !== previousGroupingRef.current
    ) {
      announcements.push(
        language === 'es'
          ? `${filteredTasks.length} tareas mostradas`
          : `${filteredTasks.length} tasks shown`
      );
    }

    // Update announcements
    if (announcements.length > 0 && announcementRef.current) {
      announcementRef.current.textContent = announcements.join('. ');
    }

    // Update refs
    previousFiltersRef.current = filters;
    previousViewModeRef.current = viewMode;
    previousGroupingRef.current = groupingOption;
  }, [filteredTasks, viewMode, groupingOption, language, filters]);

  return (
    <div
      ref={announcementRef}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  );
};
