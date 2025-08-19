export const tasksData = {
    1: {
        title: {
            es: "Fase 1: Fundación (11 Ago - 5 Sep, 2025)",
            en: "Phase 1: Foundation (Aug 11 - Sep 5, 2025)"
        },
        sections: [
            {
                title: {
                    es: "1.1 Configuración de Infraestructura del Proyecto",
                    en: "1.1 Project Infrastructure Setup"
                },
                tasks: [
                    {
                        id: "1.1.1",
                        name: {
                            es: "Configurar LeanTime (equipo completo) y AnyType (C-Suite)",
                            en: "Set up LeanTime (full team) and AnyType (C-Suite)"
                        },
                        assignedTo: "Aldo",
                        duration: "2.0",
                        difficulty: 2,
                        dependencies: {es: "Ninguna", en: "None"},
                        weekEstimate: "Week 33"
                    },
                    {
                        id: "1.1.2",
                        name: {
                            es: "Crear Google Drive compartido y espacio de Canva con estructura",
                            en: "Create shared Google Drive and Canva workspace with structure"
                        },
                        assignedTo: "Aldo",
                        duration: "1.0",
                        difficulty: 1,
                        dependencies: {es: "Ninguna", en: "None"},
                        weekEstimate: "Week 33"
                    },
                    {
                        id: "1.1.3",
                        name: {
                            es: "Configurar grupo de WhatsApp para comunicación del equipo",
                            en: "Set up WhatsApp group for team communication"
                        },
                        assignedTo: "Aldo",
                        duration: "1.5",
                        difficulty: 2,
                        dependencies: {es: "Ninguna", en: "None"},
                        weekEstimate: "Week 33"
                    },
                    {
                        id: "1.1.4",
                        name: {
                            es: "Diseñar plantillas de recolección de datos para BI",
                            en: "Design data collection templates for BI"
                        },
                        assignedTo: "Aldo",
                        duration: "4.0",
                        difficulty: 3,
                        dependencies: "1.1.1",
                        weekEstimate: "Week 33"
                    },
                    {
                        id: "1.1.5",
                        name: {
                            es: "Crear documento de protocolos de colaboración del equipo",
                            en: "Create team collaboration protocols document"
                        },
                        assignedTo: "Nuri",
                        duration: "3.0",
                        difficulty: 2,
                        dependencies: "1.1.3",
                        weekEstimate: "Week 33"
                    }
                ]
            },
            {
                title: {
                    es: "1.2 Investigación y Análisis de Mercado",
                    en: "1.2 Market Research & Analysis"
                },
                tasks: [
                    {
                        id: "1.2.1",
                        name: {
                            es: "Investigar ofertas de competidores en EdTech México",
                            en: "Research competitor offerings in EdTech Mexico"
                        },
                        assignedTo: "Silvia",
                        duration: "8.0",
                        difficulty: 3,
                        dependencies: {es: "Ninguna", en: "None"},
                        weekEstimate: "Week 34"
                    },
                    {
                        id: "1.2.2",
                        name: {
                            es: "Analizar modelos de precios para programas escolares",
                            en: "Analyze pricing models for school programs"
                        },
                        assignedTo: "Silvia",
                        duration: "5.0",
                        difficulty: 3,
                        dependencies: "1.2.1",
                        weekEstimate: "Week 34"
                    },
                    {
                        id: "1.2.3",
                        name: {
                            es: "Identificar las 50 mejores escuelas objetivo en la región",
                            en: "Identify top 50 target schools in region"
                        },
                        assignedTo: "Caro",
                        duration: "6.0",
                        difficulty: 2,
                        dependencies: {es: "Ninguna", en: "None"},
                        weekEstimate: "Week 34"
                    },
                    {
                        id: "1.2.4",
                        name: {
                            es: "Mapear procesos de toma de decisiones escolares",
                            en: "Map school decision-making processes"
                        },
                        assignedTo: "Caro",
                        duration: "4.0",
                        difficulty: 3,
                        dependencies: "1.2.3",
                        weekEstimate: "Week 34"
                    },
                    {
                        id: "1.2.5",
                        name: {
                            es: "Investigar oportunidades de subvenciones y patrocinadores",
                            en: "Research grant opportunities and sponsors"
                        },
                        assignedTo: "Silvia",
                        duration: "7.0",
                        difficulty: 4,
                        dependencies: {es: "Ninguna", en: "None"},
                        weekEstimate: "Week 34"
                    }
                ]
            },
            {
                title: {
                    es: "1.3 Desarrollo del Marco Educativo",
                    en: "1.3 Educational Framework Development"
                },
                tasks: [
                    {
                        id: "1.3.1",
                        name: {
                            es: "Mapear estándares curriculares de la SEP para grados objetivo",
                            en: "Map SEP curriculum standards for target grades"
                        },
                        assignedTo: "Caro",
                        duration: "6.0",
                        difficulty: 3,
                        dependencies: {es: "Ninguna", en: "None"},
                        weekEstimate: "Week 35"
                    },
                    {
                        id: "1.3.2",
                        name: {
                            es: "Investigar rutas de certificación CONOCER",
                            en: "Research CONOCER certification pathways"
                        },
                        assignedTo: "Nuri",
                        duration: "8.0",
                        difficulty: 4,
                        dependencies: {es: "Ninguna", en: "None"},
                        weekEstimate: "Week 35"
                    },
                    {
                        id: "1.3.3",
                        name: {
                            es: "Definir objetivos de aprendizaje por enfoque ODS",
                            en: "Define learning objectives per SDG focus"
                        },
                        assignedTo: "Nuri",
                        duration: "6.0",
                        difficulty: 3,
                        dependencies: "1.3.1",
                        weekEstimate: "Week 35"
                    },
                    {
                        id: "1.3.4",
                        name: {
                            es: "Crear marco de metodología de evaluación",
                            en: "Create assessment methodology framework"
                        },
                        assignedTo: "Nuri",
                        duration: "5.0",
                        difficulty: 4,
                        dependencies: "1.3.3",
                        weekEstimate: "Week 35"
                    },
                    {
                        id: "1.3.5",
                        name: {
                            es: "Diseñar herramientas de evaluación pre/post",
                            en: "Design pre/post evaluation tools"
                        },
                        assignedTo: "Luis",
                        duration: "4.0",
                        difficulty: 3,
                        dependencies: "1.3.4",
                        weekEstimate: "Week 35"
                    }
                ]
            },
            {
                title: {
                    es: "1.4 Requisitos Técnicos y Planificación Presupuestaria",
                    en: "1.4 Technical Requirements & Budget Planning"
                },
                tasks: [
                    {
                        id: "1.4.1",
                        name: {
                            es: "Listar todo el equipo técnico necesario",
                            en: "List all technical equipment needed"
                        },
                        assignedTo: "Aldo",
                        duration: "3.0",
                        difficulty: 2,
                        dependencies: {es: "Ninguna", en: "None"},
                        weekEstimate: "Week 36"
                    },
                    {
                        id: "1.4.2",
                        name: {
                            es: "Investigar proveedores de equipos y costos",
                            en: "Research equipment suppliers and costs"
                        },
                        assignedTo: "Aldo",
                        duration: "4.0",
                        difficulty: 2,
                        dependencies: "1.4.1",
                        weekEstimate: "Week 36"
                    },
                    {
                        id: "1.4.3",
                        name: {
                            es: "Crear escenarios de presupuesto modular",
                            en: "Create modular budget scenarios"
                        },
                        assignedTo: "Silvia",
                        duration: "5.0",
                        difficulty: 3,
                        dependencies: "1.4.2",
                        weekEstimate: "Week 36"
                    },
                    {
                        id: "1.4.4",
                        name: {
                            es: "Diseñar estructura de precios para escuelas",
                            en: "Design pricing structure for schools"
                        },
                        assignedTo: "Silvia",
                        duration: "4.0",
                        difficulty: 4,
                        dependencies: "1.4.3",
                        weekEstimate: "Week 36"
                    },
                    {
                        id: "1.4.5",
                        name: {
                            es: "Calcular análisis de punto de equilibrio",
                            en: "Calculate break-even analysis"
                        },
                        assignedTo: "Aldo",
                        duration: "3.0",
                        difficulty: 3,
                        dependencies: "1.4.4",
                        weekEstimate: "Week 36"
                    }
                ]
            },
            {
                title: {
                    es: "1.5 Activos Iniciales de Marca y Marketing",
                    en: "1.5 Initial Brand & Marketing Assets"
                },
                tasks: [
                    {
                        id: "1.5.1",
                        name: {
                            es: "Desarrollar guía de identidad de marca MADLAB",
                            en: "Develop MADLAB brand identity guide"
                        },
                        assignedTo: "Silvia",
                        duration: "8.0",
                        difficulty: 3,
                        dependencies: {es: "Ninguna", en: "None"},
                        weekEstimate: "Week 36"
                    },
                    {
                        id: "1.5.2",
                        name: {
                            es: "Crear logo y activos visuales",
                            en: "Create logo and visual assets"
                        },
                        assignedTo: "Caro",
                        duration: "8.0",
                        difficulty: 3,
                        dependencies: "1.5.1",
                        weekEstimate: "Week 36"
                    },
                    {
                        id: "1.5.3",
                        name: {
                            es: "Escribir elevator pitch y propuesta de valor",
                            en: "Write elevator pitch and value proposition"
                        },
                        assignedTo: "Silvia",
                        duration: "4.0",
                        difficulty: 3,
                        dependencies: {es: "Ninguna", en: "None"},
                        weekEstimate: "Week 36"
                    },
                    {
                        id: "1.5.4",
                        name: {
                            es: "Diseñar plantilla de presentación",
                            en: "Design presentation template"
                        },
                        assignedTo: "Caro",
                        duration: "3.0",
                        difficulty: 2,
                        dependencies: "1.5.2",
                        weekEstimate: "Week 36"
                    },
                    {
                        id: "1.5.5",
                        name: {
                            es: "Crear one-pager para escuelas",
                            en: "Create one-pager for schools"
                        },
                        assignedTo: "Silvia",
                        duration: "4.0",
                        difficulty: 3,
                        dependencies: "1.5.3",
                        weekEstimate: "Week 36"
                    }
                ]
            }
        ]
    },
    2: {
        title: {
            es: "Fase 2: Desarrollo de Contenido (6-25 Sep, 2025)",
            en: "Phase 2: Content Development (Sept 6-25, 2025)"
        },
        sections: [
            {
                title: {
                    es: "2.1 Diseño Curricular - Módulo de Agua Limpia",
                    en: "2.1 Curriculum Design - Clean Water Module"
                },
                tasks: [
                    {
                        id: "2.1.1",
                        name: {
                            es: "Investigar experimentos de purificación de agua",
                            en: "Research water purification experiments"
                        },
                        assignedTo: "Nuri",
                        duration: "6.0",
                        difficulty: 3,
                        dependencies: "1.3.3",
                        weekEstimate: "Week 37"
                    },
                    {
                        id: "2.1.2",
                        name: {
                            es: "Diseñar actividad gamificada del ciclo del agua",
                            en: "Design gamified water cycle activity"
                        },
                        assignedTo: "Luis",
                        duration: "5.0",
                        difficulty: 3,
                        dependencies: "2.1.1",
                        weekEstimate: "Week 37"
                    },
                    {
                        id: "2.1.3",
                        name: {
                            es: "Crear especificaciones del kit de prueba de agua",
                            en: "Create water testing kit specifications"
                        },
                        assignedTo: "Aldo",
                        duration: "4.0",
                        difficulty: 3,
                        dependencies: "2.1.1",
                        weekEstimate: "Week 37"
                    },
                    {
                        id: "2.1.4",
                        name: {
                            es: "Desarrollar diapositivas de presentación - agua",
                            en: "Develop presentation slides - water"
                        },
                        assignedTo: "Caro",
                        duration: "5.0",
                        difficulty: 2,
                        dependencies: "2.1.2",
                        weekEstimate: "Week 37"
                    },
                    {
                        id: "2.1.5",
                        name: {
                            es: "Crear cuaderno de trabajo del estudiante - agua",
                            en: "Create student workbook - water"
                        },
                        assignedTo: "Caro",
                        duration: "6.0",
                        difficulty: 3,
                        dependencies: "2.1.4",
                        weekEstimate: "Week 37"
                    }
                ]
            },
            {
                title: {
                    es: "2.2 Diseño Curricular - Módulo de Energía Limpia",
                    en: "2.2 Curriculum Design - Clean Energy Module"
                },
                tasks: [
                    {
                        id: "2.2.1",
                        name: {
                            es: "Diseñar demostración de panel solar",
                            en: "Design solar panel demonstration"
                        },
                        assignedTo: "Nuri",
                        duration: "5.0",
                        difficulty: 3,
                        dependencies: "1.3.3",
                        weekEstimate: "Week 37"
                    },
                    {
                        id: "2.2.2",
                        name: {
                            es: "Crear juego de conservación de energía",
                            en: "Create energy conservation game"
                        },
                        assignedTo: "Luis",
                        duration: "6.0",
                        difficulty: 4,
                        dependencies: "2.2.1",
                        weekEstimate: "Week 38"
                    },
                    {
                        id: "2.2.3",
                        name: {
                            es: "Construir prototipo de mini turbina eólica",
                            en: "Build mini wind turbine prototype"
                        },
                        assignedTo: "Aldo",
                        duration: "8.0",
                        difficulty: 4,
                        dependencies: {es: "Ninguna", en: "None"},
                        weekEstimate: "Week 38"
                    },
                    {
                        id: "2.2.4",
                        name: {
                            es: "Desarrollar diapositivas de presentación - energía",
                            en: "Develop presentation slides - energy"
                        },
                        assignedTo: "Caro",
                        duration: "5.0",
                        difficulty: 2,
                        dependencies: "2.2.2",
                        weekEstimate: "Week 38"
                    },
                    {
                        id: "2.2.5",
                        name: {
                            es: "Crear cuaderno de trabajo del estudiante - energía",
                            en: "Create student workbook - energy"
                        },
                        assignedTo: "Caro",
                        duration: "6.0",
                        difficulty: 3,
                        dependencies: "2.2.4",
                        weekEstimate: "Week 38"
                    }
                ]
            },
            {
                title: {
                    es: "2.3 Diseño Curricular - Módulo de Reciclaje",
                    en: "2.3 Curriculum Design - Recycling Module"
                },
                tasks: [
                    {
                        id: "2.3.1",
                        name: {
                            es: "Diseñar mecánicas del juego de clasificación",
                            en: "Design sorting game mechanics"
                        },
                        assignedTo: "Luis",
                        duration: "5.0",
                        difficulty: 3,
                        dependencies: "1.3.3",
                        weekEstimate: "Week 38"
                    },
                    {
                        id: "2.3.2",
                        name: {
                            es: "Crear actividades de manualidades con reciclaje",
                            en: "Create upcycling craft activities"
                        },
                        assignedTo: "Nuri",
                        duration: "4.0",
                        difficulty: 2,
                        dependencies: "2.3.1",
                        weekEstimate: "Week 38"
                    },
                    {
                        id: "2.3.3",
                        name: {
                            es: "Desarrollar visuales del proceso de reciclaje",
                            en: "Develop recycling process visuals"
                        },
                        assignedTo: "Caro",
                        duration: "4.0",
                        difficulty: 2,
                        dependencies: {es: "Ninguna", en: "None"},
                        weekEstimate: "Week 38"
                    },
                    {
                        id: "2.3.4",
                        name: {
                            es: "Crear diapositivas de presentación - reciclaje",
                            en: "Create presentation slides - recycling"
                        },
                        assignedTo: "Caro",
                        duration: "5.0",
                        difficulty: 2,
                        dependencies: "2.3.2",
                        weekEstimate: "Week 38"
                    },
                    {
                        id: "2.3.5",
                        name: {
                            es: "Crear cuaderno de trabajo del estudiante - reciclaje",
                            en: "Create student workbook - recycling"
                        },
                        assignedTo: "Caro",
                        duration: "6.0",
                        difficulty: 3,
                        dependencies: "2.3.4",
                        weekEstimate: "Week 38"
                    }
                ]
            },
            {
                title: {
                    es: "2.4 Integración Tecnológica",
                    en: "2.4 Technology Integration"
                },
                tasks: [
                    {
                        id: "2.4.1",
                        name: {
                            es: "Programar demostraciones interactivas",
                            en: "Program interactive demonstrations"
                        },
                        assignedTo: "Aldo",
                        duration: "10.0",
                        difficulty: 4,
                        dependencies: "2.1.1, 2.2.1, 2.3.1",
                        weekEstimate: "Week 39"
                    },
                    {
                        id: "2.4.2",
                        name: {
                            es: "Crear bucles visuales de fondo",
                            en: "Create background visual loops"
                        },
                        assignedTo: "Aldo",
                        duration: "6.0",
                        difficulty: 3,
                        dependencies: "2.4.1",
                        weekEstimate: "Week 39"
                    },
                    {
                        id: "2.4.3",
                        name: {
                            es: "Configurar sistema de recolección de datos",
                            en: "Set up data collection system"
                        },
                        assignedTo: "Aldo",
                        duration: "5.0",
                        difficulty: 3,
                        dependencies: {es: "Ninguna", en: "None"},
                        weekEstimate: "Week 39"
                    },
                    {
                        id: "2.4.4",
                        name: {
                            es: "Probar todos los componentes tecnológicos juntos",
                            en: "Test all tech components together"
                        },
                        assignedTo: "Aldo",
                        duration: "4.0",
                        difficulty: 3,
                        dependencies: "2.4.1, 2.4.2, 2.4.3",
                        weekEstimate: "Week 39"
                    },
                    {
                        id: "2.4.5",
                        name: {
                            es: "Crear guía de solución de problemas",
                            en: "Create troubleshooting guide"
                        },
                        assignedTo: "Aldo",
                        duration: "3.0",
                        difficulty: 2,
                        dependencies: "2.4.4",
                        weekEstimate: "Week 39"
                    }
                ]
            },
            {
                title: {
                    es: "2.5 Materiales de Capacitación para Facilitadores",
                    en: "2.5 Facilitator Training Materials"
                },
                tasks: [
                    {
                        id: "2.5.1",
                        name: {
                            es: "Escribir guía del facilitador",
                            en: "Write facilitator guide"
                        },
                        assignedTo: "Luis",
                        duration: "8.0",
                        difficulty: 3,
                        dependencies: "2.1.5, 2.2.5, 2.3.5",
                        weekEstimate: "Week 39"
                    },
                    {
                        id: "2.5.2",
                        name: {
                            es: "Crear diagramas de tiempo y flujo",
                            en: "Create timing and flow charts"
                        },
                        assignedTo: "Nuri",
                        duration: "4.0",
                        difficulty: 2,
                        dependencies: "2.5.1",
                        weekEstimate: "Week 39"
                    },
                    {
                        id: "2.5.3",
                        name: {
                            es: "Diseñar protocolos de emergencia",
                            en: "Design emergency protocols"
                        },
                        assignedTo: "Nuri",
                        duration: "3.0",
                        difficulty: 3,
                        dependencies: {es: "Ninguna", en: "None"},
                        weekEstimate: "Week 39"
                    },
                    {
                        id: "2.5.4",
                        name: {
                            es: "Grabar videos de capacitación",
                            en: "Record training videos"
                        },
                        assignedTo: "Luis",
                        duration: "6.0",
                        difficulty: 3,
                        dependencies: "2.5.1, 2.5.2",
                        weekEstimate: "Week 39"
                    },
                    {
                        id: "2.5.5",
                        name: {
                            es: "Crear rúbricas de evaluación",
                            en: "Create evaluation rubrics"
                        },
                        assignedTo: "Caro",
                        duration: "3.0",
                        difficulty: 2,
                        dependencies: "1.3.5",
                        weekEstimate: "Week 39"
                    }
                ]
            }
        ]
    },
    3: {
        title: {
            es: "Fase 3: Preparación del Piloto (26 Sep - 5 Oct, 2025)",
            en: "Phase 3: Pilot Preparation (Sept 26 - Oct 5, 2025)"
        },
        sections: [
            {
                title: {
                    es: "3.1 Ventas y Alcance",
                    en: "3.1 Sales & Outreach"
                },
                tasks: [
                    {
                        id: "3.1.1",
                        name: {
                            es: "Finalizar presentación de ventas",
                            en: "Finalize sales deck"
                        },
                        assignedTo: "Silvia",
                        duration: "6.0",
                        difficulty: 3,
                        dependencies: "1.5.5, 2.5.1",
                        weekEstimate: "Week 39"
                    },
                    {
                        id: "3.1.2",
                        name: {
                            es: "Crear plantillas de correo electrónico de alcance",
                            en: "Create email outreach templates"
                        },
                        assignedTo: "Silvia",
                        duration: "3.0",
                        difficulty: 2,
                        dependencies: "3.1.1",
                        weekEstimate: "Week 39"
                    },
                    {
                        id: "3.1.3",
                        name: {
                            es: "Calentar 10 contactos escolares",
                            en: "Warm up 10 school contacts"
                        },
                        assignedTo: "Caro",
                        duration: "8.0",
                        difficulty: 3,
                        dependencies: "3.1.2",
                        weekEstimate: "Week 40"
                    },
                    {
                        id: "3.1.4",
                        name: {
                            es: "Programar reuniones con escuelas piloto",
                            en: "Schedule pilot school meetings"
                        },
                        assignedTo: "Caro",
                        duration: "4.0",
                        difficulty: 3,
                        dependencies: "3.1.3",
                        weekEstimate: "Week 40"
                    },
                    {
                        id: "3.1.5",
                        name: {
                            es: "Asegurar compromiso de escuela piloto",
                            en: "Secure pilot school commitment"
                        },
                        assignedTo: "Caro",
                        duration: "5.0",
                        difficulty: 4,
                        dependencies: "3.1.4",
                        weekEstimate: "Week 40"
                    }
                ]
            },
            {
                title: {
                    es: "3.2 Preparación de Materiales",
                    en: "3.2 Material Preparation"
                },
                tasks: [
                    {
                        id: "3.2.1",
                        name: {
                            es: "Imprimir todos los materiales para estudiantes",
                            en: "Print all student materials"
                        },
                        assignedTo: "Caro",
                        duration: "4.0",
                        difficulty: 1,
                        dependencies: "2.1.5, 2.2.5, 2.3.5",
                        weekEstimate: "Week 40"
                    },
                    {
                        id: "3.2.2",
                        name: {
                            es: "Comprar/alquilar equipos para piloto",
                            en: "Purchase/rent equipment for pilot"
                        },
                        assignedTo: "Aldo",
                        duration: "5.0",
                        difficulty: 3,
                        dependencies: "1.4.2",
                        weekEstimate: "Week 40"
                    },
                    {
                        id: "3.2.3",
                        name: {
                            es: "Preparar kits de materiales",
                            en: "Prepare material kits"
                        },
                        assignedTo: "Luis",
                        duration: "4.0",
                        difficulty: 2,
                        dependencies: "3.2.1, 3.2.2",
                        weekEstimate: "Week 40"
                    },
                    {
                        id: "3.2.4",
                        name: {
                            es: "Probar todo el equipo",
                            en: "Test all equipment"
                        },
                        assignedTo: "Aldo",
                        duration: "3.0",
                        difficulty: 2,
                        dependencies: "3.2.2",
                        weekEstimate: "Week 40"
                    },
                    {
                        id: "3.2.5",
                        name: {
                            es: "Crear materiales de respaldo",
                            en: "Create backup materials"
                        },
                        assignedTo: "Luis",
                        duration: "3.0",
                        difficulty: 2,
                        dependencies: "3.2.3",
                        weekEstimate: "Week 40"
                    }
                ]
            },
            {
                title: {
                    es: "3.3 Capacitación del Equipo",
                    en: "3.3 Team Training"
                },
                tasks: [
                    {
                        id: "3.3.1",
                        name: {
                            es: "Realizar ensayo completo del equipo",
                            en: "Conduct full team rehearsal"
                        },
                        assignedTo: "Luis",
                        duration: "6.0",
                        difficulty: 3,
                        dependencies: "2.5.4, 3.2.3"
                    },
                    {
                        id: "3.3.2",
                        name: {
                            es: "Practicar escenarios de solución de problemas",
                            en: "Practice troubleshooting scenarios"
                        },
                        assignedTo: "Aldo",
                        duration: "3.0",
                        difficulty: 3,
                        dependencies: "3.3.1",
                        weekEstimate: "Week 40"
                    },
                    {
                        id: "3.3.3",
                        name: {
                            es: "Hacer role-play de situaciones difíciles",
                            en: "Role-play difficult situations"
                        },
                        assignedTo: "Nuri",
                        duration: "3.0",
                        difficulty: 3,
                        dependencies: "3.3.1",
                        weekEstimate: "Week 40"
                    },
                    {
                        id: "3.3.4",
                        name: {
                            es: "Revisar y refinar el tiempo",
                            en: "Review and refine timing"
                        },
                        assignedTo: "Luis",
                        duration: "2.0",
                        difficulty: 2,
                        dependencies: "3.3.1",
                        weekEstimate: "Week 40"
                    },
                    {
                        id: "3.3.5",
                        name: {
                            es: "Lista de verificación de preparaciones finales",
                            en: "Final preparations checklist"
                        },
                        assignedTo: "Nuri",
                        duration: "1.5",
                        difficulty: 1,
                        dependencies: "3.3.4",
                        weekEstimate: "Week 40"
                    }
                ]
            }
        ]
    },
    4: {
        title: {
            es: "Fase 4: Piloto e Iteración (6-20 Oct, 2025)",
            en: "Phase 4: Pilot & Iteration (Oct 6-20, 2025)"
        },
        sections: [
            {
                title: {
                    es: "4.1 Ejecución del Piloto",
                    en: "4.1 Pilot Execution"
                },
                tasks: [
                    {
                        id: "4.1.1",
                        name: {
                            es: "Configurar lugar del piloto",
                            en: "Set up pilot venue"
                        },
                        assignedTo: "Aldo",
                        duration: "2.0",
                        difficulty: 2,
                        dependencies: "3.2.4",
                        weekEstimate: "Week 41"
                    },
                    {
                        id: "4.1.2",
                        name: {
                            es: "Realizar evento piloto",
                            en: "Conduct pilot event"
                        },
                        assignedTo: "Luis",
                        duration: "3.0",
                        difficulty: 4,
                        dependencies: "4.1.1",
                        weekEstimate: "Week 41"
                    },
                    {
                        id: "4.1.3",
                        name: {
                            es: "Recopilar retroalimentación en tiempo real",
                            en: "Collect real-time feedback"
                        },
                        assignedTo: "Nuri",
                        duration: "3.0",
                        difficulty: 3,
                        dependencies: "4.1.2",
                        weekEstimate: "Week 41"
                    },
                    {
                        id: "4.1.4",
                        name: {
                            es: "Documentar piloto con fotos/video",
                            en: "Document pilot with photos/video"
                        },
                        assignedTo: "Silvia",
                        duration: "3.0",
                        difficulty: 2,
                        dependencies: "4.1.2",
                        weekEstimate: "Week 41"
                    },
                    {
                        id: "4.1.5",
                        name: {
                            es: "Informe con escuela piloto",
                            en: "Debrief with pilot school"
                        },
                        assignedTo: "Caro",
                        duration: "2.0",
                        difficulty: 3,
                        dependencies: "4.1.2",
                        weekEstimate: "Week 41"
                    }
                ]
            },
            {
                title: {
                    es: "4.2 Análisis e Iteración",
                    en: "4.2 Analysis & Iteration"
                },
                tasks: [
                    {
                        id: "4.2.1",
                        name: {
                            es: "Analizar datos y retroalimentación del piloto",
                            en: "Analyze pilot data and feedback"
                        },
                        assignedTo: "Aldo",
                        duration: "5.0",
                        difficulty: 3,
                        dependencies: "4.1.3, 4.1.5",
                        weekEstimate: "Week 41"
                    },
                    {
                        id: "4.2.2",
                        name: {
                            es: "Reunión retrospectiva del equipo",
                            en: "Team retrospective meeting"
                        },
                        assignedTo: "Nuri",
                        duration: "3.0",
                        difficulty: 2,
                        dependencies: "4.2.1",
                        weekEstimate: "Week 42"
                    },
                    {
                        id: "4.2.3",
                        name: {
                            es: "Identificar las 5 mejoras principales",
                            en: "Identify top 5 improvements"
                        },
                        assignedTo: "Luis",
                        duration: "4.0",
                        difficulty: 3,
                        dependencies: "4.2.2",
                        weekEstimate: "Week 42"
                    },
                    {
                        id: "4.2.4",
                        name: {
                            es: "Actualizar materiales basados en retroalimentación",
                            en: "Update materials based on feedback"
                        },
                        assignedTo: "Caro",
                        duration: "8.0",
                        difficulty: 3,
                        dependencies: "4.2.3",
                        weekEstimate: "Week 42"
                    },
                    {
                        id: "4.2.5",
                        name: {
                            es: "Refinar guía del facilitador",
                            en: "Refine facilitator guide"
                        },
                        assignedTo: "Luis",
                        duration: "5.0",
                        difficulty: 3,
                        dependencies: "4.2.3",
                        weekEstimate: "Week 42"
                    }
                ]
            },
            {
                title: {
                    es: "4.3 Creación de Contenido de Marketing",
                    en: "4.3 Marketing Content Creation"
                },
                tasks: [
                    {
                        id: "4.3.1",
                        name: {
                            es: "Editar video del piloto para marketing",
                            en: "Edit pilot video for marketing"
                        },
                        assignedTo: "Silvia",
                        duration: "8.0",
                        difficulty: 3,
                        dependencies: "4.1.4",
                        weekEstimate: "Week 42"
                    },
                    {
                        id: "4.3.2",
                        name: {
                            es: "Crear gráficos de testimonios",
                            en: "Create testimonial graphics"
                        },
                        assignedTo: "Silvia",
                        duration: "4.0",
                        difficulty: 2,
                        dependencies: "4.1.5",
                        weekEstimate: "Week 42"
                    },
                    {
                        id: "4.3.3",
                        name: {
                            es: "Escribir caso de estudio del piloto",
                            en: "Write case study from pilot"
                        },
                        assignedTo: "Silvia",
                        duration: "5.0",
                        difficulty: 3,
                        dependencies: "4.2.1",
                        weekEstimate: "Week 42"
                    },
                    {
                        id: "4.3.4",
                        name: {
                            es: "Diseñar campaña de redes sociales",
                            en: "Design social media campaign"
                        },
                        assignedTo: "Silvia",
                        duration: "6.0",
                        difficulty: 3,
                        dependencies: "4.3.1, 4.3.2",
                        weekEstimate: "Week 42"
                    },
                    {
                        id: "4.3.5",
                        name: {
                            es: "Crear plantillas de WhatsApp Business para ventas",
                            en: "Create WhatsApp Business templates for sales"
                        },
                        assignedTo: "Silvia",
                        duration: "3.0",
                        difficulty: 2,
                        dependencies: "4.3.4",
                        weekEstimate: "Week 42"
                    }
                ]
            },
            {
                title: {
                    es: "4.4 Refinamiento de Operaciones",
                    en: "4.4 Operations Refinement"
                },
                tasks: [
                    {
                        id: "4.4.1",
                        name: {
                            es: "Optimizar proceso de configuración de equipos",
                            en: "Optimize equipment setup process"
                        },
                        assignedTo: "Aldo",
                        duration: "4.0",
                        difficulty: 3,
                        dependencies: "4.2.3",
                        weekEstimate: "Week 42"
                    },
                    {
                        id: "4.4.2",
                        name: {
                            es: "Crear lista de verificación de logística",
                            en: "Create logistics checklist"
                        },
                        assignedTo: "Aldo",
                        duration: "2.0",
                        difficulty: 2,
                        dependencies: "4.4.1",
                        weekEstimate: "Week 42"
                    },
                    {
                        id: "4.4.3",
                        name: {
                            es: "Diseñar sistema de reserva/pago",
                            en: "Design booking/payment system"
                        },
                        assignedTo: "Aldo",
                        duration: "6.0",
                        difficulty: 4,
                        dependencies: {es: "Ninguna", en: "None"},
                        weekEstimate: "Week 42"
                    },
                    {
                        id: "4.4.4",
                        name: {
                            es: "Configurar CRM para escuelas",
                            en: "Set up CRM for schools"
                        },
                        assignedTo: "Silvia",
                        duration: "5.0",
                        difficulty: 3,
                        dependencies: "4.4.3",
                        weekEstimate: "Week 42"
                    },
                    {
                        id: "4.4.5",
                        name: {
                            es: "Crear sistema de encuesta post-evento",
                            en: "Create post-event survey system"
                        },
                        assignedTo: "Nuri",
                        duration: "4.0",
                        difficulty: 3,
                        dependencies: {es: "Ninguna", en: "None"},
                        weekEstimate: "Week 42"
                    }
                ]
            }
        ]
    },
    5: {
        title: {
            es: "Fase 5: Listos para el Lanzamiento (21-31 Oct, 2025)",
            en: "Phase 5: Launch Ready (Oct 21-31, 2025)"
        },
        sections: [
            {
                title: {
                    es: "5.1 Preparaciones Finales",
                    en: "5.1 Final Preparations"
                },
                tasks: [
                    {
                        id: "5.1.1",
                        name: {
                            es: "Finalizar todos los materiales",
                            en: "Finalize all materials"
                        },
                        assignedTo: "Caro",
                        duration: "6.0",
                        difficulty: 2,
                        dependencies: "4.2.4",
                        weekEstimate: "Week 43"
                    },
                    {
                        id: "5.1.2",
                        name: {
                            es: "Imprimir materiales para el primer mes",
                            en: "Print materials for first month"
                        },
                        assignedTo: "Caro",
                        duration: "5.0",
                        difficulty: 2,
                        dependencies: "5.1.1",
                        weekEstimate: "Week 43"
                    },
                    {
                        id: "5.1.3",
                        name: {
                            es: "Control de calidad de todo el equipo",
                            en: "Quality check all equipment"
                        },
                        assignedTo: "Aldo",
                        duration: "3.0",
                        difficulty: 2,
                        dependencies: {es: "Ninguna", en: "None"},
                        weekEstimate: "Week 43"
                    },
                    {
                        id: "5.1.4",
                        name: {
                            es: "Sesión final de entrenamiento del equipo",
                            en: "Final team training session"
                        },
                        assignedTo: "Luis",
                        duration: "4.0",
                        difficulty: 3,
                        dependencies: "4.2.5",
                        weekEstimate: "Week 43"
                    },
                    {
                        id: "5.1.5",
                        name: {
                            es: "Crear protocolos de emergencia",
                            en: "Create emergency protocols"
                        },
                        assignedTo: "Nuri",
                        duration: "3.0",
                        difficulty: 3,
                        dependencies: {es: "Ninguna", en: "None"},
                        weekEstimate: "Week 43"
                    }
                ]
            },
            {
                title: {
                    es: "5.2 Impulso de Ventas",
                    en: "5.2 Sales Push"
                },
                tasks: [
                    {
                        id: "5.2.1",
                        name: {
                            es: "Lanzar alcance a 30 escuelas",
                            en: "Launch outreach to 30 schools"
                        },
                        assignedTo: "Caro",
                        duration: "10.0",
                        difficulty: 4,
                        dependencies: "4.3.3",
                        weekEstimate: "Week 43"
                    },
                    {
                        id: "5.2.2",
                        name: {
                            es: "Dar seguimiento a todos los prospectos",
                            en: "Follow up on all leads"
                        },
                        assignedTo: "Caro",
                        duration: "8.0",
                        difficulty: 3,
                        dependencies: "5.2.1",
                        weekEstimate: "Week 43"
                    },
                    {
                        id: "5.2.3",
                        name: {
                            es: "Cerrar primeras 5 reservas",
                            en: "Close first 5 bookings"
                        },
                        assignedTo: "Caro",
                        duration: "8.0",
                        difficulty: 5,
                        dependencies: "5.2.2",
                        weekEstimate: "Week 44"
                    },
                    {
                        id: "5.2.4",
                        name: {
                            es: "Procesar depósitos y contratos",
                            en: "Process deposits and contracts"
                        },
                        assignedTo: "Silvia",
                        duration: "4.0",
                        difficulty: 3,
                        dependencies: "5.2.3",
                        weekEstimate: "Week 44"
                    },
                    {
                        id: "5.2.5",
                        name: {
                            es: "Programar eventos de noviembre",
                            en: "Schedule November events"
                        },
                        assignedTo: "Caro",
                        duration: "3.0",
                        difficulty: 2,
                        dependencies: "5.2.4",
                        weekEstimate: "Week 44"
                    }
                ]
            },
            {
                title: {
                    es: "5.3 Lanzamiento de Marketing",
                    en: "5.3 Marketing Launch"
                },
                tasks: [
                    {
                        id: "5.3.1",
                        name: {
                            es: "Lanzar campaña de redes sociales",
                            en: "Launch social media campaign"
                        },
                        assignedTo: "Silvia",
                        duration: "4.0",
                        difficulty: 3,
                        dependencies: "4.3.4",
                        weekEstimate: "Week 44"
                    },
                    {
                        id: "5.3.2",
                        name: {
                            es: "Enviar comunicado de prensa a medios",
                            en: "Send press release to media"
                        },
                        assignedTo: "Silvia",
                        duration: "3.0",
                        difficulty: 3,
                        dependencies: "4.3.3",
                        weekEstimate: "Week 44"
                    },
                    {
                        id: "5.3.3",
                        name: {
                            es: "Activar marketing por WhatsApp",
                            en: "Activate WhatsApp marketing"
                        },
                        assignedTo: "Silvia",
                        duration: "2.0",
                        difficulty: 2,
                        dependencies: "4.3.5",
                        weekEstimate: "Week 44"
                    },
                    {
                        id: "5.3.4",
                        name: {
                            es: "Lanzar programa de referidos",
                            en: "Launch referral program"
                        },
                        assignedTo: "Silvia",
                        duration: "5.0",
                        difficulty: 3,
                        dependencies: {es: "Ninguna", en: "None"},
                        weekEstimate: "Week 44"
                    },
                    {
                        id: "5.3.5",
                        name: {
                            es: "Configurar campaña de Google Ads",
                            en: "Set up Google Ads campaign"
                        },
                        assignedTo: "Silvia",
                        duration: "6.0",
                        difficulty: 4,
                        dependencies: {es: "Ninguna", en: "None"},
                        weekEstimate: "Week 44"
                    }
                ]
            },
            {
                title: {
                    es: "5.4 Sistemas y Documentación",
                    en: "5.4 Systems & Documentation"
                },
                tasks: [
                    {
                        id: "5.4.1",
                        name: {
                            es: "Documentar todos los procesos",
                            en: "Document all processes"
                        },
                        assignedTo: "Nuri",
                        duration: "8.0",
                        difficulty: 3,
                        dependencies: "All previous",
                        weekEstimate: "Week 44"
                    },
                    {
                        id: "5.4.2",
                        name: {
                            es: "Crear manual de operaciones",
                            en: "Create operations manual"
                        },
                        assignedTo: "Luis",
                        duration: "6.0",
                        difficulty: 3,
                        dependencies: "5.4.1",
                        weekEstimate: "Week 44"
                    },
                    {
                        id: "5.4.3",
                        name: {
                            es: "Configurar tableros de datos",
                            en: "Set up data dashboards"
                        },
                        assignedTo: "Aldo",
                        duration: "6.0",
                        difficulty: 4,
                        dependencies: "4.4.5",
                        weekEstimate: "Week 44"
                    },
                    {
                        id: "5.4.4",
                        name: {
                            es: "Crear sistema de seguimiento financiero",
                            en: "Create financial tracking system"
                        },
                        assignedTo: "Aldo",
                        duration: "5.0",
                        difficulty: 3,
                        dependencies: "5.4.3",
                        weekEstimate: "Week 44"
                    },
                    {
                        id: "5.4.5",
                        name: {
                            es: "Verificación final de sistemas",
                            en: "Final systems check"
                        },
                        assignedTo: "Aldo",
                        duration: "3.0",
                        difficulty: 3,
                        dependencies: "All previous",
                        weekEstimate: "Week 44"
                    }
                ]
            },
            {
                title: {
                    es: "5.5 Evento de Lanzamiento",
                    en: "5.5 Launch Event"
                },
                tasks: [
                    {
                        id: "5.5.1",
                        name: {
                            es: "Preparar materiales del día de lanzamiento",
                            en: "Prepare launch day materials"
                        },
                        assignedTo: "Luis",
                        duration: "3.0",
                        difficulty: 2,
                        dependencies: "5.1.2",
                        weekEstimate: "Week 44"
                    },
                    {
                        id: "5.5.2",
                        name: {
                            es: "Reunión informativa y motivación del equipo",
                            en: "Team briefing and motivation"
                        },
                        assignedTo: "Nuri",
                        duration: "1.0",
                        difficulty: 2,
                        dependencies: {es: "Ninguna", en: "None"},
                        weekEstimate: "Week 44"
                    },
                    {
                        id: "5.5.3",
                        name: {
                            es: "Ejecutar primer evento oficial",
                            en: "Execute first official event"
                        },
                        assignedTo: "Luis",
                        duration: "3.0",
                        difficulty: 5,
                        dependencies: "5.5.1, 5.5.2",
                        weekEstimate: "Week 44"
                    },
                    {
                        id: "5.5.4",
                        name: {
                            es: "Documentar éxito del lanzamiento",
                            en: "Document launch success"
                        },
                        assignedTo: "Silvia",
                        duration: "2.0",
                        difficulty: 2,
                        dependencies: "5.5.3",
                        weekEstimate: "Week 44"
                    },
                    {
                        id: "5.5.5",
                        name: {
                            es: "Celebrar y hacer informe",
                            en: "Celebrate and debrief"
                        },
                        assignedTo: "All",
                        duration: "2.0",
                        difficulty: 1,
                        dependencies: "5.5.3",
                        weekEstimate: "Week 44"
                    }
                ]
            }
        ]
    }
};

export default tasksData;