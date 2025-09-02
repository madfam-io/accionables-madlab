# Task Management System Documentation

## Overview

The MADLAB task management system provides comprehensive tools for organizing, tracking, and visualizing project tasks across 5 phases and 109 individual tasks.

## 📊 Task Data Structure

### Task Model
```typescript
interface Task {
  id: string;                    // Unique identifier
  name: string;                   // Spanish task name
  nameEn: string;                 // English task name
  assignee: string;               // Team member name
  hours: number;                  // Estimated hours
  difficulty: 1 | 2 | 3 | 4 | 5; // Difficulty level
  dependencies: string[];         // Task IDs this depends on
  phase: number;                  // Project phase (1-5)
  section: string;                // Spanish section name
  sectionEn: string;              // English section name
  
  // Runtime properties
  manualStatus?: TaskStatus;      // User-set status
  weekNumber?: number;            // Calculated week
  startDate?: Date;               // Calculated start
  endDate?: Date;                 // Calculated end
}
```

### Task Status
```typescript
type TaskStatus = 
  | 'not_started'  // Task not begun
  | 'planning'     // In planning phase
  | 'in_progress'  // Currently working
  | 'review'       // Under review
  | 'completed';   // Finished
```

## 🔍 Task Filtering

### Available Filters

#### Search Filter
- Real-time text search
- Searches task names (both languages)
- Case-insensitive matching
- Instant results

#### Assignee Filter
- Filter by team member
- Includes "All" for team tasks
- Dropdown selection
- Shows task count per member

#### Difficulty Filter
- 5 difficulty levels
- Visual star indicators
- Range from 1 (easy) to 5 (hard)
- Color-coded display

#### Phase Filter
- Filter by project phase (1-5)
- Shows phase date ranges
- Collapsible phase sections
- Phase progress indicators

#### Duration Filter
- **Short**: < 4 hours
- **Medium**: 4-8 hours
- **Long**: > 8 hours
- Quick task categorization

### Filter Implementation
```typescript
// Using filters in component
const { filters, setFilter, clearFilters } = useAppStore();

// Apply search filter
setFilter('search', searchTerm);

// Apply assignee filter
setFilter('assignee', 'Aldo');

// Clear all filters
clearFilters();
```

## 📁 Task Grouping

### Grouping Options

#### By Phase
- Groups tasks into 5 project phases
- Shows phase timeline
- Displays phase progress
- Collapsible sections

#### By Week
- Groups by ISO week numbers
- Shows week date ranges
- Weekly workload view
- Timeline visualization

#### By Assignee
- Groups by team member
- Shows member workload
- Individual progress tracking
- Team comparison view

#### By Difficulty
- Groups by difficulty level (1-5)
- Complexity distribution
- Resource planning view
- Skill matching

### Grouping Implementation
```typescript
// Set grouping option
const { groupingOption, setGroupingOption } = useAppStore();
setGroupingOption('phase'); // or 'week', 'assignee', 'difficulty'

// Access grouped tasks
const { groupedTasks } = useAppStore();
groupedTasks.forEach((tasks, groupKey) => {
  console.log(`Group ${groupKey}: ${tasks.length} tasks`);
});
```

## 📅 Task Scheduling

### Automatic Scheduling
The system intelligently schedules tasks based on:

1. **Phase Boundaries**: Tasks stay within phase dates
2. **Dependencies**: Dependent tasks scheduled after prerequisites
3. **Workload Balance**: Even distribution across weeks
4. **Team Capacity**: Considers member availability
5. **Priority**: Critical path optimization

### Scheduling Algorithm
```typescript
function calculateOptimalTaskWeek(
  task: Task,
  allPhaseTasks: Task[],
  phaseWeekRange: { start: number; end: number }
): number {
  // 1. Check dependencies
  const dependentWeek = calculateDependencyWeek(task);
  
  // 2. Balance workload
  const balancedWeek = findLeastLoadedWeek(phaseWeekRange);
  
  // 3. Respect phase boundaries
  const constrainedWeek = Math.max(
    phaseWeekRange.start,
    Math.min(dependentWeek || balancedWeek, phaseWeekRange.end)
  );
  
  return constrainedWeek;
}
```

### Manual Scheduling
Users can override automatic scheduling:
- Drag tasks in Gantt view
- Set custom dates
- Adjust dependencies
- Rebalance workload

## 📈 Task Views

