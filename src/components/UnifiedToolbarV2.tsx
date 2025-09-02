import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, X, Settings, Filter, Layers, Download,
  ChevronDown, Check, Grid, List, BarChart3,
  ChevronsUpDown, ChevronsDownUp, SlidersHorizontal
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { translations } from '../data/translations';
import { teamMembers } from '../data/projectData';
import { useEnhancedTasks } from '../hooks/useEnhancedTasks';

export const UnifiedToolbarV2: React.FC = () => {
  const { 
    language, 
    filters, 
    groupingOption,
    viewMode,
    setFilter, 
    clearFilters,
    setGroupingOption,
    setViewMode,
    filteredTasks,
    collapsedPhases,
    collapseAll,
    expandAll
  } = useAppStore();
  
  const t = translations[language];
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'filters' | 'grouping' | 'export'>('filters');
  const settingsRef = useRef<HTMLDivElement>(null);
  
  // Enhanced tasks for export
  const enhancedTasks = useEnhancedTasks(filteredTasks, language);
  
  // Close settings when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Check active filters
  const activeFilterCount = [
    filters.search ? 1 : 0,
    filters.assignee !== 'all' ? 1 : 0,
    filters.difficulty !== null ? 1 : 0,
    filters.phase !== null ? 1 : 0,
    filters.duration !== 'all' ? 1 : 0
  ].reduce((a, b) => a + b, 0);
  
  const hasActiveFilters = activeFilterCount > 0;
  const isGrouped = groupingOption !== 'none';
  
  // View modes configuration
  const viewModes = [
    { value: 'list', icon: List, label: language === 'es' ? 'Lista' : 'List' },
    { value: 'grid', icon: Grid, label: language === 'es' ? 'Cuadrícula' : 'Grid' },
    { value: 'gantt', icon: BarChart3, label: 'Gantt' }
  ];
  
  // Grouping options
  const groupingOptions = [
    { value: 'none', label: language === 'es' ? 'Sin Agrupar' : 'No Grouping' },
    { value: 'phase', label: language === 'es' ? 'Por Fase' : 'By Phase' },
    { value: 'week', label: language === 'es' ? 'Por Semana' : 'By Week' },
    { value: 'assignee', label: language === 'es' ? 'Por Miembro' : 'By Member' },
    { value: 'difficulty', label: language === 'es' ? 'Por Dificultad' : 'By Difficulty' }
  ];
  
  const handleExport = (format: 'csv' | 'json' | 'pdf') => {
    const tasks = enhancedTasks;
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `madlab-tasks-${timestamp}`;

    if (format === 'csv') {
      const headers = ['ID', 'Task', 'Assignee', 'Phase', 'Hours', 'Difficulty', 'Week', 'Status'];
      const rows = tasks.map(task => [
        task.id,
        language === 'es' ? task.name : task.nameEn,
        task.assignee,
        task.phase,
        task.hours,
        task.difficulty,
        task.weekNumber || '',
        task.manualStatus || 'pending'
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => 
          typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
        ).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
    } else if (format === 'json') {
      const exportData = tasks.map(task => ({
        id: task.id,
        name: language === 'es' ? task.name : task.nameEn,
        assignee: task.assignee,
        phase: task.phase,
        hours: task.hours,
        difficulty: task.difficulty,
        week: task.weekNumber,
        status: task.manualStatus || 'pending',
        section: language === 'es' ? task.section : task.sectionEn
      }));
      const jsonContent = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.json`;
      link.click();
      URL.revokeObjectURL(link.href);
    } else if (format === 'pdf') {
      window.print();
    }
    
    setShowSettings(false);
  };
  
  return (
    <div className="relative">
      {/* Main Toolbar */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
        <div className="p-3 lg:p-4">
          <div className="flex items-center gap-3">
            {/* Search Bar - Takes available space */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={filters.search}
                  onChange={(e) => setFilter('search', e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                {filters.search && (
                  <button
                    onClick={() => setFilter('search', '')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            {/* View Mode Selector - Compact segmented control */}
            <div className="hidden sm:flex bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
              {viewModes.map(mode => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.value}
                    onClick={() => setViewMode(mode.value as any)}
                    className={`group relative px-3 py-2 rounded-md transition-all ${
                      viewMode === mode.value
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                    title={mode.label}
                  >
                    <Icon className="w-4 h-4" />
                    {viewMode === mode.value && (
                      <span className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Settings Menu Button */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`relative p-2.5 rounded-lg transition-all ${
                showSettings || hasActiveFilters || isGrouped
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
              title={language === 'es' ? 'Configuración' : 'Settings'}
            >
              <Settings className="w-5 h-5" />
              {(hasActiveFilters || isGrouped) && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </button>
            
            {/* Task Count Badge */}
            <div className="hidden sm:flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-900 rounded-lg">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {filteredTasks.length}
              </span>
              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                {language === 'es' ? 'tareas' : 'tasks'}
              </span>
            </div>
            
            {/* Collapse/Expand - Contextual */}
            {groupingOption === 'phase' && (
              <div className="hidden lg:flex gap-1">
                <button
                  onClick={collapseAll}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title={t.collapseAll}
                >
                  <ChevronsUpDown className="w-4 h-4" />
                </button>
                <button
                  onClick={expandAll}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title={t.expandAll}
                >
                  <ChevronsDownUp className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Active Filters Bar - Only show when filters/grouping active */}
        {(hasActiveFilters || isGrouped) && (
          <div className="border-t border-gray-200 dark:border-gray-700 px-3 lg:px-4 py-2 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {hasActiveFilters && (
                <span className="text-gray-600 dark:text-gray-400">
                  {activeFilterCount} {language === 'es' ? 'filtros activos' : 'active filters'}
                </span>
              )}
              
              {hasActiveFilters && isGrouped && (
                <span className="text-gray-400 dark:text-gray-600">•</span>
              )}
              
              {isGrouped && (
                <span className="text-gray-600 dark:text-gray-400">
                  {language === 'es' ? 'Agrupado' : 'Grouped'}: {' '}
                  <span className="font-medium text-purple-600 dark:text-purple-400">
                    {groupingOptions.find(g => g.value === groupingOption)?.label}
                  </span>
                </span>
              )}
              
              {(hasActiveFilters || isGrouped) && (
                <>
                  <span className="text-gray-400 dark:text-gray-600">•</span>
                  <button
                    onClick={() => {
                      clearFilters();
                      setGroupingOption('phase');
                    }}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {language === 'es' ? 'Limpiar todo' : 'Clear all'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Settings Dropdown Menu */}
      {showSettings && (
        <div 
          ref={settingsRef}
          className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50"
        >
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('filters')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'filters'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Filter className="w-4 h-4 inline mr-1" />
              {language === 'es' ? 'Filtros' : 'Filters'}
            </button>
            <button
              onClick={() => setActiveTab('grouping')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'grouping'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Layers className="w-4 h-4 inline mr-1" />
              {language === 'es' ? 'Agrupar' : 'Group'}
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'export'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Download className="w-4 h-4 inline mr-1" />
              {language === 'es' ? 'Exportar' : 'Export'}
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="p-4">
            {/* Filters Tab */}
            {activeTab === 'filters' && (
              <div className="space-y-3">
                {/* Assignee Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {language === 'es' ? 'Asignado a' : 'Assigned to'}
                  </label>
                  <select
                    value={filters.assignee}
                    onChange={(e) => setFilter('assignee', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="all">{t.allMembers}</option>
                    {teamMembers.map(member => (
                      <option key={member.name} value={member.name}>{member.name}</option>
                    ))}
                    <option value="All">{language === 'es' ? 'Equipo Completo' : 'Whole Team'}</option>
                  </select>
                </div>
                
                {/* Phase Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {language === 'es' ? 'Fase' : 'Phase'}
                  </label>
                  <select
                    value={filters.phase || ''}
                    onChange={(e) => setFilter('phase', e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">{t.allPhases}</option>
                    {[1, 2, 3, 4, 5].map(phase => (
                      <option key={phase} value={phase}>
                        {language === 'es' ? `Fase ${phase}` : `Phase ${phase}`}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Difficulty Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {language === 'es' ? 'Dificultad' : 'Difficulty'}
                  </label>
                  <select
                    value={filters.difficulty || ''}
                    onChange={(e) => setFilter('difficulty', e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">{t.allDifficulty}</option>
                    {[1, 2, 3, 4, 5].map(level => (
                      <option key={level} value={level}>{'⭐'.repeat(level)}</option>
                    ))}
                  </select>
                </div>
                
                {/* Duration Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {language === 'es' ? 'Duración' : 'Duration'}
                  </label>
                  <select
                    value={filters.duration}
                    onChange={(e) => setFilter('duration', e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="all">{t.allDuration}</option>
                    <option value="short">{t.shortDuration}</option>
                    <option value="medium">{t.mediumDuration}</option>
                    <option value="long">{t.longDuration}</option>
                  </select>
                </div>
                
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="w-full mt-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                  >
                    {language === 'es' ? 'Limpiar filtros' : 'Clear filters'}
                  </button>
                )}
              </div>
            )}
            
            {/* Grouping Tab */}
            {activeTab === 'grouping' && (
              <div className="space-y-2">
                {groupingOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setGroupingOption(option.value as any);
                      setShowSettings(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                      groupingOption === option.value
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="text-sm">{option.label}</span>
                    {groupingOption === option.value && (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </div>
            )}
            
            {/* Export Tab */}
            {activeTab === 'export' && (
              <div className="space-y-2">
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Download className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">CSV</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {language === 'es' ? 'Para Excel' : 'For Excel'}
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleExport('json')}
                  className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">JSON</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {language === 'es' ? 'Para APIs' : 'For APIs'}
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <Download className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">PDF</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {language === 'es' ? 'Para imprimir' : 'For printing'}
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};