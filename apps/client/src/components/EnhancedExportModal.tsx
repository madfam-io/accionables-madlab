import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useAppStore, filterTasks } from '../stores/appStore';
import { useTasks } from '../hooks/useTasks';
import { translations } from '../data/translations';
import { exportTasks, ExportOptions } from '../utils/exportUtils';
import { X, Download, FileText, Database, File, Printer, ChevronDown } from 'lucide-react';
import { useTouchGestures } from '../hooks/useTouchGestures';
import { useResponsive } from '../hooks/useResponsive';

interface EnhancedExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnhancedExportModal: React.FC<EnhancedExportModalProps> = ({ isOpen, onClose }) => {
  const { language, filters } = useAppStore();

  // Get tasks from React Query
  const { data: tasks = [] } = useTasks();

  // Calculate filtered tasks locally
  const filteredTasks = useMemo(() => filterTasks(tasks, filters), [tasks, filters]);
  const t = translations[language as keyof typeof translations];
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const responsive = useResponsive();
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [modalPosition, setModalPosition] = useState({ y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const [options, setOptions] = useState<ExportOptions>({
    format: 'csv',
    scope: 'filtered',
    language: language,
    includeFields: {
      id: true,
      name: true,
      assignee: true,
      hours: true,
      difficulty: true,
      dependencies: true,
      phase: true,
      section: true
    }
  });

  // Touch gesture handlers for mobile
  const { pullDistance } = useTouchGestures(modalRef, {
    onSwipe: (direction, velocity) => {
      if (direction === 'down' && velocity > 0.5) {
        onClose();
      }
    },
    onLongPress: () => {
      // Show context menu or additional options
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    },
    onPullToRefresh: () => {
      // Reset form to defaults
      setOptions({
        format: 'csv',
        scope: 'filtered',
        language: language,
        includeFields: {
          id: true,
          name: true,
          assignee: true,
          hours: true,
          difficulty: true,
          dependencies: true,
          phase: true,
          section: true
        }
      });
    }
  }, isOpen && responsive.isMobile);

  // Handle drag to dismiss on mobile
  useEffect(() => {
    if (pullDistance > 0) {
      setModalPosition({ y: pullDistance });
      setIsDragging(true);
      if (pullDistance > 150) {
        onClose();
      }
    } else {
      setModalPosition({ y: 0 });
      setIsDragging(false);
    }
  }, [pullDistance, onClose]);

  // Simulate export progress for better UX
  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      const tasksToExport = options.scope === 'filtered' ? filteredTasks : tasks;
      await exportTasks(tasksToExport, options);
      setExportProgress(100);
      
      // Haptic feedback on success
      if (navigator.vibrate) {
        navigator.vibrate([50, 100, 50]);
      }
      
      setTimeout(() => {
        onClose();
        setIsExporting(false);
        setExportProgress(0);
      }, 500);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
      setExportProgress(0);
      clearInterval(progressInterval);
    }
  };

  const handleFieldChange = (field: keyof ExportOptions['includeFields'], value: boolean) => {
    setOptions(prev => ({
      ...prev,
      includeFields: {
        ...prev.includeFields,
        [field]: value
      }
    }));
  };

  if (!isOpen) return null;

  const modalClasses = responsive.isMobile
    ? 'fixed inset-x-0 bottom-0 rounded-t-2xl max-h-[85vh]'
    : 'relative rounded-lg max-w-md w-full max-h-[90vh]';

  const overlayClasses = responsive.isMobile
    ? 'fixed inset-0 bg-black/60 backdrop-blur-sm'
    : 'fixed inset-0 bg-black/50 flex items-center justify-center p-4';

