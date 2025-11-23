// Complete MADLAB project data - all 109 tasks

export interface Task {
  id: string;
  name: string;
  nameEn: string;
  assignee: string;
  hours: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  dependencies: string[];
  phase: number;
  section: string;
  sectionEn: string;
}

export interface TeamMember {
  name: string;
  role: string;
  roleEn: string;
  hours: number;
  tasks: number;
}

export const projectPhases = {
  1: {
    es: "Fase 1: Fundación (11 Ago - 5 Sep, 2025)",
    en: "Phase 1: Foundation (Aug 11 - Sep 5, 2025)"
  },
  2: {
    es: "Fase 2: Desarrollo de Contenido (6-25 Sep, 2025)",
    en: "Phase 2: Content Development (Sep 6-25, 2025)"
  },
  3: {
    es: "Fase 3: Preparación del Piloto (26 Sep - 5 Oct, 2025)",
    en: "Phase 3: Pilot Preparation (Sep 26 - Oct 5, 2025)"
  },
  4: {
    es: "Fase 4: Piloto e Iteración (6-20 Oct, 2025)",
    en: "Phase 4: Pilot & Iteration (Oct 6-20, 2025)"
  },
  5: {
    es: "Fase 5: Listos para el Lanzamiento (21-31 Oct, 2025)",
    en: "Phase 5: Launch Ready (Oct 21-31, 2025)"
  }
};

export const teamMembers: TeamMember[] = [
  {
    name: "Aldo",
    role: "CEO MADFAM, Tech Lead",
    roleEn: "CEO MADFAM, Tech Lead",
    hours: 116.5,
    tasks: 24
  },
  {
    name: "Nuri",
    role: "Strategy Officer MADFAM",
    roleEn: "Strategy Officer MADFAM",
    hours: 86.5,
    tasks: 19
  },
  {
    name: "Luis",
    role: "Rep. La Ciencia del Juego",
    roleEn: "Rep. La Ciencia del Juego",
    hours: 102,
    tasks: 20
  },
  {
    name: "Silvia",
    role: "Marketing Guru",
    roleEn: "Marketing Guru",
    hours: 115.5,
    tasks: 23
  },
  {
    name: "Caro",
    role: "Diseñadora y Docente",
    roleEn: "Designer and Teacher",
    hours: 102,
    tasks: 22
  }
];

