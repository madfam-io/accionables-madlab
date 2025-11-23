import React, { useState } from 'react';
import { useAppStore } from '../stores/appStore';
import { translations } from '../data/translations';
import { teamMembers } from '../data/projectData.ts.bak';
import { EnhancedExportModal } from './EnhancedExportModal';
import { FilterChips } from './FilterChips';
import { useDebouncedCallback } from '../hooks/useDebounce';
import { Search, X, Download, Maximize2, Minimize2 } from 'lucide-react';

export const FilterBar: React.FC = () => {
  const { 
    language, 
    filters, 
    filteredTasks,
    tasks,
    setFilter, 
    clearFilters,
    collapseAll,
    expandAll 
  } = useAppStore();
  const t = translations[language];
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Debounced search handler for better performance
  const handleSearch = useDebouncedCallback((value: string) => {
    setFilter('search', value);
  }, 300);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Assignee Filter */}
        <select
          value={filters.assignee}
          onChange={(e) => setFilter('assignee', e.target.value)}
          className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">{t.allMembers}</option>
          {teamMembers.map(member => (
            <option key={member.name} value={member.name}>
              {member.name}
            </option>
          ))}
        </select>

        {/* Difficulty Filter */}
        <select
          value={filters.difficulty || ''}
          onChange={(e) => setFilter('difficulty', e.target.value ? Number(e.target.value) : null)}
          className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{t.allDifficulty}</option>
          {[1, 2, 3, 4, 5].map(level => (
            <option key={level} value={level}>
              {t.level} {level}
            </option>
          ))}
        </select>

        {/* Duration Filter */}
        <select
          value={filters.duration}
          onChange={(e) => setFilter('duration', e.target.value as any)}
          className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">{t.allDuration}</option>
          <option value="short">{t.shortDuration}</option>
          <option value="medium">{t.mediumDuration}</option>
          <option value="long">{t.longDuration}</option>
        </select>
      </div>

      {/* Action Buttons and Status */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        {/* Status */}
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {filters.search || filters.assignee !== 'all' || filters.difficulty || filters.phase || filters.duration !== 'all' ? (
            <span>
              {t.showing} <span className="font-semibold">{filteredTasks.length}</span> {t.of} {tasks.length} {t.tasks.toLowerCase()}
            </span>
          ) : (
            <span>{t.showingAllTasks} ({tasks.length})</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={clearFilters}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            {t.clear}
          </button>
          
          <button
            onClick={collapseAll}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1"
          >
            <Minimize2 className="w-3 h-3" />
            {t.collapseAll}
          </button>
          
          <button
            onClick={expandAll}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1"
          >
            <Maximize2 className="w-3 h-3" />
            {t.expandAll}
          </button>
          
          <button
            onClick={() => setShowExportModal(true)}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
          >
            <Download className="w-3 h-3" />
            {t.export}
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <FilterChips />

      <EnhancedExportModal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)} 
      />
    </div>
  );
};