  return (
    <div className={`${overlayClasses} z-50 ${isDragging ? 'transition-none' : 'transition-all'}`}>
      <div
        ref={modalRef}
        className={`bg-white dark:bg-gray-800 shadow-2xl overflow-hidden ${modalClasses} ${
          isDragging ? 'transition-none' : 'transition-all duration-300 ease-out'
        }`}
        style={{
          transform: `translateY(${modalPosition.y}px)`,
          opacity: modalPosition.y > 100 ? 0.5 : 1
        }}
      >
        {/* Mobile drag handle */}
        {responsive.isMobile && (
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t.exportTasks}
          </h2>
          <button
            onClick={onClose}
            className="p-2 -m-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div ref={contentRef} className="p-6 space-y-6 overflow-y-auto">
          {/* Progress indicator */}
          {isExporting && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>{t.exporting || 'Exporting...'}</span>
                <span>{exportProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>
          )}

          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t.selectExportOptions}
          </p>

          {/* Format Selection - Mobile optimized */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t.exportFormat}
            </label>
            <div className={`grid ${responsive.isMobile ? 'grid-cols-2' : 'grid-cols-2'} gap-3`}>
              {[
                { value: 'csv', icon: Database, label: 'CSV' },
                { value: 'json', icon: FileText, label: 'JSON' },
                { value: 'txt', icon: File, label: t.plainText },
                { value: 'pdf', icon: Printer, label: 'PDF' }
              ].map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => setOptions(prev => ({ ...prev, format: value as any }))}
                  className={`flex items-center justify-center gap-2 p-4 border-2 rounded-xl transition-all touch-manipulation ${
                    options.format === value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 scale-105'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 active:scale-95'
                  } ${responsive.isMobile ? 'min-h-[60px]' : ''}`}
                  disabled={isExporting}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Scope Selection - Touch optimized */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t.exportScope}
            </label>
            <div className="space-y-3">
              {[
                { value: 'filtered', label: `${t.filteredTasksOnly} (${filteredTasks.length})` },
                { value: 'all', label: `${t.allTasksExport} (${tasks.length})` }
              ].map(({ value, label }) => (
                <label
                  key={value}
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all touch-manipulation ${
                    options.scope === value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  } ${responsive.isMobile ? 'min-h-[60px]' : ''}`}
                >
                  <input
                    type="radio"
                    name="scope"
                    value={value}
                    checked={options.scope === value}
                    onChange={(e) => setOptions(prev => ({ ...prev, scope: e.target.value as any }))}
                    className="mr-3 w-5 h-5"
                    disabled={isExporting}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Language Selection - Large touch targets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t.exportLanguage}
            </label>
            <div className="flex gap-3">
              {[
                { value: 'es', label: 'Español', flag: '🇪🇸' },
                { value: 'en', label: 'English', flag: '🇺🇸' }
              ].map(({ value, label, flag }) => (
                <button
                  key={value}
                  onClick={() => setOptions(prev => ({ ...prev, language: value as any }))}
                  className={`flex-1 py-4 px-4 border-2 rounded-xl text-sm font-medium transition-all touch-manipulation ${
                    options.language === value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 scale-105'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 active:scale-95'
                  } ${responsive.isMobile ? 'min-h-[60px]' : ''}`}
                  disabled={isExporting}
                >
                  <span className="mr-2">{flag}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Fields to Include - Collapsible on mobile */}
          <details className="group" open={!responsive.isMobile}>
            <summary className="flex items-center justify-between cursor-pointer list-none p-3 -m-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t.fieldsToInclude}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500 transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              {[
                { key: 'id', label: t.taskId },
                { key: 'name', label: t.taskName },
                { key: 'assignee', label: t.assignedTo },
                { key: 'hours', label: t.duration },
                { key: 'difficulty', label: t.difficulty },
                { key: 'phase', label: t.phase },
                { key: 'section', label: t.section },
                { key: 'dependencies', label: t.dependencies }
              ].map(({ key, label }) => (
                <label
                  key={key}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all touch-manipulation ${
                    options.includeFields[key as keyof ExportOptions['includeFields']]
                      ? 'border-blue-200 bg-blue-50/50 dark:bg-blue-900/10'
                      : 'border-gray-200 dark:border-gray-700'
                  } ${responsive.isMobile ? 'min-h-[48px]' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={options.includeFields[key as keyof ExportOptions['includeFields']]}
                    onChange={(e) => handleFieldChange(key as any, e.target.checked)}
                    className="mr-2 w-4 h-4"
                    disabled={isExporting}
                  />
                  <span className="text-gray-700 dark:text-gray-300 text-xs">{label}</span>
                </label>
              ))}
            </div>
          </details>
        </div>

        {/* Footer - Sticky on mobile */}
        <div className={`flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700 ${
          responsive.isMobile ? 'sticky bottom-0 bg-white dark:bg-gray-800' : ''
        }`}>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 disabled:opacity-50 touch-manipulation active:scale-95"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation active:scale-95"
          >
            {isExporting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isExporting ? t.exporting || 'Exporting...' : t.export}
          </button>
        </div>
      </div>
    </div>
  );
};