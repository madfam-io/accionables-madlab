import React from 'react';
import { Layers, Calendar, Users, TrendingUp } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { translations } from '../data/translations';

export type GroupingOption = 'phase' | 'week' | 'assignee' | 'difficulty' | 'none';

export const GroupingSelector: React.FC = () => {
  const { language, groupingOption, setGroupingOption } = useAppStore();
  const t = translations[language];

  const groupingOptions: { value: GroupingOption; label: string; icon: React.ReactNode }[] = [
    {
      value: 'phase',
      label: language === 'es' ? 'Por Fase' : 'By Phase',
      icon: <Layers className="w-4 h-4" />
    },
    {
      value: 'week',
      label: language === 'es' ? 'Por Semana' : 'By Week',
      icon: <Calendar className="w-4 h-4" />
    },
    {
      value: 'assignee',
      label: language === 'es' ? 'Por Miembro' : 'By Member',
      icon: <Users className="w-4 h-4" />
    },
    {
      value: 'difficulty',
      label: language === 'es' ? 'Por Dificultad' : 'By Difficulty',
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      value: 'none',
      label: language === 'es' ? 'Sin Agrupar' : 'No Grouping',
      icon: null
    }
  ];

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {language === 'es' ? 'Agrupar:' : 'Group by:'}
      </label>
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {groupingOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setGroupingOption(option.value)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all
              ${groupingOption === option.value
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }
            `}
            title={option.label}
          >
            {option.icon}
            <span className="hidden sm:inline">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};