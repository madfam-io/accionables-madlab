import React from 'react';
import { useAppStore, TimeScale, GroupBy } from '../../stores/appStore';
import { translations } from '../../data/translations';
import { Calendar, ZoomIn, ZoomOut, BarChart3, Users, Layers, Eye, EyeOff } from 'lucide-react';

export const GanttHeader: React.FC = () => {
  const { 
    language, 
    ganttConfig, 
    setGanttConfig,
    scheduleGanttTasks 
  } = useAppStore();
  const t = translations[language];

  const handleTimeScaleChange = (timeScale: TimeScale) => {
    setGanttConfig({ timeScale });
  };

  const handleGroupByChange = (groupBy: GroupBy) => {
    setGanttConfig({ groupBy });
  };

  const handleZoomChange = (delta: number) => {
    const newZoom = Math.max(0.5, Math.min(3, ganttConfig.zoomLevel + delta));
    setGanttConfig({ zoomLevel: newZoom });
  };

  const toggleDependencies = () => {
    setGanttConfig({ showDependencies: !ganttConfig.showDependencies });
  };

  const toggleCriticalPath = () => {
    setGanttConfig({ showCriticalPath: !ganttConfig.showCriticalPath });
    // Recalculate to update critical path highlighting
    scheduleGanttTasks();
  };

  const toggleAutoScheduling = () => {
    const newAutoScheduling = !ganttConfig.autoScheduling;
    setGanttConfig({ autoScheduling: newAutoScheduling });
    // Re-schedule tasks with new mode (auto or manual)
    scheduleGanttTasks();
  };

  return (
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

        {/* Group By Selector */}
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <select 
            value={ganttConfig.groupBy}
            onChange={(e) => handleGroupByChange(e.target.value as GroupBy)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="phase">{t.byPhase}</option>
            <option value="assignee">{t.byAssignee}</option>
            <option value="none">{t.noGrouping}</option>
          </select>
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
      </div>
    </div>
  );
};