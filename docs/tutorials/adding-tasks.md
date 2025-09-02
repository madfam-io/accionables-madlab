# Adding New Tasks

Learn how to add new tasks to the MADLAB project, including task data, translations, and team assignments. This tutorial covers the complete process from data entry to testing.

## 🎯 What You'll Learn

- How to add new tasks to the project data
- How to include bilingual task descriptions
- How to assign tasks to team members
- How to set task dependencies and difficulty levels
- How to test your changes

## ⏱️ Estimated Time: 30 minutes

## 📋 Prerequisites

- MADLAB project running locally
- Basic understanding of TypeScript
- Familiarity with the project structure
- Text editor (VS Code recommended)

## 🗂️ Understanding Task Structure

### Task Interface
```typescript
interface Task {
  id: string;              // Unique identifier (e.g., "T001")
  name: string;            // Spanish task name
  nameEn: string;          // English task name
  assignee: string;        // Team member name
  hours: number;           // Estimated hours
  difficulty: number;      // 1-5 difficulty level
  phase: number;           // Project phase (1-5)
  section: string;         // Spanish section name
  sectionEn: string;       // English section name
  dependencies: string[];  // Array of dependent task IDs
}
```

### Example Task
```typescript
{
  id: "T110",
  name: "Configurar sistema de retroalimentación",
  nameEn: "Set up feedback system",
  assignee: "Aldo",
  hours: 4,
  difficulty: 3,
  phase: 4,
  section: "Sistemas de Comunicación",
  sectionEn: "Communication Systems",
  dependencies: ["T089", "T095"]
}
```

## 📝 Step-by-Step Guide

### Step 1: Locate the Data File

Open the task data file:
```bash
src/data/projectData.ts
```

### Step 2: Find the Appropriate Phase

Tasks are organized by phases. Identify which phase your task belongs to:

```typescript
// Phase 1: Foundation (T001-T021)
// Phase 2: Content Development (T022-T055) 
// Phase 3: Pilot Preparation (T056-T078)
// Phase 4: Pilot & Iteration (T079-T099)
// Phase 5: Launch Ready (T100-T109)
```

### Step 3: Determine the Next Task ID

Find the last task ID in your target phase and increment:

```typescript
// If last task in phase 4 is T099, next would be T100
// If adding to existing phase, use next available number
```

### Step 4: Add Your Task

Insert your new task in the appropriate location:

```typescript
// Example: Adding a new task to Phase 4
{
  id: "T110", // Next available ID
  name: "Implementar panel de métricas de usuario",
  nameEn: "Implement user metrics dashboard",
  assignee: "Aldo", // Choose from: Aldo, Nuri, Luis, Silvia, Caro
  hours: 6,
  difficulty: 4, // 1=Easy, 2=Medium, 3=Hard, 4=Very Hard, 5=Expert
  phase: 4,
  section: "Análisis y Métricas",
  sectionEn: "Analytics and Metrics",
  dependencies: ["T089", "T095"] // Tasks that must complete first
},
```

### Step 5: Update Team Statistics

When adding tasks, the team statistics update automatically, but verify the assignee exists in the team data:

```typescript
// Verify assignee is one of these team members:
export const teamMembers: TeamMember[] = [
  { name: "Aldo", tasks: 24, hours: 116.5 },
  { name: "Nuri", tasks: 19, hours: 86.5 },
  { name: "Luis", tasks: 20, hours: 102 },
  { name: "Silvia", tasks: 23, hours: 115.5 },
  { name: "Caro", tasks: 22, hours: 102 }
];
```

### Step 6: Add Section Translation (if new)

If you're creating a new section, add it to the translations:

```typescript
// In src/data/translations.ts, add new section if needed
export const translations = {
  es: {
    // ... existing translations
    "Análisis y Métricas": "Análisis y Métricas"
  },
  en: {
    // ... existing translations  
    "Análisis y Métricas": "Analytics and Metrics"
  }
};
```

## 🧪 Testing Your Changes

### Step 1: Start Development Server
```bash
npm run dev
```

### Step 2: Verify Task Appears
1. Open http://localhost:5173
2. Navigate to the appropriate phase
3. Confirm your task appears in the correct section
4. Verify all fields display correctly

### Step 3: Test Functionality
1. **Search**: Search for your task name
2. **Filter**: Filter by assignee and difficulty
3. **Language**: Toggle language to verify translations
4. **Dependencies**: Check dependency display if applicable
5. **Export**: Test exporting data includes your task

### Step 4: Check Team Statistics
1. Verify team member statistics updated correctly
2. Check total hours and task counts
3. Ensure phase statistics are accurate

## 🔧 Advanced Task Configuration

### Setting Dependencies
```typescript
// Task depends on completion of other tasks
dependencies: ["T089", "T095", "T102"]

// No dependencies (independent task)
dependencies: []
```

### Difficulty Guidelines
```typescript
// 1 = Easy: 1-2 hours, routine work
// 2 = Medium: 3-4 hours, standard complexity
// 3 = Hard: 5-8 hours, requires expertise
// 4 = Very Hard: 8+ hours, complex integration
// 5 = Expert: 12+ hours, architectural changes
```

