import React, { useState } from 'react';
import { useAppStore } from '../stores/appStore';
import { translations } from '../data/translations';
import { exportTasks, ExportOptions } from '../utils/exportUtils';
import { X, Download, FileText, Database, File, Printer } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { language, filteredTasks, tasks } = useAppStore();
  const t = translations[language];

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

  const handleExport = () => {
    const tasksToExport = options.scope === 'filtered' ? filteredTasks : tasks;
    exportTasks(tasksToExport, options);
    onClose();
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t.exportTasks}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t.selectExportOptions}
          </p>

          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t.exportFormat}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'csv', icon: Database, label: 'CSV' },
                { value: 'json', icon: FileText, label: 'JSON' },
                { value: 'txt', icon: File, label: t.plainText },
                { value: 'pdf', icon: Printer, label: 'PDF' }
              ].map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => setOptions(prev => ({ ...prev, format: value as any }))}
                  className={`flex items-center justify-center gap-2 p-3 border rounded-lg transition-all ${
                    options.format === value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Scope Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t.exportScope}
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="scope"
                  value="filtered"
                  checked={options.scope === 'filtered'}
                  onChange={(e) => setOptions(prev => ({ ...prev, scope: e.target.value as any }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t.filteredTasksOnly} ({filteredTasks.length} {t.tasks})
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="scope"
                  value="all"
                  checked={options.scope === 'all'}
                  onChange={(e) => setOptions(prev => ({ ...prev, scope: e.target.value as any }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t.allTasksExport} ({tasks.length} {t.tasks})
                </span>
              </label>
            </div>
          </div>

          {/* Language Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t.exportLanguage}
            </label>
            <div className="flex gap-2">
              {[
                { value: 'es', label: 'Español' },
                { value: 'en', label: 'English' }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setOptions(prev => ({ ...prev, language: value as any }))}
                  className={`flex-1 py-2 px-4 border rounded-lg text-sm font-medium transition-all ${
                    options.language === value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Fields to Include */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t.fieldsToInclude}
            </label>
            <div className="grid grid-cols-2 gap-2 text-sm">
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
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={options.includeFields[key as keyof ExportOptions['includeFields']]}
                    onChange={(e) => handleFieldChange(key as any, e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {t.export}
          </button>
        </div>
      </div>
    </div>
  );
};