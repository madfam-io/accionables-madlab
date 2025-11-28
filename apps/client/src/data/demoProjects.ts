/**
 * Demo Project Templates
 *
 * Pre-configured sample projects that users can try instantly
 * to experience MADLAB's convergence-based workflow
 */

import { CulminatingEvent, EventType } from '../stores/appStore';

export interface DemoProject {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  gradient: string;
  event: CulminatingEvent;
  taskCount: number;
  daysUntilEvent: number;
  category: 'creative' | 'academic' | 'professional' | 'personal';
}

// Calculate a date N days from now
const daysFromNow = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(20, 0, 0, 0); // Default to 8 PM
  return date;
};

export const DEMO_PROJECTS: DemoProject[] = [
  {
    id: 'concert',
    name: 'Concierto de Primavera',
    nameEn: 'Spring Concert',
    description: 'Organiza un concierto indie en un venue local. 3 semanas de preparación intensa.',
    descriptionEn: 'Organize an indie concert at a local venue. 3 weeks of intense preparation.',
    icon: '🎵',
    gradient: 'from-purple-500 to-pink-500',
    event: {
      id: 'demo-concert',
      name: 'Concierto de Primavera',
      nameEn: 'Spring Concert',
      date: daysFromNow(21),
      description: 'El momento en que todo cobra sentido',
      descriptionEn: 'The moment everything comes together',
      type: 'concert' as EventType,
    },
    taskCount: 24,
    daysUntilEvent: 21,
    category: 'creative',
  },
  {
    id: 'product-launch',
    name: 'Lanzamiento de App',
    nameEn: 'App Launch',
    description: 'Lanza tu aplicación móvil al mundo. Marketing, PR, y preparación técnica.',
    descriptionEn: 'Launch your mobile app to the world. Marketing, PR, and technical prep.',
    icon: '🚀',
    gradient: 'from-blue-500 to-cyan-500',
    event: {
      id: 'demo-launch',
      name: 'Launch Day',
      nameEn: 'Launch Day',
      date: daysFromNow(14),
      description: 'Momento del lanzamiento público',
      descriptionEn: 'Public launch moment',
      type: 'launch' as EventType,
    },
    taskCount: 32,
    daysUntilEvent: 14,
    category: 'professional',
  },
  {
    id: 'final-exam',
    name: 'Examen Final',
    nameEn: 'Final Exam',
    description: 'Prepárate para tu examen final de matemáticas. Estudio estructurado sin pánico.',
    descriptionEn: 'Prepare for your final math exam. Structured study without panic.',
    icon: '📝',
    gradient: 'from-emerald-500 to-teal-500',
    event: {
      id: 'demo-exam',
      name: 'Examen Final',
      nameEn: 'Final Exam',
      date: daysFromNow(10),
      description: '3 horas que definen el semestre',
      descriptionEn: '3 hours that define the semester',
      type: 'exam' as EventType,
    },
    taskCount: 18,
    daysUntilEvent: 10,
    category: 'academic',
  },
  {
    id: 'retreat',
    name: 'Retiro de Equipo',
    nameEn: 'Team Retreat',
    description: 'Planifica un retiro de team building para 15 personas. Logística y actividades.',
    descriptionEn: 'Plan a team building retreat for 15 people. Logistics and activities.',
    icon: '🏕️',
    gradient: 'from-amber-500 to-orange-500',
    event: {
      id: 'demo-retreat',
      name: 'Retiro de Equipo',
      nameEn: 'Team Retreat',
      date: daysFromNow(28),
      description: 'Fin de semana de conexión',
      descriptionEn: 'Weekend of connection',
      type: 'retreat' as EventType,
    },
    taskCount: 28,
    daysUntilEvent: 28,
    category: 'professional',
  },
  {
    id: 'presentation',
    name: 'Pitch a Inversionistas',
    nameEn: 'Investor Pitch',
    description: 'Prepara una presentación convincente para levantar tu primera ronda.',
    descriptionEn: 'Prepare a compelling presentation to raise your first round.',
    icon: '🎤',
    gradient: 'from-red-500 to-rose-500',
    event: {
      id: 'demo-pitch',
      name: 'Demo Day',
      nameEn: 'Demo Day',
      date: daysFromNow(7),
      description: '10 minutos que pueden cambiarlo todo',
      descriptionEn: '10 minutes that could change everything',
      type: 'presentation' as EventType,
    },
    taskCount: 16,
    daysUntilEvent: 7,
    category: 'professional',
  },
  {
    id: 'wedding',
    name: 'Mi Boda',
    nameEn: 'My Wedding',
    description: 'El día más importante merece una planificación sin estrés.',
    descriptionEn: 'The most important day deserves stress-free planning.',
    icon: '💒',
    gradient: 'from-pink-500 to-fuchsia-500',
    event: {
      id: 'demo-wedding',
      name: 'El Gran Día',
      nameEn: 'The Big Day',
      date: daysFromNow(60),
      description: 'El comienzo de una nueva aventura',
      descriptionEn: 'The beginning of a new adventure',
      type: 'custom' as EventType,
    },
    taskCount: 45,
    daysUntilEvent: 60,
    category: 'personal',
  },
];

// Get demo projects by category
export const getDemoProjectsByCategory = (category: DemoProject['category']): DemoProject[] => {
  return DEMO_PROJECTS.filter(p => p.category === category);
};

// Get a specific demo project
export const getDemoProject = (id: string): DemoProject | undefined => {
  return DEMO_PROJECTS.find(p => p.id === id);
};
