import { useEffect, useState } from 'react';
import { X, Keyboard } from 'lucide-react';
import { useAppStore } from '../stores/appStore';

interface ShortcutGroup {
  title: string;
  shortcuts: Array<{
    keys: string[];
    description: string;
  }>;
}

export const KeyboardShortcutsHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useAppStore();

  // Listen for ? key to open help
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Open help with Shift+? or Ctrl+/
      if ((e.shiftKey && e.key === '?') || (e.ctrlKey && e.key === '/')) {
        e.preventDefault();
        setIsOpen(true);
      }
      // Close help with Escape
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors z-40"
        aria-label={language === 'es' ? 'Atajos de teclado' : 'Keyboard shortcuts'}
        title={language === 'es' ? 'Presiona ? para atajos' : 'Press ? for shortcuts'}
      >
        <Keyboard className="w-5 h-5" aria-hidden="true" />
      </button>
    );
  }

  const shortcutGroups: ShortcutGroup[] = [
    {
      title: language === 'es' ? 'Navegación' : 'Navigation',
      shortcuts: [
        {
          keys: ['Tab'],
          description: language === 'es' ? 'Navegar entre elementos' : 'Navigate between elements',
        },
        {
          keys: ['Shift', 'Tab'],
          description: language === 'es' ? 'Navegar hacia atrás' : 'Navigate backwards',
        },
        {
          keys: ['Enter'],
          description: language === 'es' ? 'Activar elemento enfocado' : 'Activate focused element',
        },
        {
          keys: ['Esc'],
          description: language === 'es' ? 'Cerrar diálogos' : 'Close dialogs',
        },
      ],
    },
    {
      title: language === 'es' ? 'Accesibilidad' : 'Accessibility',
      shortcuts: [
        {
          keys: ['Alt', '1'],
          description: language === 'es' ? 'Ir al contenido principal' : 'Skip to main content',
        },
        {
          keys: ['Alt', '2'],
          description: language === 'es' ? 'Ir a la barra de herramientas' : 'Skip to toolbar',
        },
      ],
    },
    {
      title: language === 'es' ? 'Vistas' : 'Views',
      shortcuts: [
        {
          keys: ['G'],
          description: language === 'es' ? 'Cambiar a vista Gantt' : 'Switch to Gantt view',
        },
        {
          keys: ['L'],
          description: language === 'es' ? 'Cambiar a vista de lista' : 'Switch to list view',
        },
      ],
    },
    {
      title: language === 'es' ? 'Ayuda' : 'Help',
      shortcuts: [
        {
          keys: ['?'],
          description: language === 'es' ? 'Mostrar esta ayuda' : 'Show this help',
        },
        {
          keys: ['Ctrl', '/'],
          description: language === 'es' ? 'Mostrar atajos' : 'Show shortcuts',
        },
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 id="shortcuts-title" className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Keyboard className="w-6 h-6" aria-hidden="true" />
            {language === 'es' ? 'Atajos de Teclado' : 'Keyboard Shortcuts'}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label={language === 'es' ? 'Cerrar' : 'Close'}
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {shortcutGroups.map((group, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {group.title}
              </h3>
              <div className="space-y-2">
                {group.shortcuts.map((shortcut, shortcutIndex) => (
                  <div
                    key={shortcutIndex}
                    className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {shortcut.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <span key={keyIndex} className="flex items-center">
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                            {key}
                          </kbd>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="mx-1 text-gray-500 dark:text-gray-400">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
