import { useState } from 'react';
import { Brain, ChevronDown, Sparkles, Eye, Zap, BookOpen } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { NDPreset } from '../types/ndProfile';
import { translations } from '../data/translations';

interface ProfileOption {
  id: NDPreset;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  icon: React.ReactNode;
  color: string;
}

const profileOptions: ProfileOption[] = [
  {
    id: 'default',
    name: 'Predeterminado',
    nameEn: 'Default',
    description: 'Configuración equilibrada',
    descriptionEn: 'Balanced settings',
    icon: <Brain size={18} />,
    color: 'text-slate-500',
  },
  {
    id: 'adhd',
    name: 'TDAH',
    nameEn: 'ADHD',
    description: 'Ayudas visuales, recordatorios, gamificación',
    descriptionEn: 'Visual aids, reminders, gamification',
    icon: <Zap size={18} />,
    color: 'text-amber-500',
  },
  {
    id: 'autism',
    name: 'Autismo',
    nameEn: 'Autism',
    description: 'Interfaz predecible, sin sorpresas',
    descriptionEn: 'Predictable interface, no surprises',
    icon: <Eye size={18} />,
    color: 'text-indigo-500',
  },
  {
    id: 'dyslexia',
    name: 'Dislexia',
    nameEn: 'Dyslexia',
    description: 'Fuentes amigables, más iconos',
    descriptionEn: 'Friendly fonts, more icons',
    icon: <BookOpen size={18} />,
    color: 'text-emerald-500',
  },
];

export function NDProfileSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { ndProfile, setNDProfile, language } = useAppStore();

  const currentProfile = profileOptions.find((p) => p.id === ndProfile.preset) || profileOptions[0];

  const handleSelect = (preset: NDPreset) => {
    setNDProfile(preset);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors text-sm"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={language === 'es' ? 'Seleccionar perfil ND' : 'Select ND profile'}
      >
        <span className={currentProfile.color}>{currentProfile.icon}</span>
        <span className="hidden sm:inline">
          {language === 'es' ? currentProfile.name : currentProfile.nameEn}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Menu */}
          <div
            className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 z-50 overflow-hidden"
            role="listbox"
            aria-label={language === 'es' ? 'Perfiles de neurodivergencia' : 'Neurodivergency profiles'}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-500" />
                <span className="font-medium text-sm text-gray-900 dark:text-slate-100">
                  {language === 'es' ? 'Perfil de Neurodivergencia' : 'Neurodivergency Profile'}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                {language === 'es'
                  ? 'Adapta la interfaz a tu forma de pensar'
                  : 'Adapt the interface to how you think'}
              </p>
            </div>

            {/* Options */}
            <div className="py-2">
              {profileOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors ${
                    ndProfile.preset === option.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/20'
                      : ''
                  }`}
                  role="option"
                  aria-selected={ndProfile.preset === option.id}
                >
                  <span className={`mt-0.5 ${option.color}`}>{option.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm text-gray-900 dark:text-slate-100">
                      {language === 'es' ? option.name : option.nameEn}
                      {ndProfile.preset === option.id && (
                        <span className="ml-2 text-xs text-indigo-600 dark:text-indigo-400">
                          ✓ {language === 'es' ? 'Activo' : 'Active'}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                      {language === 'es' ? option.description : option.descriptionEn}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {language === 'es'
                  ? 'Pronto: Calibración personalizada'
                  : 'Coming soon: Custom calibration'}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
