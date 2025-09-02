import { PhaseInfo } from './types';

export const projectPhases: PhaseInfo[] = [
  {
    number: 1,
    title: {
      es: "Fase 1: Fundación",
      en: "Phase 1: Foundation"
    },
    dateRange: "Aug 11 - Sep 5, 2025",
    taskCount: 25
  },
  {
    number: 2,
    title: {
      es: "Fase 2: Desarrollo de Contenido",
      en: "Phase 2: Content Development"
    },
    dateRange: "Sep 6-25, 2025",
    taskCount: 25
  },
  {
    number: 3,
    title: {
      es: "Fase 3: Preparación del Piloto",
      en: "Phase 3: Pilot Preparation"
    },
    dateRange: "Sep 26 - Oct 5, 2025",
    taskCount: 15
  },
  {
    number: 4,
    title: {
      es: "Fase 4: Piloto e Iteración",
      en: "Phase 4: Pilot & Iteration"
    },
    dateRange: "Oct 6-20, 2025",
    taskCount: 20
  },
  {
    number: 5,
    title: {
      es: "Fase 5: Listos para el Lanzamiento",
      en: "Phase 5: Launch Ready"
    },
    dateRange: "Oct 21-31, 2025",
    taskCount: 24
  }
];

export const getPhaseTitle = (phase: number, language: 'es' | 'en'): string => {
  const phaseInfo = projectPhases.find(p => p.number === phase);
  if (!phaseInfo) return '';
  return `${phaseInfo.title[language]} (${phaseInfo.dateRange})`;
};