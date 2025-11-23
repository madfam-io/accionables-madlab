import React from 'react';
import { X } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { translations } from '../data/translations';

interface FilterChip {
  type: 'search' | 'assignee' | 'difficulty' | 'phase' | 'duration';
  value: string | number;
  label: string;
}

export const FilterChips: React.FC = () => {
  const { filters, setFilter, language } = useAppStore();
  const t = translations[language];
  
  const activeFilters: FilterChip[] = [];
  
  // Build active filters array
  if (filters.search) {
    activeFilters.push({
      type: 'search',
      value: filters.search,
      label: `"${filters.search}"`
    });
  }
  
  if (filters.assignee) {
    activeFilters.push({
      type: 'assignee',
      value: filters.assignee,
      label: filters.assignee
    });
  }
  
  if (filters.difficulty !== null) {
    activeFilters.push({
      type: 'difficulty',
      value: filters.difficulty,
      label: `${t.level} ${filters.difficulty}`
    });
  }
  
  if (filters.phase !== null) {
    activeFilters.push({
      type: 'phase',
      value: filters.phase,
      label: `${t.phase} ${filters.phase}`
    });
  }
  
  if (filters.duration !== 'all') {
    const durationLabels = {
      short: language === 'es' ? 'Corta' : 'Short',
      medium: language === 'es' ? 'Media' : 'Medium',
      long: language === 'es' ? 'Larga' : 'Long'
    };
    activeFilters.push({
      type: 'duration',
      value: filters.duration,
      label: durationLabels[filters.duration]
    });
  }
  
  const removeFilter = (chip: FilterChip) => {
    switch (chip.type) {
      case 'search':
        setFilter('search', '');
        break;
      case 'assignee':
        setFilter('assignee', '');
        break;
      case 'difficulty':
        setFilter('difficulty', null);
        break;
      case 'phase':
        setFilter('phase', null);
        break;
      case 'duration':
        setFilter('duration', 'all');
        break;
    }
  };
  
  if (activeFilters.length === 0) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap gap-2 mt-3 animate-fadeIn">
      {activeFilters.map((chip, index) => (
        <div
          key={`${chip.type}-${chip.value}-${index}`}
          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
        >
          <span>{chip.label}</span>
          <button
            onClick={() => removeFilter(chip)}
            className="ml-1 hover:text-blue-900 dark:hover:text-blue-100 transition-colors"
            aria-label={`Remove ${chip.label} filter`}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      
      {activeFilters.length > 1 && (
        <button
          onClick={() => {
            setFilter('search', '');
            setFilter('assignee', '');
            setFilter('difficulty', null);
            setFilter('phase', null);
            setFilter('duration', 'all');
          }}
          className="inline-flex items-center gap-1 px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <X className="w-3 h-3" />
          <span>{t.clear}</span>
        </button>
      )}
    </div>
  );
};