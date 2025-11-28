import React, { useState } from 'react';
import { useAppStore, TimeScale } from '../../stores/appStore';
import { translations } from '../../data/translations';
import { Calendar, ZoomIn, ZoomOut, BarChart3, Eye, EyeOff, Users, Target, Sparkles } from 'lucide-react';
import { EventSetterModal } from './EventSetterModal';

export const GanttHeader: React.FC = () => {
  const {
    language,
    ganttConfig,
    setGanttConfig,
    culminatingEvent
  } = useAppStore();
  const t = translations[language];
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const handleTimeScaleChange = (timeScale: TimeScale) => {
    setGanttConfig({ timeScale });
  };

  // Grouping is now controlled from UnifiedToolbar

  const handleZoomChange = (delta: number) => {
    const newZoom = Math.max(0.5, Math.min(3, ganttConfig.zoomLevel + delta));
    setGanttConfig({ zoomLevel: newZoom });
  };

  const toggleDependencies = () => {
    setGanttConfig({ showDependencies: !ganttConfig.showDependencies });
  };

  const toggleCriticalPath = () => {
    setGanttConfig({ showCriticalPath: !ganttConfig.showCriticalPath });
    // The GanttChart component will react to ganttConfig changes automatically
  };

  const toggleAutoScheduling = () => {
    const newAutoScheduling = !ganttConfig.autoScheduling;
    setGanttConfig({ autoScheduling: newAutoScheduling });
    // The GanttChart component will react to ganttConfig changes automatically
  };

  const toggleConvergence = () => {
    setGanttConfig({ showConvergence: !ganttConfig.showConvergence });
  };

  return (
    <>
      <EventSetterModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
      />
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Time Scale Selector */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <select 
            value={ganttConfig.timeScale}
            onChange={(e) => handleTimeScaleChange(e.target.value as TimeScale)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="days">{t.days}</option>
            <option value="weeks">{t.weeks}</option>
            <option value="months">{t.months}</option>
          </select>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 border border-gray-300 dark:border-gray-600 rounded">
          <button
            onClick={() => handleZoomChange(-0.2)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={t.zoomOut}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="px-2 text-sm text-gray-600 dark:text-gray-400">
            {Math.round(ganttConfig.zoomLevel * 100)}%
          </span>
          <button
            onClick={() => handleZoomChange(0.2)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={t.zoomIn}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Toggle Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDependencies}
            className={`flex items-center gap-1 px-2 py-1 rounded text-sm transition-colors ${
              ganttConfig.showDependencies
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title={ganttConfig.showDependencies ? t.hideDependencies : t.showDependencies}
          >
            {ganttConfig.showDependencies ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {t.dependencies}
          </button>

          <button
            onClick={toggleCriticalPath}
            className={`flex items-center gap-1 px-2 py-1 rounded text-sm transition-colors ${
              ganttConfig.showCriticalPath
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title={t.criticalPath}
          >
            <BarChart3 className="w-4 h-4" />
            {t.criticalPath}
          </button>

          <button
            onClick={toggleAutoScheduling}
            className={`flex items-center gap-1 px-2 py-1 rounded text-sm transition-colors ${
              ganttConfig.autoScheduling
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title={t.autoScheduling}
          >
            <Users className="w-4 h-4" />
            {t.autoScheduling}
          </button>
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

        {/* Convergence Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleConvergence}
            className={`flex items-center gap-1 px-2 py-1 rounded text-sm transition-colors ${
              ganttConfig.showConvergence
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title={language === 'es' ? 'Mostrar convergencia' : 'Show convergence'}
          >
            <Sparkles className="w-4 h-4" />
            {language === 'es' ? 'Convergencia' : 'Convergence'}
          </button>

          <button
            onClick={() => setIsEventModalOpen(true)}
            className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium transition-colors ${
              culminatingEvent
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm hover:shadow-md'
                : 'border-2 border-dashed border-indigo-300 dark:border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
            }`}
          >
            <Target className="w-4 h-4" />
            {culminatingEvent
              ? (language === 'es' ? culminatingEvent.name : culminatingEvent.nameEn)
              : (language === 'es' ? 'Definir evento' : 'Set event')
            }
          </button>
        </div>
      </div>
    </div>
    </>
  );
};