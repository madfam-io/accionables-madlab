import { Task } from '../types';

export const phase3Tasks: Task[] = [
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
];