// Complete list of all 109 tasks
export const tasks: Task[] = [
  // Phase 1: Foundation (25 tasks)
  // 1.1 Project Infrastructure Setup
  {
    id: "1.1.1",
    name: "Configurar LeanTime (equipo completo) y AnyType (C-Suite)",
    nameEn: "Set up LeanTime (full team) and AnyType (C-Suite)",
    assignee: "Aldo",
    hours: 2.0,
    difficulty: 2,
    dependencies: [],
    phase: 1,
    section: "Configuración de Infraestructura del Proyecto",
    sectionEn: "Project Infrastructure Setup"
  },
  {
    id: "1.1.2",
    name: "Crear Google Drive compartido y espacio de Canva con estructura",
    nameEn: "Create shared Google Drive and Canva workspace with structure",
    assignee: "Aldo",
    hours: 1.0,
    difficulty: 1,
    dependencies: [],
    phase: 1,
    section: "Configuración de Infraestructura del Proyecto",
    sectionEn: "Project Infrastructure Setup"
  },
  {
    id: "1.1.3",
    name: "Configurar grupo de WhatsApp para comunicación del equipo",
    nameEn: "Set up WhatsApp group for team communication",
    assignee: "Aldo",
    hours: 1.5,
    difficulty: 2,
    dependencies: [],
    phase: 1,
    section: "Configuración de Infraestructura del Proyecto",
    sectionEn: "Project Infrastructure Setup"
  },
  {
    id: "1.1.4",
    name: "Diseñar plantillas de recolección de datos para BI",
    nameEn: "Design data collection templates for BI",
    assignee: "Aldo",
    hours: 4.0,
    difficulty: 3,
    dependencies: ["1.1.1"],
    phase: 1,
    section: "Configuración de Infraestructura del Proyecto",
    sectionEn: "Project Infrastructure Setup"
  },
  {
    id: "1.1.5",
    name: "Crear documento de protocolos de colaboración del equipo",
    nameEn: "Create team collaboration protocols document",
    assignee: "Nuri",
    hours: 3.0,
    difficulty: 2,
    dependencies: ["1.1.3"],
    phase: 1,
    section: "Configuración de Infraestructura del Proyecto",
    sectionEn: "Project Infrastructure Setup"
  },

  // 1.2 Market Research & Analysis
  {
    id: "1.2.1",
    name: "Investigar ofertas de competidores en EdTech México",
    nameEn: "Research competitor offerings in EdTech Mexico",
    assignee: "Silvia",
    hours: 8.0,
    difficulty: 3,
    dependencies: [],
    phase: 1,
    section: "Investigación y Análisis de Mercado",
    sectionEn: "Market Research & Analysis"
  },
  {
    id: "1.2.2",
    name: "Analizar modelos de precios para programas escolares",
    nameEn: "Analyze pricing models for school programs",
    assignee: "Silvia",
    hours: 5.0,
    difficulty: 3,
    dependencies: ["1.2.1"],
    phase: 1,
    section: "Investigación y Análisis de Mercado",
    sectionEn: "Market Research & Analysis"
  },
  {
    id: "1.2.3",
    name: "Identificar las 50 mejores escuelas objetivo en la región",
    nameEn: "Identify top 50 target schools in region",
    assignee: "Caro",
    hours: 6.0,
    difficulty: 2,
    dependencies: [],
    phase: 1,
    section: "Investigación y Análisis de Mercado",
    sectionEn: "Market Research & Analysis"
  },
  {
    id: "1.2.4",
    name: "Mapear procesos de toma de decisiones escolares",
    nameEn: "Map school decision-making processes",
    assignee: "Caro",
    hours: 4.0,
    difficulty: 3,
    dependencies: ["1.2.3"],
    phase: 1,
    section: "Investigación y Análisis de Mercado",
    sectionEn: "Market Research & Analysis"
  },
  {
    id: "1.2.5",
    name: "Investigar oportunidades de subvenciones y patrocinadores",
    nameEn: "Research grant opportunities and sponsors",
    assignee: "Silvia",
    hours: 7.0,
    difficulty: 4,
    dependencies: [],
    phase: 1,
    section: "Investigación y Análisis de Mercado",
    sectionEn: "Market Research & Analysis"
  },

  // 1.3 Educational Framework Development
  {
    id: "1.3.1",
    name: "Mapear estándares curriculares de la SEP para grados objetivo",
    nameEn: "Map SEP curriculum standards for target grades",
    assignee: "Caro",
    hours: 6.0,
    difficulty: 3,
    dependencies: [],
    phase: 1,
    section: "Desarrollo del Marco Educativo",
    sectionEn: "Educational Framework Development"
  },
  {
    id: "1.3.2",
    name: "Investigar rutas de certificación CONOCER",
    nameEn: "Research CONOCER certification pathways",
    assignee: "Nuri",
    hours: 8.0,
    difficulty: 4,
    dependencies: [],
    phase: 1,
    section: "Desarrollo del Marco Educativo",
    sectionEn: "Educational Framework Development"
  },
  {
    id: "1.3.3",
    name: "Definir objetivos de aprendizaje por enfoque ODS",
    nameEn: "Define learning objectives per SDG focus",
    assignee: "Nuri",
    hours: 6.0,
    difficulty: 3,
    dependencies: ["1.3.1"],
    phase: 1,
    section: "Desarrollo del Marco Educativo",
    sectionEn: "Educational Framework Development"
  },
  {
    id: "1.3.4",
    name: "Crear marco de metodología de evaluación",
    nameEn: "Create assessment methodology framework",
    assignee: "Nuri",
    hours: 5.0,
    difficulty: 4,
    dependencies: ["1.3.3"],
    phase: 1,
    section: "Desarrollo del Marco Educativo",
    sectionEn: "Educational Framework Development"
  },
  {
    id: "1.3.5",
    name: "Diseñar herramientas de evaluación pre/post",
    nameEn: "Design pre/post evaluation tools",
    assignee: "Luis",
    hours: 4.0,
    difficulty: 3,
    dependencies: ["1.3.4"],
    phase: 1,
    section: "Desarrollo del Marco Educativo",
    sectionEn: "Educational Framework Development"
  },

  // 1.4 Technical Requirements & Budget Planning
  {
    id: "1.4.1",
    name: "Listar todo el equipo técnico necesario",
    nameEn: "List all technical equipment needed",
    assignee: "Aldo",
    hours: 3.0,
    difficulty: 2,
    dependencies: [],
    phase: 1,
    section: "Requisitos Técnicos y Planificación Presupuestaria",
    sectionEn: "Technical Requirements & Budget Planning"
  },
  {
    id: "1.4.2",
    name: "Investigar proveedores de equipos y costos",
    nameEn: "Research equipment suppliers and costs",
    assignee: "Aldo",
    hours: 4.0,
    difficulty: 2,
    dependencies: ["1.4.1"],
    phase: 1,
    section: "Requisitos Técnicos y Planificación Presupuestaria",
    sectionEn: "Technical Requirements & Budget Planning"
  },
  {
    id: "1.4.3",
    name: "Crear escenarios de presupuesto modular",
    nameEn: "Create modular budget scenarios",
    assignee: "Silvia",
    hours: 5.0,
    difficulty: 3,
    dependencies: ["1.4.2"],
    phase: 1,
    section: "Requisitos Técnicos y Planificación Presupuestaria",
    sectionEn: "Technical Requirements & Budget Planning"
  },
  {
    id: "1.4.4",
    name: "Diseñar estructura de precios para escuelas",
    nameEn: "Design pricing structure for schools",
    assignee: "Silvia",
    hours: 4.0,
    difficulty: 4,
    dependencies: ["1.4.3"],
    phase: 1,
    section: "Requisitos Técnicos y Planificación Presupuestaria",
    sectionEn: "Technical Requirements & Budget Planning"
  },
  {
    id: "1.4.5",
    name: "Calcular análisis de punto de equilibrio",
    nameEn: "Calculate break-even analysis",
    assignee: "Aldo",
    hours: 3.0,
    difficulty: 3,
    dependencies: ["1.4.4"],
    phase: 1,
    section: "Requisitos Técnicos y Planificación Presupuestaria",
    sectionEn: "Technical Requirements & Budget Planning"
  },

  // 1.5 Initial Brand & Marketing Assets
  {
    id: "1.5.1",
    name: "Desarrollar guía de identidad de marca MADLAB",
    nameEn: "Develop MADLAB brand identity guide",
    assignee: "Silvia",
    hours: 8.0,
    difficulty: 3,
    dependencies: [],
    phase: 1,
    section: "Activos Iniciales de Marca y Marketing",
    sectionEn: "Initial Brand & Marketing Assets"
  },
  {
    id: "1.5.2",
    name: "Crear logo y activos visuales",
    nameEn: "Create logo and visual assets",
    assignee: "Caro",
    hours: 8.0,
    difficulty: 3,
    dependencies: ["1.5.1"],
    phase: 1,
    section: "Activos Iniciales de Marca y Marketing",
    sectionEn: "Initial Brand & Marketing Assets"
  },
  {
    id: "1.5.3",
    name: "Escribir elevator pitch y propuesta de valor",
    nameEn: "Write elevator pitch and value proposition",
    assignee: "Silvia",
    hours: 4.0,
    difficulty: 3,
    dependencies: [],
    phase: 1,
    section: "Activos Iniciales de Marca y Marketing",
    sectionEn: "Initial Brand & Marketing Assets"
  },
  {
    id: "1.5.4",
    name: "Diseñar plantilla de presentación",
    nameEn: "Design presentation template",
    assignee: "Caro",
    hours: 3.0,
    difficulty: 2,
    dependencies: ["1.5.2"],
    phase: 1,
    section: "Activos Iniciales de Marca y Marketing",
    sectionEn: "Initial Brand & Marketing Assets"
  },
  {
    id: "1.5.5",
    name: "Crear one-pager para escuelas",
    nameEn: "Create one-pager for schools",
    assignee: "Silvia",
    hours: 4.0,
    difficulty: 3,
    dependencies: ["1.5.3"],
    phase: 1,
    section: "Activos Iniciales de Marca y Marketing",
    sectionEn: "Initial Brand & Marketing Assets"
  },

  // Phase 2: Content Development (25 tasks)
  // 2.1 Curriculum Design - Clean Water Module
  {
    id: "2.1.1",
    name: "Investigar experimentos de purificación de agua",
    nameEn: "Research water purification experiments",
    assignee: "Nuri",
    hours: 6.0,
    difficulty: 3,
    dependencies: ["1.3.3"],
    phase: 2,
    section: "Diseño Curricular - Módulo de Agua Limpia",
    sectionEn: "Curriculum Design - Clean Water Module"
  },
  {
    id: "2.1.2",
    name: "Diseñar actividad gamificada del ciclo del agua",
    nameEn: "Design gamified water cycle activity",
    assignee: "Luis",
    hours: 5.0,
    difficulty: 3,
    dependencies: ["2.1.1"],
    phase: 2,
    section: "Diseño Curricular - Módulo de Agua Limpia",
    sectionEn: "Curriculum Design - Clean Water Module"
  },
  {
    id: "2.1.3",
    name: "Crear especificaciones del kit de prueba de agua",
    nameEn: "Create water testing kit specifications",
    assignee: "Aldo",
    hours: 4.0,
    difficulty: 3,
    dependencies: ["2.1.1"],
    phase: 2,
    section: "Diseño Curricular - Módulo de Agua Limpia",
    sectionEn: "Curriculum Design - Clean Water Module"
  },
  {
    id: "2.1.4",
    name: "Desarrollar diapositivas de presentación - agua",
    nameEn: "Develop presentation slides - water",
    assignee: "Caro",
    hours: 5.0,
    difficulty: 2,
    dependencies: ["2.1.2"],
    phase: 2,
    section: "Diseño Curricular - Módulo de Agua Limpia",
    sectionEn: "Curriculum Design - Clean Water Module"
  },
  {
    id: "2.1.5",
    name: "Crear cuaderno de trabajo del estudiante - agua",
    nameEn: "Create student workbook - water",
    assignee: "Caro",
    hours: 6.0,
    difficulty: 3,
    dependencies: ["2.1.4"],
    phase: 2,
    section: "Diseño Curricular - Módulo de Agua Limpia",
    sectionEn: "Curriculum Design - Clean Water Module"
  },

  // 2.2 Curriculum Design - Clean Energy Module
  {
    id: "2.2.1",
    name: "Diseñar demostración de panel solar",
    nameEn: "Design solar panel demonstration",
    assignee: "Nuri",
    hours: 5.0,
    difficulty: 3,
    dependencies: ["1.3.3"],
    phase: 2,
    section: "Diseño Curricular - Módulo de Energía Limpia",
    sectionEn: "Curriculum Design - Clean Energy Module"
  },
  {
    id: "2.2.2",
    name: "Crear juego de conservación de energía",
    nameEn: "Create energy conservation game",
    assignee: "Luis",
    hours: 6.0,
    difficulty: 4,
    dependencies: ["2.2.1"],
    phase: 2,
    section: "Diseño Curricular - Módulo de Energía Limpia",
    sectionEn: "Curriculum Design - Clean Energy Module"
  },
  {
    id: "2.2.3",
    name: "Construir prototipo de mini turbina eólica",
    nameEn: "Build mini wind turbine prototype",
    assignee: "Aldo",
    hours: 8.0,
    difficulty: 4,
    dependencies: [],
    phase: 2,
    section: "Diseño Curricular - Módulo de Energía Limpia",
    sectionEn: "Curriculum Design - Clean Energy Module"
  },
  {
    id: "2.2.4",
    name: "Desarrollar diapositivas de presentación - energía",
    nameEn: "Develop presentation slides - energy",
    assignee: "Caro",
    hours: 5.0,
    difficulty: 2,
    dependencies: ["2.2.2"],
    phase: 2,
    section: "Diseño Curricular - Módulo de Energía Limpia",
    sectionEn: "Curriculum Design - Clean Energy Module"
  },
  {
    id: "2.2.5",
    name: "Crear cuaderno de trabajo del estudiante - energía",
    nameEn: "Create student workbook - energy",
    assignee: "Caro",
    hours: 6.0,
    difficulty: 3,
    dependencies: ["2.2.4"],
    phase: 2,
    section: "Diseño Curricular - Módulo de Energía Limpia",
    sectionEn: "Curriculum Design - Clean Energy Module"
  },

  // 2.3 Curriculum Design - Recycling Module
  {
    id: "2.3.1",
    name: "Diseñar mecánicas del juego de clasificación",
    nameEn: "Design sorting game mechanics",
    assignee: "Luis",
    hours: 5.0,
    difficulty: 3,
    dependencies: ["1.3.3"],
    phase: 2,
    section: "Diseño Curricular - Módulo de Reciclaje",
    sectionEn: "Curriculum Design - Recycling Module"
  },
  {
    id: "2.3.2",
    name: "Crear actividades de manualidades con reciclaje",
    nameEn: "Create upcycling craft activities",
    assignee: "Nuri",
    hours: 4.0,
    difficulty: 2,
    dependencies: ["2.3.1"],
    phase: 2,
    section: "Diseño Curricular - Módulo de Reciclaje",
    sectionEn: "Curriculum Design - Recycling Module"
  },
  {
    id: "2.3.3",
    name: "Desarrollar visuales del proceso de reciclaje",
    nameEn: "Develop recycling process visuals",
    assignee: "Caro",
    hours: 4.0,
    difficulty: 2,
    dependencies: [],
    phase: 2,
    section: "Diseño Curricular - Módulo de Reciclaje",
    sectionEn: "Curriculum Design - Recycling Module"
  },
  {
    id: "2.3.4",
    name: "Crear diapositivas de presentación - reciclaje",
    nameEn: "Create presentation slides - recycling",
    assignee: "Caro",
    hours: 5.0,
    difficulty: 2,
    dependencies: ["2.3.2"],
    phase: 2,
    section: "Diseño Curricular - Módulo de Reciclaje",
    sectionEn: "Curriculum Design - Recycling Module"
  },
  {
    id: "2.3.5",
    name: "Crear cuaderno de trabajo del estudiante - reciclaje",
    nameEn: "Create student workbook - recycling",
    assignee: "Caro",
    hours: 6.0,
    difficulty: 3,
    dependencies: ["2.3.4"],
    phase: 2,
    section: "Diseño Curricular - Módulo de Reciclaje",
    sectionEn: "Curriculum Design - Recycling Module"
  },

  // 2.4 Technology Integration
  {
    id: "2.4.1",
    name: "Programar demostraciones interactivas",
    nameEn: "Program interactive demonstrations",
    assignee: "Aldo",
    hours: 10.0,
    difficulty: 4,
    dependencies: ["2.1.1", "2.2.1", "2.3.1"],
    phase: 2,
    section: "Integración Tecnológica",
    sectionEn: "Technology Integration"
  },
  {
    id: "2.4.2",
    name: "Crear bucles visuales de fondo",
    nameEn: "Create background visual loops",
    assignee: "Aldo",
    hours: 6.0,
    difficulty: 3,
    dependencies: ["2.4.1"],
    phase: 2,
    section: "Integración Tecnológica",
    sectionEn: "Technology Integration"
  },
  {
    id: "2.4.3",
    name: "Configurar sistema de recolección de datos",
    nameEn: "Set up data collection system",
    assignee: "Aldo",
    hours: 5.0,
    difficulty: 3,
    dependencies: [],
    phase: 2,
    section: "Integración Tecnológica",
    sectionEn: "Technology Integration"
  },
  {
    id: "2.4.4",
    name: "Probar todos los componentes tecnológicos juntos",
    nameEn: "Test all tech components together",
    assignee: "Aldo",
    hours: 4.0,
    difficulty: 3,
    dependencies: ["2.4.1", "2.4.2", "2.4.3"],
    phase: 2,
    section: "Integración Tecnológica",
    sectionEn: "Technology Integration"
  },
  {
    id: "2.4.5",
    name: "Crear guía de solución de problemas",
    nameEn: "Create troubleshooting guide",
    assignee: "Aldo",
    hours: 3.0,
    difficulty: 2,
    dependencies: ["2.4.4"],
    phase: 2,
    section: "Integración Tecnológica",
    sectionEn: "Technology Integration"
  },

  // 2.5 Facilitator Training Materials
  {
    id: "2.5.1",
    name: "Escribir guía del facilitador",
    nameEn: "Write facilitator guide",
    assignee: "Luis",
    hours: 8.0,
    difficulty: 3,
    dependencies: ["2.1.5", "2.2.5", "2.3.5"],
    phase: 2,
    section: "Materiales de Capacitación para Facilitadores",
    sectionEn: "Facilitator Training Materials"
  },
  {
    id: "2.5.2",
    name: "Crear diagramas de tiempo y flujo",
    nameEn: "Create timing and flow charts",
    assignee: "Nuri",
    hours: 4.0,
    difficulty: 2,
    dependencies: ["2.5.1"],
    phase: 2,
    section: "Materiales de Capacitación para Facilitadores",
    sectionEn: "Facilitator Training Materials"
  },
  {
    id: "2.5.3",
    name: "Diseñar protocolos de emergencia",
    nameEn: "Design emergency protocols",
    assignee: "Nuri",
    hours: 3.0,
    difficulty: 3,
    dependencies: [],
    phase: 2,
    section: "Materiales de Capacitación para Facilitadores",
    sectionEn: "Facilitator Training Materials"
  },
  {
    id: "2.5.4",
    name: "Grabar videos de capacitación",
    nameEn: "Record training videos",
    assignee: "Luis",
    hours: 6.0,
    difficulty: 3,
    dependencies: ["2.5.1", "2.5.2"],
    phase: 2,
    section: "Materiales de Capacitación para Facilitadores",
    sectionEn: "Facilitator Training Materials"
  },
  {
    id: "2.5.5",
    name: "Crear rúbricas de evaluación",
    nameEn: "Create evaluation rubrics",
    assignee: "Caro",
    hours: 3.0,
    difficulty: 2,
    dependencies: ["1.3.5"],
    phase: 2,
    section: "Materiales de Capacitación para Facilitadores",
    sectionEn: "Facilitator Training Materials"
  },

  // Phase 3: Pilot Preparation (15 tasks)
  // 3.1 Sales & Outreach
  {
    id: "3.1.1",
    name: "Finalizar presentación de ventas",
    nameEn: "Finalize sales deck",
    assignee: "Silvia",
    hours: 6.0,
    difficulty: 3,
    dependencies: ["1.5.5", "2.5.1"],
    phase: 3,
    section: "Ventas y Alcance",
    sectionEn: "Sales & Outreach"
  },
  {
    id: "3.1.2",
    name: "Crear plantillas de correo electrónico de alcance",
    nameEn: "Create email outreach templates",
    assignee: "Silvia",
    hours: 3.0,
    difficulty: 2,
    dependencies: ["3.1.1"],
    phase: 3,
    section: "Ventas y Alcance",
    sectionEn: "Sales & Outreach"
  },
  {
    id: "3.1.3",
    name: "Calentar 10 contactos escolares",
    nameEn: "Warm up 10 school contacts",
    assignee: "Caro",
    hours: 8.0,
    difficulty: 3,
    dependencies: ["3.1.2"],
    phase: 3,
    section: "Ventas y Alcance",
    sectionEn: "Sales & Outreach"
  },
  {
    id: "3.1.4",
    name: "Programar reuniones con escuelas piloto",
    nameEn: "Schedule pilot school meetings",
    assignee: "Caro",
    hours: 4.0,
    difficulty: 3,
    dependencies: ["3.1.3"],
    phase: 3,
    section: "Ventas y Alcance",
    sectionEn: "Sales & Outreach"
  },
  {
    id: "3.1.5",
    name: "Asegurar compromiso de escuela piloto",
    nameEn: "Secure pilot school commitment",
    assignee: "Caro",
    hours: 5.0,
    difficulty: 4,
    dependencies: ["3.1.4"],
    phase: 3,
    section: "Ventas y Alcance",
    sectionEn: "Sales & Outreach"
  },

  // 3.2 Material Preparation
  {
    id: "3.2.1",
    name: "Imprimir todos los materiales para estudiantes",
    nameEn: "Print all student materials",
    assignee: "Caro",
    hours: 4.0,
    difficulty: 1,
    dependencies: ["2.1.5", "2.2.5", "2.3.5"],
    phase: 3,
    section: "Preparación de Materiales",
    sectionEn: "Material Preparation"
  },
  {
    id: "3.2.2",
    name: "Comprar/alquilar equipos para piloto",
    nameEn: "Purchase/rent equipment for pilot",
    assignee: "Aldo",
    hours: 5.0,
    difficulty: 3,
    dependencies: ["1.4.2"],
    phase: 3,
    section: "Preparación de Materiales",
    sectionEn: "Material Preparation"
  },
  {
    id: "3.2.3",
    name: "Preparar kits de materiales",
    nameEn: "Prepare material kits",
    assignee: "Luis",
    hours: 4.0,
    difficulty: 2,
    dependencies: ["3.2.1", "3.2.2"],
    phase: 3,
    section: "Preparación de Materiales",
    sectionEn: "Material Preparation"
  },
  {
    id: "3.2.4",
    name: "Probar todo el equipo",
    nameEn: "Test all equipment",
    assignee: "Aldo",
    hours: 3.0,
    difficulty: 2,
    dependencies: ["3.2.2"],
    phase: 3,
    section: "Preparación de Materiales",
    sectionEn: "Material Preparation"
  },
  {
    id: "3.2.5",
    name: "Crear materiales de respaldo",
    nameEn: "Create backup materials",
    assignee: "Luis",
    hours: 3.0,
    difficulty: 2,
    dependencies: ["3.2.3"],
    phase: 3,
    section: "Preparación de Materiales",
    sectionEn: "Material Preparation"
  },

  // 3.3 Team Training
  {
    id: "3.3.1",
    name: "Realizar ensayo completo del equipo",
    nameEn: "Conduct full team rehearsal",
    assignee: "Luis",
    hours: 6.0,
    difficulty: 3,
    dependencies: ["2.5.4", "3.2.3"],
    phase: 3,
    section: "Capacitación del Equipo",
    sectionEn: "Team Training"
  },
  {
    id: "3.3.2",
    name: "Practicar escenarios de solución de problemas",
    nameEn: "Practice troubleshooting scenarios",
    assignee: "Aldo",
    hours: 3.0,
    difficulty: 3,
    dependencies: ["3.3.1"],
    phase: 3,
    section: "Capacitación del Equipo",
    sectionEn: "Team Training"
  },
  {
    id: "3.3.3",
    name: "Hacer role-play de situaciones difíciles",
    nameEn: "Role-play difficult situations",
    assignee: "Nuri",
    hours: 3.0,
    difficulty: 3,
    dependencies: ["3.3.1"],
    phase: 3,
    section: "Capacitación del Equipo",
    sectionEn: "Team Training"
  },
  {
    id: "3.3.4",
    name: "Revisar y refinar el tiempo",
    nameEn: "Review and refine timing",
    assignee: "Luis",
    hours: 2.0,
    difficulty: 2,
    dependencies: ["3.3.1"],
    phase: 3,
    section: "Capacitación del Equipo",
    sectionEn: "Team Training"
  },
  {
    id: "3.3.5",
    name: "Lista de verificación de preparaciones finales",
    nameEn: "Final preparations checklist",
    assignee: "Nuri",
    hours: 1.5,
    difficulty: 1,
    dependencies: ["3.3.4"],
    phase: 3,
    section: "Capacitación del Equipo",
    sectionEn: "Team Training"
  },

  // Phase 4: Pilot & Iteration (20 tasks)
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

  // Phase 5: Launch Ready (24 tasks)
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

export const getTasksByPhase = (phase: number): Task[] => {
  return tasks.filter(task => task.phase === phase);
};

export const getTasksByAssignee = (assignee: string): Task[] => {
  return tasks.filter(task => task.assignee === assignee);
};

export const getTaskDependencies = (taskId: string): Task[] => {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return [];
  return tasks.filter(t => task.dependencies.includes(t.id));
};

export const getProjectStats = () => {
  const totalTasks = tasks.length;
  const totalHours = tasks.reduce((sum, task) => sum + task.hours, 0);
  const tasksByPhase = [1, 2, 3, 4, 5].map(phase => ({
    phase,
    count: tasks.filter(t => t.phase === phase).length,
    hours: tasks.filter(t => t.phase === phase).reduce((sum, t) => sum + t.hours, 0)
  }));
  
  return {
    totalTasks,
    totalHours,
    tasksByPhase,
    teamMembers
  };
};