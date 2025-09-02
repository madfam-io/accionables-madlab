export const translations = {
  es: {
    // Hero section
    heroTitle: "Lista de Tareas del Proyecto MADLAB",
    heroSubtitle: "Proyecto Colaborativo: MADFAM × La Ciencia Del Juego",
    startDate: "🚀 Inicio: Lunes 11 de Agosto, 2025",
    
    // Search and filters
    searchPlaceholder: "Buscar tareas...",
    allMembers: "Todos los Miembros",
    allDifficulty: "Toda Dificultad",
    allPhases: "Todas las Fases",
    allDuration: "Toda Duración",
    allTeam: "Equipo Completo",
    shortDuration: "Corta (≤2h)",
    mediumDuration: "Media (2-5h)",
    longDuration: "Larga (>5h)",
    
    // Task details
    level: "Nivel",
    tasks: "tareas",
    hours: "horas",
    assignedTo: "Asignado a",
    duration: "Duración",
    difficulty: "Dificultad",
    dependencies: "Dependencias",
    none: "Ninguna",
    showDetails: "Mostrar detalles",
    hideDetails: "Ocultar detalles",
    showDependencies: "Mostrar dependencias",
    blockingTasks: "Tareas Bloqueantes",
    noDependencies: "Sin dependencias",
    
    // UI controls
    teamSummary: "Resumen del Equipo",
    showingAllTasks: "Mostrando todas las tareas",
    showing: "Mostrando",
    of: "de",
    taskId: "ID",
    taskName: "Nombre",
    phase: "Fase",
    section: "Sección",
    collapseAll: "Colapsar Todo",
    expandAll: "Expandir Todo",
    
    // View controls
    gridView: "Cuadrícula",
    listView: "Lista",
    gridViewTitle: "Vista de cuadrícula",
    listViewTitle: "Vista de lista",
    ganttViewTitle: "Vista de Gantt",
    
    // Theme controls
    themeAuto: "Auto",
    themeLight: "Claro",
    themeDark: "Oscuro",
    
    // Export functionality
    export: "Exportar",
    exporting: "Exportando...",
    exportTitle: "Exportar",
    clear: "Limpiar",
    clearTitle: "Limpiar filtros",
    exportTasks: "Exportar Tareas",
    selectExportOptions: "Selecciona las opciones de exportación",
    closeModal: "Cerrar modal",
    cancel: "Cancelar",
    exportFormat: "Formato de Exportación",
    exportScope: "Alcance de Exportación",
    exportLanguage: "Idioma de Exportación",
    fieldsToInclude: "Campos a Incluir",
    filteredTasksOnly: "Solo tareas filtradas",
    allTasksExport: "Todas las tareas",
    plainText: "Texto Plano",
    
    // Status
    projectTasks: "Tareas del Proyecto",
    exportDate: "Fecha de Exportación",
    totalTasks: "Total de Tareas",
    
    // Gantt Chart
    days: "Días",
    weeks: "Semanas", 
    months: "Meses",
    zoomIn: "Acercar",
    zoomOut: "Alejar",
    byPhase: "Por Fase",
    byAssignee: "Por Asignado",
    noGrouping: "Sin Agrupar",
    hideDependencies: "Ocultar Dependencias",
    criticalPath: "Ruta Crítica",
    autoScheduling: "Programación Automática",
    progress: "Progreso",
    timeline: "Línea de Tiempo"
  },
  
  en: {
    // Hero section
    heroTitle: "MADLAB Project Task List",
    heroSubtitle: "Collaborative Project: MADFAM × La Ciencia Del Juego",
    startDate: "🚀 Start: Monday, August 11, 2025",
    
    // Search and filters
    searchPlaceholder: "Search tasks...",
    allMembers: "All Members",
    allDifficulty: "All Difficulty",
    allPhases: "All Phases",
    allDuration: "All Duration",
    allTeam: "Full Team",
    shortDuration: "Short (≤2h)",
    mediumDuration: "Medium (2-5h)",
    longDuration: "Long (>5h)",
    
    // Task details
    level: "Level",
    tasks: "tasks",
    hours: "hours",
    assignedTo: "Assigned to",
    duration: "Duration",
    difficulty: "Difficulty",
    dependencies: "Dependencies",
    none: "None",
    showDetails: "Show details",
    hideDetails: "Hide details",
    showDependencies: "Show dependencies",
    blockingTasks: "Blocking Tasks",
    noDependencies: "No dependencies",
    
    // UI controls
    teamSummary: "Team Summary",
    showingAllTasks: "Showing all tasks",
    showing: "Showing",
    of: "of",
    taskId: "ID",
    taskName: "Name",
    phase: "Phase",
    section: "Section",
    collapseAll: "Collapse All",
    expandAll: "Expand All",
    
    // View controls
    gridView: "Grid",
    listView: "List",
    gridViewTitle: "Grid view",
    listViewTitle: "List view",
    ganttViewTitle: "Gantt view",
    
    // Theme controls
    themeAuto: "Auto",
    themeLight: "Light",
    themeDark: "Dark",
    
    // Export functionality
    export: "Export",
    exporting: "Exporting...",
    exportTitle: "Export",
    clear: "Clear",
    clearTitle: "Clear filters",
    exportTasks: "Export Tasks",
    selectExportOptions: "Select export options",
    closeModal: "Close modal",
    cancel: "Cancel",
    exportFormat: "Export Format",
    exportScope: "Export Scope",
    exportLanguage: "Export Language",
    fieldsToInclude: "Fields to Include",
    filteredTasksOnly: "Filtered tasks only",
    allTasksExport: "All tasks",
    plainText: "Plain Text",
    
    // Status
    projectTasks: "Project Tasks",
    exportDate: "Export Date",
    totalTasks: "Total Tasks",
    
    // Gantt Chart
    days: "Days",
    weeks: "Weeks",
    months: "Months", 
    zoomIn: "Zoom In",
    zoomOut: "Zoom Out",
    byPhase: "By Phase",
    byAssignee: "By Assignee",
    noGrouping: "No Grouping",
    hideDependencies: "Hide Dependencies",
    criticalPath: "Critical Path",
    autoScheduling: "Auto Scheduling",
    progress: "Progress",
    timeline: "Timeline"
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.es;