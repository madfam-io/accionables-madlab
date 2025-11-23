# Frontend Integration Guide

## Overview

The frontend has been refactored to use **TanStack Query (React Query)** + **Axios** for data fetching instead of static JSON. This guide shows you how to integrate the new hooks into your existing components.

## ✅ What's Been Set Up

### 1. Infrastructure
- ✅ TanStack Query and Axios installed
- ✅ Vite proxy configured (`/api` → `http://localhost:3001`)
- ✅ QueryClient initialized in `main.tsx`

### 2. API Layer
- ✅ `src/api/types.ts` - TypeScript types matching backend schema
- ✅ `src/api/mappers.ts` - Functions to convert API ↔ Frontend formats
- ✅ `src/api/client.ts` - Axios instance + API methods

### 3. React Query Hooks
- ✅ `src/hooks/useTasks.ts` - Task queries and mutations with optimistic updates
- ✅ `src/hooks/useProjects.ts` - Project queries and mutations

### 4. Zustand Store Refactor
- ✅ `src/stores/appStore.ts` - Now only manages UI state (filters, viewMode, theme, etc.)
- ✅ `src/utils/ganttScheduling.ts` - Extracted Gantt scheduling utilities
- ✅ Static task data removed from store

## 🔄 Migration Pattern

### Before (Static Data)
```tsx
import { useAppStore } from '@/stores/appStore';

function Dashboard() {
  const tasks = useAppStore(state => state.tasks);
  const filteredTasks = useAppStore(state => state.filteredTasks);
  const updateTaskStatus = useAppStore(state => state.updateTaskStatus);

  // Component using static data...
}
```

### After (React Query)
```tsx
import { useTasks, useUpdateTask } from '@/hooks/useTasks';
import { useAppStore, filterTasks } from '@/stores/appStore';

function Dashboard() {
  // Get tasks from API
  const { data: tasks = [], isLoading, error } = useTasks();

  // Get UI filters from Zustand
  const filters = useAppStore(state => state.filters);
  const language = useAppStore(state => state.language);

  // Apply filtering
  const filteredTasks = filterTasks(tasks, filters);

  // Get mutation for updates
  const { mutate: updateTask } = useUpdateTask();

  // Handle loading state
  if (isLoading) return <div>Loading tasks...</div>;
  if (error) return <div>Error loading tasks</div>;

  // Component using API data...
}
```

## 📚 Integration Examples

### Example 1: Task List Component

```tsx
import { useTasks, useUpdateTask } from '@/hooks/useTasks';
import { useAppStore, filterTasks } from '@/stores/appStore';
import { Task, TaskStatus } from '@/data/types';

function TaskList() {
  // Fetch tasks from API
  const { data: tasks = [], isLoading } = useTasks();

  // Get filters from Zustand (UI state)
  const filters = useAppStore(state => state.filters);
  const setFilter = useAppStore(state => state.setFilter);
  const language = useAppStore(state => state.language);

  // Apply client-side filtering
  const filteredTasks = filterTasks(tasks, filters);

  // Get update mutation with optimistic updates
  const { mutate: updateTask } = useUpdateTask();

  // Handler for status change
  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    updateTask({
      id: taskId,
      updates: { manualStatus: status }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h2>Tasks ({filteredTasks.length})</h2>
      {filteredTasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onStatusChange={(status) => handleStatusChange(task.id, status)}
        />
      ))}
    </div>
  );
}
```

### Example 2: Kanban Board (Drag & Drop)

```tsx
import { useTasks, useUpdateTask } from '@/hooks/useTasks';
import { useAppStore } from '@/stores/appStore';

function KanbanBoard() {
  const { data: tasks = [], isLoading } = useTasks();
  const filters = useAppStore(state => state.filters);

  // Optimistic updates are CRUCIAL for drag-and-drop!
  const { mutate: updateTask } = useUpdateTask();

  const handleDragEnd = (taskId: string, newStatus: TaskStatus) => {
    // This will update the cache immediately before server responds
    updateTask({
      id: taskId,
      updates: { manualStatus: newStatus }
    });
  };

  // Group tasks by status
  const tasksByStatus = {
    not_started: tasks.filter(t => t.manualStatus === 'not_started'),
    in_progress: tasks.filter(t => t.manualStatus === 'in_progress'),
    completed: tasks.filter(t => t.manualStatus === 'completed'),
  };

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="kanban-board">
      <Column status="not_started" tasks={tasksByStatus.not_started} onDrop={handleDragEnd} />
      <Column status="in_progress" tasks={tasksByStatus.in_progress} onDrop={handleDragEnd} />
      <Column status="completed" tasks={tasksByStatus.completed} onDrop={handleDragEnd} />
    </div>
  );
}
```

