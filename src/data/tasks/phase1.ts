import { Task } from '../types';

export const phase1Tasks: Task[] = [
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
];