### Phase Guidelines
```typescript
// Phase 1: Foundation - Initial setup and planning
// Phase 2: Content Development - Core content creation
// Phase 3: Pilot Preparation - Testing and refinement
// Phase 4: Pilot & Iteration - Implementation and feedback
// Phase 5: Launch Ready - Final preparations and launch
```

## 🎨 Complete Example

Here's a complete example of adding a new analytics task:

### Before (existing tasks end at T109)
```typescript
{
  id: "T109",
  name: "Documentación final y entrega",
  nameEn: "Final documentation and delivery",
  assignee: "Aldo",
  hours: 4,
  difficulty: 2,
  phase: 5,
  section: "Gestión del Proyecto",
  sectionEn: "Project Management",
  dependencies: ["T100", "T105", "T108"]
}
```

### After (adding new task T110)
```typescript
{
  id: "T109",
  name: "Documentación final y entrega",
  nameEn: "Final documentation and delivery", 
  assignee: "Aldo",
  hours: 4,
  difficulty: 2,
  phase: 5,
  section: "Gestión del Proyecto",
  sectionEn: "Project Management",
  dependencies: ["T100", "T105", "T108"]
},
{
  id: "T110",
  name: "Sistema de retroalimentación post-lanzamiento",
  nameEn: "Post-launch feedback system",
  assignee: "Nuri",
  hours: 8,
  difficulty: 3,
  phase: 5,
  section: "Análisis y Mejora Continua",
  sectionEn: "Analysis and Continuous Improvement",
  dependencies: ["T109"]
}
```

## 🚨 Common Mistakes

### ID Conflicts
```typescript
// ❌ Wrong: Duplicate ID
{
  id: "T089", // This ID already exists!
  name: "Nueva tarea",
  // ...
}

// ✅ Correct: Use next available ID
{
  id: "T110", // New unique ID
  name: "Nueva tarea", 
  // ...
}
```

### Missing Translations
```typescript
// ❌ Wrong: Only Spanish name
{
  id: "T110",
  name: "Configurar sistema",
  nameEn: "", // Missing English translation!
  // ...
}

// ✅ Correct: Both languages
{
  id: "T110", 
  name: "Configurar sistema",
  nameEn: "Configure system",
  // ...
}
```

### Invalid Dependencies
```typescript
// ❌ Wrong: Circular dependency
{
  id: "T110",
  dependencies: ["T111"] // T111 depends on T110!
}

// ❌ Wrong: Non-existent task
{
  id: "T110",
  dependencies: ["T999"] // T999 doesn't exist!
}

// ✅ Correct: Valid, existing tasks
{
  id: "T110",
  dependencies: ["T089", "T095"]
}
```

## 🔍 Troubleshooting

### Task Not Appearing
1. **Check Syntax**: Ensure valid TypeScript syntax
2. **Verify ID**: Confirm ID is unique and properly formatted
3. **Check Phase**: Ensure phase number is 1-5
4. **Restart Server**: Sometimes requires development server restart

### TypeScript Errors
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Common issues:
# - Missing required fields
# - Wrong data types
# - Invalid enum values
```

### Build Failures
```bash
# If build fails after adding tasks
npm run build

# Check console for specific errors
# Usually missing commas or invalid syntax
```

## 📊 Data Validation

### Automatic Validation
The application automatically validates:
- ✅ Unique task IDs
- ✅ Valid team member assignments
- ✅ Proper phase numbers (1-5)
- ✅ Difficulty levels (1-5)
- ✅ Positive hour values

### Manual Verification Checklist
- [ ] Task ID is unique and follows pattern (T###)
- [ ] Both Spanish and English names provided
- [ ] Assignee exists in team member list
- [ ] Hours and difficulty are reasonable
- [ ] Phase is appropriate for task type
- [ ] Dependencies exist and don't create cycles
- [ ] Section names are consistent

## 🎯 Next Steps

After successfully adding tasks:

1. **Add More Tasks**: Practice with additional tasks
2. **Modify Existing Tasks**: Learn to update existing data
3. **Create Components**: Move to [Creating Components](./creating-components.md)
4. **Implement Features**: Try [Implementing Features](./implementing-features.md)

## 💡 Pro Tips

### Batch Adding Tasks
```typescript
// Add multiple related tasks at once
const newTasks = [
  {
    id: "T110",
    name: "Configurar base de datos",
    nameEn: "Set up database",
    // ... task details
  },
  {
    id: "T111", 
    name: "Implementar API endpoints",
    nameEn: "Implement API endpoints",
    // ... task details
  },
  {
    id: "T112",
    name: "Crear interfaz de usuario",
    nameEn: "Create user interface", 
    // ... task details
  }
];
```

### Task Planning Template
```typescript
// Use this template for consistent task creation
{
  id: "T###",                    // Next available ID
  name: "[Spanish task name]",   // Clear, actionable name
  nameEn: "[English task name]", // Accurate translation
  assignee: "[Team member]",     // Based on expertise
  hours: #,                      // Realistic estimate
  difficulty: #,                 // 1-5 based on complexity
  phase: #,                      // Logical project phase
  section: "[Spanish section]",  // Consistent grouping
  sectionEn: "[English section]", // Matching translation
  dependencies: ["T###"]         // Logical prerequisites
}
```

Congratulations! You now know how to add new tasks to the MADLAB project. This skill is fundamental for extending and maintaining the project data.