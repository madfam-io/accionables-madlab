import { Task } from '../types';

export const phase5Tasks: Task[] = [
  // 5.1 Final Preparations
  {
    id: "5.1.1",
    name: "Finalizar todos los materiales",
    nameEn: "Finalize all materials",
    assignee: "Caro",
    hours: 6.0,
    difficulty: 2,
    dependencies: ["4.2.4"],
    phase: 5,
    section: "Preparaciones Finales",
    sectionEn: "Final Preparations"
  },
  {
    id: "5.1.2",
    name: "Imprimir materiales para el primer mes",
    nameEn: "Print materials for first month",
    assignee: "Caro",
    hours: 5.0,
    difficulty: 2,
    dependencies: ["5.1.1"],
    phase: 5,
    section: "Preparaciones Finales",
    sectionEn: "Final Preparations"
  },
  {
    id: "5.1.3",
    name: "Control de calidad de todo el equipo",
    nameEn: "Quality check all equipment",
    assignee: "Aldo",
    hours: 3.0,
    difficulty: 2,
    dependencies: [],
    phase: 5,
    section: "Preparaciones Finales",
    sectionEn: "Final Preparations"
  },
  {
    id: "5.1.4",
    name: "Sesión final de entrenamiento del equipo",
    nameEn: "Final team training session",
    assignee: "Luis",
    hours: 4.0,
    difficulty: 3,
    dependencies: ["4.2.5"],
    phase: 5,
    section: "Preparaciones Finales",
    sectionEn: "Final Preparations"
  },
  {
    id: "5.1.5",
    name: "Crear protocolos de emergencia",
    nameEn: "Create emergency protocols",
    assignee: "Nuri",
    hours: 3.0,
    difficulty: 3,
    dependencies: [],
    phase: 5,
    section: "Preparaciones Finales",
    sectionEn: "Final Preparations"
  },

  // 5.2 Sales Push
  {
    id: "5.2.1",
    name: "Lanzar alcance a 30 escuelas",
    nameEn: "Launch outreach to 30 schools",
    assignee: "Caro",
    hours: 10.0,
    difficulty: 4,
    dependencies: ["4.3.3"],
    phase: 5,
    section: "Impulso de Ventas",
    sectionEn: "Sales Push"
  },
  {
    id: "5.2.2",
    name: "Dar seguimiento a todos los prospectos",
    nameEn: "Follow up on all leads",
    assignee: "Caro",
    hours: 8.0,
    difficulty: 3,
    dependencies: ["5.2.1"],
    phase: 5,
    section: "Impulso de Ventas",
    sectionEn: "Sales Push"
  },
  {
    id: "5.2.3",
    name: "Cerrar primeras 5 reservas",
    nameEn: "Close first 5 bookings",
    assignee: "Caro",
    hours: 8.0,
    difficulty: 5,
    dependencies: ["5.2.2"],
    phase: 5,
    section: "Impulso de Ventas",
    sectionEn: "Sales Push"
  },
  {
    id: "5.2.4",
    name: "Procesar depósitos y contratos",
    nameEn: "Process deposits and contracts",
    assignee: "Silvia",
    hours: 4.0,
    difficulty: 3,
    dependencies: ["5.2.3"],
    phase: 5,
    section: "Impulso de Ventas",
    sectionEn: "Sales Push"
  },
  {
    id: "5.2.5",
    name: "Programar eventos de noviembre",
    nameEn: "Schedule November events",
    assignee: "Caro",
    hours: 3.0,
    difficulty: 2,
    dependencies: ["5.2.4"],
    phase: 5,
    section: "Impulso de Ventas",
    sectionEn: "Sales Push"
  },

  // 5.3 Marketing Launch
  {
    id: "5.3.1",
    name: "Lanzar campaña de redes sociales",
    nameEn: "Launch social media campaign",
    assignee: "Silvia",
    hours: 4.0,
    difficulty: 3,
    dependencies: ["4.3.4"],
    phase: 5,
    section: "Lanzamiento de Marketing",
    sectionEn: "Marketing Launch"
  },
  {
    id: "5.3.2",
    name: "Enviar comunicado de prensa a medios",
    nameEn: "Send press release to media",
    assignee: "Silvia",
    hours: 3.0,
    difficulty: 3,
    dependencies: ["4.3.3"],
    phase: 5,
    section: "Lanzamiento de Marketing",
    sectionEn: "Marketing Launch"
  },
  {
    id: "5.3.3",
    name: "Activar marketing por WhatsApp",
    nameEn: "Activate WhatsApp marketing",
    assignee: "Silvia",
    hours: 2.0,
    difficulty: 2,
    dependencies: ["4.3.5"],
    phase: 5,
    section: "Lanzamiento de Marketing",
    sectionEn: "Marketing Launch"
  },
  {
    id: "5.3.4",
    name: "Lanzar programa de referidos",
    nameEn: "Launch referral program",
    assignee: "Silvia",
    hours: 5.0,
    difficulty: 3,
    dependencies: [],
    phase: 5,
    section: "Lanzamiento de Marketing",
    sectionEn: "Marketing Launch"
  },
  {
    id: "5.3.5",
    name: "Configurar campaña de Google Ads",
    nameEn: "Set up Google Ads campaign",
    assignee: "Silvia",
    hours: 6.0,
    difficulty: 4,
    dependencies: [],
    phase: 5,
    section: "Lanzamiento de Marketing",
    sectionEn: "Marketing Launch"
  },

  // 5.4 Systems & Documentation
  {
    id: "5.4.1",
    name: "Documentar todos los procesos",
    nameEn: "Document all processes",
    assignee: "Nuri",
    hours: 8.0,
    difficulty: 3,
    dependencies: [],
    phase: 5,
    section: "Sistemas y Documentación",
    sectionEn: "Systems & Documentation"
  },
  {
    id: "5.4.2",
    name: "Crear manual de operaciones",
    nameEn: "Create operations manual",
    assignee: "Luis",
    hours: 6.0,
    difficulty: 3,
    dependencies: ["5.4.1"],
    phase: 5,
    section: "Sistemas y Documentación",
    sectionEn: "Systems & Documentation"
  },
  {
    id: "5.4.3",
    name: "Configurar tableros de datos",
    nameEn: "Set up data dashboards",
    assignee: "Aldo",
    hours: 6.0,
    difficulty: 4,
    dependencies: ["4.4.5"],
    phase: 5,
    section: "Sistemas y Documentación",
    sectionEn: "Systems & Documentation"
  },
  {
    id: "5.4.4",
    name: "Crear sistema de seguimiento financiero",
    nameEn: "Create financial tracking system",
    assignee: "Aldo",
    hours: 5.0,
    difficulty: 3,
    dependencies: ["5.4.3"],
    phase: 5,
    section: "Sistemas y Documentación",
    sectionEn: "Systems & Documentation"
  },
  {
    id: "5.4.5",
    name: "Verificación final de sistemas",
    nameEn: "Final systems check",
    assignee: "Aldo",
    hours: 3.0,
    difficulty: 3,
    dependencies: [],
    phase: 5,
    section: "Sistemas y Documentación",
    sectionEn: "Systems & Documentation"
  },

  // 5.5 Launch Event
  {
    id: "5.5.1",
    name: "Preparar materiales del día de lanzamiento",
    nameEn: "Prepare launch day materials",
    assignee: "Luis",
    hours: 3.0,
    difficulty: 2,
    dependencies: ["5.1.2"],
    phase: 5,
    section: "Evento de Lanzamiento",
    sectionEn: "Launch Event"
  },
  {
    id: "5.5.2",
    name: "Reunión informativa y motivación del equipo",
    nameEn: "Team briefing and motivation",
    assignee: "Nuri",
    hours: 1.0,
    difficulty: 2,
    dependencies: [],
    phase: 5,
    section: "Evento de Lanzamiento",
    sectionEn: "Launch Event"
  },
  {
    id: "5.5.3",
    name: "Ejecutar primer evento oficial",
    nameEn: "Execute first official event",
    assignee: "Luis",
    hours: 3.0,
    difficulty: 5,
    dependencies: ["5.5.1", "5.5.2"],
    phase: 5,
    section: "Evento de Lanzamiento",
    sectionEn: "Launch Event"
  },
  {
    id: "5.5.4",
    name: "Documentar éxito del lanzamiento",
    nameEn: "Document launch success",
    assignee: "Silvia",
    hours: 2.0,
    difficulty: 2,
    dependencies: ["5.5.3"],
    phase: 5,
    section: "Evento de Lanzamiento",
    sectionEn: "Launch Event"
  },
  {
    id: "5.5.5",
    name: "Celebrar y hacer informe",
    nameEn: "Celebrate and debrief",
    assignee: "All",
    hours: 2.0,
    difficulty: 1,
    dependencies: ["5.5.3"],
    phase: 5,
    section: "Evento de Lanzamiento",
    sectionEn: "Launch Event"
  }
];
