import { Task } from '../types';

export const phase2Tasks: Task[] = [
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
];