### Example 3: Gantt Chart

```tsx
import { useTasks } from '@/hooks/useTasks';
import { useAppStore, filterTasks } from '@/stores/appStore';
import { scheduleProject, manualScheduleProject } from '@/utils/ganttScheduling';
import { useMemo } from 'react';

function GanttChart() {
  const { data: tasks = [], isLoading } = useTasks();
  const filters = useAppStore(state => state.filters);
  const ganttConfig = useAppStore(state => state.ganttConfig);

  // Apply filters
  const filteredTasks = useMemo(
    () => filterTasks(tasks, filters),
    [tasks, filters]
  );

  // Schedule tasks for Gantt display
  const ganttTasks = useMemo(() => {
    if (filteredTasks.length === 0) return [];

    return ganttConfig.autoScheduling
      ? scheduleProject(filteredTasks, ganttConfig.startDate, ganttConfig.showCriticalPath)
      : manualScheduleProject(filteredTasks, ganttConfig.startDate);
  }, [filteredTasks, ganttConfig]);

  if (isLoading) {
    return <div>Loading Gantt chart...</div>;
  }

  return (
    <div className="gantt-chart">
      {/* Render ganttTasks */}
      {ganttTasks.map(task => (
        <GanttRow key={task.id} task={task} />
      ))}
    </div>
  );
}
```

### Example 4: Task Filtering

```tsx
import { useTasks } from '@/hooks/useTasks';
import { useAppStore, filterTasks } from '@/stores/appStore';

function FilteredTaskView() {
  // Option 1: Client-side filtering (all tasks loaded, filtered in browser)
  const { data: allTasks = [] } = useTasks();
  const filters = useAppStore(state => state.filters);
  const filteredTasks = filterTasks(allTasks, filters);

  // Option 2: Server-side filtering (only fetch what you need)
  const phase = useAppStore(state => state.filters.phase);
  const { data: phaseTasks = [] } = useTasks({
    phase: phase || undefined
  });

  // Use either filteredTasks or phaseTasks depending on your needs
  return <TaskList tasks={filteredTasks} />;
}
```

### Example 5: Creating a New Task

```tsx
import { useCreateTask } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';

function CreateTaskForm() {
  const { data: projects = [] } = useProjects();
  const { mutate: createTask, isPending } = useCreateTask();

  const handleSubmit = (formData: any) => {
    createTask({
      projectId: projects[0]?.id, // Assuming first project
      title: formData.title,
      titleEn: formData.titleEn,
      estimatedHours: formData.hours,
      difficulty: formData.difficulty,
      phase: formData.phase,
      metadata: {
        section: formData.section,
        sectionEn: formData.sectionEn,
      }
    }, {
      onSuccess: () => {
        console.log('Task created successfully!');
        // Form will auto-refresh due to query invalidation
      },
      onError: (error) => {
        console.error('Failed to create task:', error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
}
```

## 🎯 Key Concepts

### 1. Separation of Concerns

- **React Query**: Manages server state (tasks, projects)
- **Zustand**: Manages UI state (filters, theme, viewMode, collapsedPhases)
- **Components**: Combine both for rendering

### 2. Optimistic Updates

The `useUpdateTask` hook implements optimistic updates:

```tsx
const { mutate: updateTask } = useUpdateTask();

// This updates the UI INSTANTLY, then syncs with server
updateTask({
  id: 'task-123',
  updates: { manualStatus: 'completed' }
});
```

**How it works:**
1. Mutation runs `onMutate` → Updates cache immediately
2. API request sent to backend
3. If successful → Cache stays updated
4. If fails → Rollback to previous state

This is **critical** for Gantt chart interactions and drag-and-drop!

### 3. Type Safety

All API responses are mapped to frontend types:

```tsx
// API returns: { title, titleEn, estimatedHours, difficulty: 'easy' }
// Mapper converts to: { name, nameEn, hours, difficulty: 1 }
```

This means **existing UI components don't need to change** - they still receive the same data structure!

### 4. Loading & Error States

Always handle these states:

