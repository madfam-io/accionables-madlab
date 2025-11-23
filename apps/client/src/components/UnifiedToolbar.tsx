import React, { useState } from 'react';
import { 
  Search, Filter, Layers, Download, X, ChevronDown, 
  Users, TrendingUp, Calendar, Grid, List, 
  BarChart3, Settings, SlidersHorizontal,
  ChevronsDownUp, ChevronsUpDown
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { translations } from '../data/translations';
import { GroupingOption } from './GroupingSelector';
import { teamMembers } from '../data/projectData';
import { useEnhancedTasks } from '../hooks/useEnhancedTasks';

export const UnifiedToolbar: React.FC = () => {
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<'filters' | 'group' | 'export' | null>(null);

  // Check if any filters are active
  const hasActiveFilters = filters.search || 
    filters.assignee !== 'all' || 
    filters.difficulty !== null || 
    filters.phase !== null || 
    filters.duration !== 'all';

  const groupingOptions: { value: GroupingOption; label: string; icon: React.ReactNode }[] = [
    { value: 'phase', label: language === 'es' ? 'Por Fase' : 'By Phase', icon: <Layers className="w-4 h-4" /> },
    { value: 'week', label: language === 'es' ? 'Por Semana' : 'By Week', icon: <Calendar className="w-4 h-4" /> },
    { value: 'assignee', label: language === 'es' ? 'Por Miembro' : 'By Member', icon: <Users className="w-4 h-4" /> },
    { value: 'difficulty', label: language === 'es' ? 'Por Dificultad' : 'By Difficulty', icon: <TrendingUp className="w-4 h-4" /> },
    { value: 'none', label: language === 'es' ? 'Sin Agrupar' : 'No Grouping', icon: null }
  ];

  const viewModes = [
    { value: 'list', icon: <List className="w-5 h-5" />, label: language === 'es' ? 'Lista' : 'List' },
    { value: 'grid', icon: <Grid className="w-5 h-5" />, label: language === 'es' ? 'Cuadrícula' : 'Grid' },
    { value: 'gantt', icon: <BarChart3 className="w-5 h-5" />, label: language === 'es' ? 'Gantt' : 'Gantt' }
  ];

  // Enhance tasks for export to include week numbers
  const enhancedTasks = useEnhancedTasks(filteredTasks, language);

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
      // For PDF, we'll create a printable view
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const groupedByPhase = tasks.reduce((acc, task) => {
          const phase = task.phase;
          if (!acc[phase]) acc[phase] = [];
          acc[phase].push(task);
          return acc;
        }, {} as Record<number, typeof tasks>);
        
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>MADLAB Tasks - ${timestamp}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
              h2 { color: #374151; margin-top: 30px; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
              th { background-color: #f3f4f6; font-weight: bold; }
              tr:nth-child(even) { background-color: #f9fafb; }
              .difficulty { display: inline-block; width: 15px; height: 15px; margin-right: 5px; }
              @media print { 
                h1 { page-break-after: avoid; }
                h2 { page-break-after: avoid; }
                table { page-break-inside: avoid; }
              }
            </style>
          </head>
          <body>
            <h1>MADLAB Project Tasks</h1>
            <p>Generated: ${new Date().toLocaleDateString()}</p>
            <p>Total Tasks: ${tasks.length}</p>
            ${Object.entries(groupedByPhase).map(([phase, phaseTasks]) => `
              <h2>Phase ${phase}</h2>
              <table>
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Assignee</th>
                    <th>Hours</th>
                    <th>Difficulty</th>
                    <th>Week</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${phaseTasks.map(task => `
                    <tr>
                      <td>${language === 'es' ? task.name : task.nameEn}</td>
                      <td>${task.assignee}</td>
                      <td>${task.hours}</td>
                      <td>${'⭐'.repeat(task.difficulty)}</td>
                      <td>${task.weekNumber || 'TBD'}</td>
                      <td>${task.manualStatus || 'pending'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `).join('')}
          </body>
          </html>
        `;
        
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.print();
      }
    }
    
    setActiveSection(null);
    setIsExpanded(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
      {/* Main Toolbar */}
      <div className="p-3 lg:p-4">
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 lg:items-center">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={filters.search}
                onChange={(e) => setFilter('search', e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              {filters.search && (
                <button
                  onClick={() => setFilter('search', '')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-2">
            {/* View Mode Selector */}
            <div className="flex bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
              {viewModes.map(mode => (
                <button
                  key={mode.value}
                  onClick={() => setViewMode(mode.value as any)}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === mode.value
                      ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                  title={mode.label}
                >
                  {mode.icon}
                </button>
              ))}
            </div>

            {/* Filter Button */}
            <button
              onClick={() => {
                setIsExpanded(!isExpanded);
                setActiveSection(activeSection === 'filters' ? null : 'filters');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                hasActiveFilters
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                  : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'es' ? 'Filtros' : 'Filters'}</span>
              {hasActiveFilters && (
                <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {[
                    filters.search ? 1 : 0,
                    filters.assignee !== 'all' ? 1 : 0,
                    filters.difficulty !== null ? 1 : 0,
                    filters.phase !== null ? 1 : 0,
                    filters.duration !== 'all' ? 1 : 0
                  ].reduce((a, b) => a + b, 0)}
                </span>
              )}
            </button>

            {/* Grouping Button */}
            <button
              onClick={() => {
                setIsExpanded(!isExpanded);
                setActiveSection(activeSection === 'group' ? null : 'group');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                groupingOption !== 'none'
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                  : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'es' ? 'Agrupar' : 'Group'}</span>
              {groupingOption !== 'none' && (
                <span className="text-xs">
                  {groupingOptions.find(g => g.value === groupingOption)?.label}
                </span>
              )}
            </button>

            {/* Export Button */}
            <button
              onClick={() => {
                setIsExpanded(!isExpanded);
                setActiveSection(activeSection === 'export' ? null : 'export');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-all"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'es' ? 'Exportar' : 'Export'}</span>
            </button>

            {/* Collapse/Expand All - Show when grouping by phase in any view */}
            {groupingOption === 'phase' && (
              <div className="flex gap-1 border-l border-gray-300 dark:border-gray-600 pl-2">
                <button
                  onClick={collapseAll}
                  className="flex items-center gap-1 px-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-all"
                  title={t.collapseAll}
                >
                  <ChevronsUpDown className="w-4 h-4" />
                  <span className="hidden lg:inline text-sm">{t.collapseAll}</span>
                </button>
                <button
                  onClick={expandAll}
                  className="flex items-center gap-1 px-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-all"
                  title={t.expandAll}
                >
                  <ChevronsDownUp className="w-4 h-4" />
                  <span className="hidden lg:inline text-sm">{t.expandAll}</span>
                </button>
              </div>
            )}
          </div>

          {/* Task Count */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {filteredTasks.length} {language === 'es' ? 'tareas' : 'tasks'}
          </div>
        </div>
      </div>

      {/* Expanded Sections */}
      {isExpanded && activeSection && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 animate-slideDown">
          {/* Filters Section */}
          {activeSection === 'filters' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {language === 'es' ? 'Filtros Avanzados' : 'Advanced Filters'}
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {language === 'es' ? 'Limpiar todo' : 'Clear all'}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                      <option key={level} value={level}>{t.level} {level}</option>
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
              </div>
            </div>
          )}

          {/* Grouping Section */}
          {activeSection === 'group' && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {language === 'es' ? 'Opciones de Agrupación' : 'Grouping Options'}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {groupingOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setGroupingOption(option.value);
                      setActiveSection(null);
                      setIsExpanded(false);
                    }}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${
                      groupingOption === option.value
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-2 border-purple-300 dark:border-purple-700'
                        : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {option.icon}
                    <span className="text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Export Section */}
          {activeSection === 'export' && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {language === 'es' ? 'Opciones de Exportación' : 'Export Options'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => handleExport('csv')}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <div className="text-left">
                    <div className="font-medium">CSV</div>
                    <div className="text-xs opacity-75">
                      {language === 'es' ? 'Para Excel' : 'For Excel'}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleExport('json')}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <div className="text-left">
                    <div className="font-medium">JSON</div>
                    <div className="text-xs opacity-75">
                      {language === 'es' ? 'Para APIs' : 'For APIs'}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleExport('pdf')}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <div className="text-left">
                    <div className="font-medium">PDF</div>
                    <div className="text-xs opacity-75">
                      {language === 'es' ? 'Para imprimir' : 'For printing'}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};