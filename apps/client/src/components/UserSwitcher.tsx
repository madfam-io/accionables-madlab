import React from 'react';
import { useAppStore } from '../stores/appStore';
import { User } from 'lucide-react';

export const UserSwitcher: React.FC = () => {
  const { currentUser, setCurrentUser, language } = useAppStore();
  
  const teamMembers = [
    'Aldo', 'Nuri', 'Luis', 'Silvia', 'Caro'
  ];
  
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
        {language === 'es' ? 'Usuario:' : 'User:'}
      </span>
      <select
        value={currentUser}
        onChange={(e) => setCurrentUser(e.target.value)}
        className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 min-w-[80px]"
      >
        {teamMembers.map(member => (
          <option key={member} value={member}>
            {member}
          </option>
        ))}
      </select>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {language === 'es' 
          ? '(cambiar para probar permisos)'
          : '(switch to test permissions)'}
      </span>
    </div>
  );
};