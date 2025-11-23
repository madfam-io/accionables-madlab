import { Task } from '../types';

export const phase4Tasks: Task[] = [
  // 4.1 Pilot Execution
  {
    id: "4.1.1",
    name: "Configurar lugar del piloto",
    nameEn: "Set up pilot venue",
    assignee: "Aldo",
    hours: 2.0,
    difficulty: 2,
    dependencies: ["3.2.4"],
    phase: 4,
    section: "Ejecución del Piloto",
    sectionEn: "Pilot Execution"
  },
  {
    id: "4.1.2",
    name: "Realizar evento piloto",
    nameEn: "Conduct pilot event",
    assignee: "Luis",
    hours: 3.0,
    difficulty: 4,
    dependencies: ["4.1.1"],
    phase: 4,
    section: "Ejecución del Piloto",
    sectionEn: "Pilot Execution"
  },
  {
    id: "4.1.3",
    name: "Recopilar retroalimentación en tiempo real",
    nameEn: "Collect real-time feedback",
    assignee: "Nuri",
    hours: 3.0,
    difficulty: 3,
    dependencies: ["4.1.2"],
    phase: 4,
    section: "Ejecución del Piloto",
    sectionEn: "Pilot Execution"
  },
  {
    id: "4.1.4",
    name: "Documentar piloto con fotos/video",
    nameEn: "Document pilot with photos/video",
    assignee: "Silvia",
    hours: 3.0,
    difficulty: 2,
    dependencies: ["4.1.2"],
    phase: 4,
    section: "Ejecución del Piloto",
    sectionEn: "Pilot Execution"
  },
  {
    id: "4.1.5",
    name: "Informe con escuela piloto",
    nameEn: "Debrief with pilot school",
    assignee: "Caro",
    hours: 2.0,
    difficulty: 3,
    dependencies: ["4.1.2"],
    phase: 4,
    section: "Ejecución del Piloto",
    sectionEn: "Pilot Execution"
  },

  // 4.2 Analysis & Iteration
  {
    id: "4.2.1",
    name: "Analizar datos y retroalimentación del piloto",
    nameEn: "Analyze pilot data and feedback",
    assignee: "Aldo",
    hours: 5.0,
    difficulty: 3,
    dependencies: ["4.1.3", "4.1.5"],
    phase: 4,
    section: "Análisis e Iteración",
    sectionEn: "Analysis & Iteration"
  },
  {
    id: "4.2.2",
    name: "Reunión retrospectiva del equipo",
    nameEn: "Team retrospective meeting",
    assignee: "Nuri",
    hours: 3.0,
    difficulty: 2,
    dependencies: ["4.2.1"],
    phase: 4,
    section: "Análisis e Iteración",
    sectionEn: "Analysis & Iteration"
  },
  {
    id: "4.2.3",
    name: "Identificar las 5 mejoras principales",
    nameEn: "Identify top 5 improvements",
    assignee: "Luis",
    hours: 4.0,
    difficulty: 3,
    dependencies: ["4.2.2"],
    phase: 4,
    section: "Análisis e Iteración",
    sectionEn: "Analysis & Iteration"
  },
  {
    id: "4.2.4",
    name: "Actualizar materiales basados en retroalimentación",
    nameEn: "Update materials based on feedback",
    assignee: "Caro",
    hours: 8.0,
    difficulty: 3,
    dependencies: ["4.2.3"],
    phase: 4,
    section: "Análisis e Iteración",
    sectionEn: "Analysis & Iteration"
  },
  {
    id: "4.2.5",
    name: "Refinar guía del facilitador",
    nameEn: "Refine facilitator guide",
    assignee: "Luis",
    hours: 5.0,
    difficulty: 3,
    dependencies: ["4.2.3"],
    phase: 4,
    section: "Análisis e Iteración",
    sectionEn: "Analysis & Iteration"
  },

  // 4.3 Marketing Content Creation
  {
    id: "4.3.1",
    name: "Editar video del piloto para marketing",
    nameEn: "Edit pilot video for marketing",
    assignee: "Silvia",
    hours: 8.0,
    difficulty: 3,
    dependencies: ["4.1.4"],
    phase: 4,
    section: "Creación de Contenido de Marketing",
    sectionEn: "Marketing Content Creation"
  },
  {
    id: "4.3.2",
    name: "Crear gráficos de testimonios",
    nameEn: "Create testimonial graphics",
    assignee: "Silvia",
    hours: 4.0,
    difficulty: 2,
    dependencies: ["4.1.5"],
    phase: 4,
    section: "Creación de Contenido de Marketing",
    sectionEn: "Marketing Content Creation"
  },
  {
    id: "4.3.3",
    name: "Escribir caso de estudio del piloto",
    nameEn: "Write case study from pilot",
    assignee: "Silvia",
    hours: 5.0,
    difficulty: 3,
    dependencies: ["4.2.1"],
    phase: 4,
    section: "Creación de Contenido de Marketing",
    sectionEn: "Marketing Content Creation"
  },
  {
    id: "4.3.4",
    name: "Diseñar campaña de redes sociales",
    nameEn: "Design social media campaign",
    assignee: "Silvia",
    hours: 6.0,
    difficulty: 3,
    dependencies: ["4.3.1", "4.3.2"],
    phase: 4,
    section: "Creación de Contenido de Marketing",
    sectionEn: "Marketing Content Creation"
  },
  {
    id: "4.3.5",
    name: "Crear plantillas de WhatsApp Business para ventas",
    nameEn: "Create WhatsApp Business templates for sales",
    assignee: "Silvia",
    hours: 3.0,
    difficulty: 2,
    dependencies: ["4.3.4"],
    phase: 4,
    section: "Creación de Contenido de Marketing",
    sectionEn: "Marketing Content Creation"
  },

  // 4.4 Operations Refinement
  {
    id: "4.4.1",
    name: "Optimizar proceso de configuración de equipos",
    nameEn: "Optimize equipment setup process",
    assignee: "Aldo",
    hours: 4.0,
    difficulty: 3,
    dependencies: ["4.2.3"],
    phase: 4,
    section: "Refinamiento de Operaciones",
    sectionEn: "Operations Refinement"
  },
  {
    id: "4.4.2",
    name: "Crear lista de verificación de logística",
    nameEn: "Create logistics checklist",
    assignee: "Aldo",
    hours: 2.0,
    difficulty: 2,
    dependencies: ["4.4.1"],
    phase: 4,
    section: "Refinamiento de Operaciones",
    sectionEn: "Operations Refinement"
  },
  {
    id: "4.4.3",
    name: "Diseñar sistema de reserva/pago",
    nameEn: "Design booking/payment system",
    assignee: "Aldo",
    hours: 6.0,
    difficulty: 4,
    dependencies: [],
    phase: 4,
    section: "Refinamiento de Operaciones",
    sectionEn: "Operations Refinement"
  },
  {
    id: "4.4.4",
    name: "Configurar CRM para escuelas",
    nameEn: "Set up CRM for schools",
    assignee: "Silvia",
    hours: 5.0,
    difficulty: 3,
    dependencies: ["4.4.3"],
    phase: 4,
    section: "Refinamiento de Operaciones",
    sectionEn: "Operations Refinement"
  },
  {
    id: "4.4.5",
    name: "Crear sistema de encuesta post-evento",
    nameEn: "Create post-event survey system",
    assignee: "Nuri",
    hours: 4.0,
    difficulty: 3,
    dependencies: [],
    phase: 4,
    section: "Refinamiento de Operaciones",
    sectionEn: "Operations Refinement"
  },
];