```tsx
const { data: tasks, isLoading, error } = useTasks();

if (isLoading) return <LoadingSkeleton />;
if (error) return <ErrorMessage error={error} />;

// Now safe to use tasks
return <TaskList tasks={tasks} />;
```

### 5. Filtering: Client vs Server

**Client-side filtering** (current approach):
```tsx
const { data: allTasks = [] } = useTasks();
const filteredTasks = filterTasks(allTasks, filters);
```
- ✅ Instant filtering (no network request)
- ✅ Works offline with cached data
- ❌ Loads all 110 tasks upfront

**Server-side filtering** (optional optimization):
```tsx
const { data: tasks = [] } = useTasks({
  phase: 1,
  assigneeId: 'uuid-here'
});
```
- ✅ Only loads needed data
- ✅ Better for large datasets
- ❌ Network request on filter change

Choose based on your needs. For 110 tasks, client-side filtering is fine.

## 🛠️ Migration Checklist

### For Each Component:

- [ ] Replace `useAppStore(state => state.tasks)` with `useTasks()`
- [ ] Replace `useAppStore(state => state.filteredTasks)` with `filterTasks(tasks, filters)`
- [ ] Replace `updateTaskStatus()` with `useUpdateTask().mutate()`
- [ ] Add loading state handling: `if (isLoading) return <LoadingSkeleton />`
- [ ] Add error state handling: `if (error) return <ErrorMessage />`
- [ ] Keep Zustand for UI state: filters, theme, viewMode, etc.
- [ ] Test optimistic updates work correctly (drag & drop, status changes)

### Key Files to Update:

1. **Dashboard Component** - Main task list view
2. **Kanban Board** - Drag & drop interface
3. **Gantt Chart** - Timeline view
4. **Task Filters** - Filter controls
5. **Team View** - Task grouping by assignee

## 📝 Testing the Integration

### 1. Start the Backend

```bash
docker compose up -d
docker compose exec server npm run db:push
docker compose exec server npm run seed
```

### 2. Start the Frontend

```bash
cd apps/client
npm run dev
```

### 3. Verify API Connection

Open browser DevTools → Network tab:
- You should see requests to `/api/tasks`
- Response should contain 110 tasks
- Check that mapper is working (tasks have `name`, `hours`, not `title`, `estimatedHours`)

### 4. Test Interactions

- ✅ Tasks load on page load
- ✅ Filtering works (search, assignee, phase, difficulty)
- ✅ Status updates work instantly (optimistic)
- ✅ Page refresh preserves UI state (Zustand persist)
- ✅ Gantt chart schedules correctly

## 🚨 Common Issues

### Issue: "Cannot read property 'map' of undefined"

**Cause**: Tasks not loaded yet

**Fix**: Add default value
```tsx
const { data: tasks = [] } = useTasks(); // ← Note the = []
```

### Issue: Infinite re-renders

**Cause**: Filtering in render without memoization

**Fix**: Use `useMemo`
```tsx
const filteredTasks = useMemo(
  () => filterTasks(tasks, filters),
  [tasks, filters]
);
```

### Issue: Updates not persisting

**Cause**: Mutation not invalidating cache

**Fix**: Check hooks - they should call `queryClient.invalidateQueries()`

### Issue: CORS errors

**Cause**: Vite proxy not working

**Fix**: Restart dev server after changing `vite.config.ts`

### Issue: Stale data after update

**Cause**: Cache not invalidated

**Fix**: Mutations should invalidate queries:
```tsx
onSettled: () => {
  queryClient.invalidateQueries({ queryKey: taskKeys.all });
}
```

## 🎉 Benefits of This Architecture

1. **Performance**: Only fetch what you need
2. **Offline Support**: Cached data works offline
3. **Optimistic Updates**: Instant UI feedback
4. **Type Safety**: End-to-end TypeScript
5. **Separation**: UI state separate from server state
6. **Scalability**: Easy to add new features (pagination, infinite scroll)
7. **Developer Experience**: React Query DevTools for debugging

## 🔗 Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Optimistic Updates Guide](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)
- [Axios Docs](https://axios-http.com/)

## 📞 Next Steps

1. Update your Dashboard component first (easiest)
2. Then Kanban board (test optimistic updates)
3. Then Gantt chart (most complex)
4. Test thoroughly at each step
5. Remove `src/data/projectData.ts.bak` when done

---

**Status**: Infrastructure complete ✅
**Next**: Integrate hooks into components 🔄