### List View
- **Layout**: Vertical task list
- **Grouping**: By phase sections
- **Details**: Full task information
- **Actions**: Quick status updates
- **Best for**: Detailed review

### Grid View
- **Layout**: Card-based grid
- **Display**: Compact task cards
- **Visual**: Color-coded status
- **Responsive**: Adapts to screen size
- **Best for**: Overview scanning

### Gantt View
- **Layout**: Timeline visualization
- **Features**: Dependencies, critical path
- **Interaction**: Drag to reschedule
- **Zoom**: Day/week/month scales
- **Best for**: Timeline planning

## 🎯 Task Status Management

### Status Indicators

#### Visual States
- **Not Started**: Gray/neutral
- **Planning**: Blue
- **In Progress**: Yellow/amber
- **Review**: Purple
- **Completed**: Green
- **Overdue**: Red/pink gradient

### Status Transitions
```
not_started → planning → in_progress → review → completed
     ↓           ↓            ↓           ↓
   (can skip)  (can skip)  (can skip)  (final)
```

### Overdue Detection
Tasks are marked overdue when:
1. Week has passed (status = 'past')
2. Task not marked as completed
3. Visual warning indicators appear

## 📊 Task Metrics

### Individual Task Metrics
- **Duration**: Estimated hours
- **Difficulty**: 1-5 scale
- **Progress**: Status percentage
- **Timeline**: Week assignment

### Aggregate Metrics
- **Total Tasks**: 109
- **Total Hours**: 522.5
- **Average Difficulty**: 3.2
- **Tasks per Phase**: ~22

### Team Metrics
- **Tasks per Member**: 20-24
- **Hours per Member**: 86-116
- **Workload Balance**: ±15%
- **Specialization**: By difficulty

## 🔄 Task Dependencies

### Dependency Types
- **Finish-to-Start**: Most common
- **Milestone Dependencies**: Phase gates
- **Resource Dependencies**: Team availability

### Dependency Visualization
- Gantt chart connection lines
- Blocked task indicators
- Critical path highlighting
- Dependency chains

### Managing Dependencies
```typescript
const task = {
  id: 'task-1',
  dependencies: ['task-2', 'task-3'], // Must complete these first
  // ...
};
```

## 🎨 Task Display Components

### EnhancedTaskCard
Full-featured task display with:
- Status indicators
- Progress bars
- Difficulty stars
- Time estimates
- Action buttons

### TaskCard
Compact task display with:
- Essential information
- Visual status
- Click interactions
- Responsive sizing

### TaskStatusControl
Status management UI with:
- Status dropdown
- Quick actions
- Update history
- Notes field

## 🔍 Task Search

### Search Features
- **Instant Results**: Real-time filtering
- **Multi-field**: Name, assignee, section
- **Fuzzy Matching**: Partial matches
- **Language Agnostic**: Both languages

### Search Implementation
```typescript
const searchTasks = (tasks: Task[], query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return tasks.filter(task => 
    task.name.toLowerCase().includes(lowercaseQuery) ||
    task.nameEn.toLowerCase().includes(lowercaseQuery) ||
    task.assignee.toLowerCase().includes(lowercaseQuery)
  );
};
```

## 📤 Task Export

### Export Formats

#### CSV Export
- Spreadsheet compatible
- All task fields
- Filterable in Excel
- UTF-8 encoding

#### JSON Export
- Complete data structure
- Programmable format
- API integration ready
- Nested relationships

#### PDF Export
- Printable format
- Formatted tables
- Phase grouping
- Professional layout

## 🚀 Performance Optimization

### Rendering Optimization
- Virtual scrolling for long lists
- Memoized components
- Lazy loading views
- Optimized re-renders

### Data Optimization
- Indexed task lookups
- Cached calculations
- Efficient filtering
- Pre-computed values

## 📱 Mobile Experience

### Touch Interactions
- Swipe to change status
- Tap to expand details
- Pinch to zoom (Gantt)
- Pull to refresh

### Responsive Features
- Stacked layouts
- Simplified controls
- Touch-friendly targets
- Optimized data display

## 🔐 Data Persistence

### Local Storage
- Task status updates
- User preferences
- Filter settings
- View selections

### Session Management
- Temporary changes
- Undo/redo support
- Conflict resolution
- Auto-save drafts

---

*For implementation details, see [Task Components](../components/README.md) and [State Management](../api/state-management.md)*