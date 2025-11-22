import React, { useMemo } from 'react';
import { useAppStore } from '../stores/appStore';
import { TrendingUp, Calendar, Clock, Users } from 'lucide-react';

interface StatCardProps {
  value: number | string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, icon, color }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white animate-fadeIn">
            {value}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {label}
          </div>
        </div>
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export const StatsGrid: React.FC = () => {
  const { filteredTasks, language } = useAppStore();
  
  const stats = useMemo(() => {
    const totalHours = filteredTasks.reduce((sum, task) => sum + task.hours, 0);
    
    // Exclude collective assignments like "All" from team member count
    // Only count individual team members, not collective/shared assignments
    const individualAssignees = filteredTasks
      .map(task => task.assignee)
      .filter(assignee => {
        // Exclude collective assignments (All, Team, Everyone, etc.)
        const collectiveTerms = ['All', 'Team', 'Everyone', 'Collective'];
        return !collectiveTerms.some(term => 
          assignee.toLowerCase().includes(term.toLowerCase())
        );
      });
    const teamMembers = new Set(individualAssignees).size;
    
    // Calculate project days (Aug 11 - Oct 31, 2025)
    const startDate = new Date('2025-08-11');
    const endDate = new Date('2025-10-31');
    const projectDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      totalTasks: filteredTasks.length,
      projectDays,
      totalHours,
      teamMembers
    };
  }, [filteredTasks]);
  
  return (
    <div
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      role="region"
      aria-label={language === 'es' ? 'Estadísticas del proyecto' : 'Project statistics'}
      aria-live="polite"
      aria-atomic="false"
    >
      <StatCard
        value={stats.totalTasks}
        label={language === 'es' ? 'Tareas Totales' : 'Total Tasks'}
        icon={<TrendingUp className="w-5 h-5" />}
        color="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
      />
      <StatCard
        value={stats.projectDays}
        label={language === 'es' ? 'Días de Proyecto' : 'Project Days'}
        icon={<Calendar className="w-5 h-5" />}
        color="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
      />
      <StatCard
        value={`${stats.totalHours}h`}
        label={language === 'es' ? 'Horas Estimadas' : 'Estimated Hours'}
        icon={<Clock className="w-5 h-5" />}
        color="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400"
      />
      <StatCard
        value={stats.teamMembers}
        label={language === 'es' ? 'Miembros del Equipo' : 'Team Members'}
        icon={<Users className="w-5 h-5" />}
        color="bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
      />
    </div>
  );
};