import React from 'react';
import { useAppStore } from '../stores/appStore';
import { translations } from '../data/translations';
import { UserSwitcher } from './UserSwitcher';
import { Sun, Moon, Monitor, Globe, Grid, List, BarChart3 } from 'lucide-react';

export const Header: React.FC = () => {
  const { theme, language, viewMode, setTheme, setLanguage, setViewMode } = useAppStore();
  const t = translations[language];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          {/* Title Section */}
          <div className="text-center lg:text-left">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              {t.heroTitle}
            </h1>
            <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 mt-1">
              {t.heroSubtitle}
            </p>
            <p className="text-xs lg:text-sm text-blue-600 dark:text-blue-400 mt-1">
              {t.startDate}
            </p>
          </div>

          {/* Controls Section */}
          <div className="flex flex-col lg:flex-row items-center gap-3">
            {/* User Switcher */}
            <UserSwitcher />
            
            <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
                title={t.listViewTitle}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
                title={t.gridViewTitle}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('gantt')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'gantt'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
                title={t.ganttViewTitle}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{language.toUpperCase()}</span>
            </button>

            {/* Theme Selector */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setTheme('auto')}
                className={`p-2 rounded transition-colors ${
                  theme === 'auto'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
                title={t.themeAuto}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`p-2 rounded transition-colors ${
                  theme === 'light'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
                title={t.themeLight}
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-2 rounded transition-colors ${
                  theme === 'dark'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
                title={t.themeDark}
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};