import { pgTable, uuid, text, timestamp, integer, jsonb, varchar, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// ENUMS
// ============================================================================

export const projectStatusEnum = pgEnum('project_status', [
  'planning',
  'active',
  'on-hold',
  'completed',
  'archived'
]);

export const taskStatusEnum = pgEnum('task_status', [
  'not-started',
  'in-progress',
  'completed',
  'blocked',
  'cancelled'
]);

export const taskDifficultyEnum = pgEnum('task_difficulty', [
  '1', '2', '3', '4', '5'
]);

// ============================================================================
// TABLES
// ============================================================================

/**
 * USERS - Local cache of user profiles from Janua IdP
 */
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  // From Janua IdP
  januaId: varchar('janua_id', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  avatar: text('avatar'),

  // Metadata
  role: varchar('role', { length: 50 }).default('member'),
  isActive: boolean('is_active').default(true).notNull(),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastSeenAt: timestamp('last_seen_at'),
});

/**
 * PROJECTS - Educational projects/programs
 */
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Basic info
  name: varchar('name', { length: 255 }).notNull(),
  nameEn: varchar('name_en', { length: 255 }),
  description: text('description'),
  descriptionEn: text('description_en'),

  // Status and dates
  status: projectStatusEnum('status').default('planning').notNull(),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),

  // Ownership
  createdBy: uuid('created_by').references(() => users.id).notNull(),

  // Metadata (flexible JSON storage for future extensibility)
  metadata: jsonb('metadata'),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * TASKS - Individual actionable items within projects
 */
export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Project relationship
  projectId: uuid('project_id').references(() => projects.id).notNull(),

  // Task details
  title: varchar('title', { length: 255 }).notNull(),
  titleEn: varchar('title_en', { length: 255 }),
  description: text('description'),
  descriptionEn: text('description_en'),

  // Status and assignment
  status: taskStatusEnum('status').default('not-started').notNull(),
  assigneeId: uuid('assignee_id').references(() => users.id),

  // Work estimation
  estimatedHours: integer('estimated_hours'),
  difficulty: taskDifficultyEnum('difficulty'),

  // Organization
  phase: integer('phase').default(1),
  section: varchar('section', { length: 255 }),
  sectionEn: varchar('section_en', { length: 255 }),

  // Progress tracking
  progress: integer('progress').default(0), // 0-100
  actualHours: integer('actual_hours'),

  // Dates
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  completedAt: timestamp('completed_at'),

  // Dependencies (array of task IDs stored as JSONB)
  dependencies: jsonb('dependencies').$type<string[]>().default([]),

  // Flexible metadata for future extensibility
  metadata: jsonb('metadata').$type<{
    tags?: string[];
    priority?: 'low' | 'medium' | 'high' | 'critical';
    manualStatus?: string;
    notes?: string;
    [key: string]: any;
  }>(),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * TASK_COMMENTS - Discussion threads on tasks
 */
export const taskComments = pgTable('task_comments', {
  id: uuid('id').primaryKey().defaultRandom(),

  taskId: uuid('task_id').references(() => tasks.id).notNull(),
  authorId: uuid('author_id').references(() => users.id).notNull(),

  content: text('content').notNull(),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * PROJECT_MEMBERS - Team membership in projects
 */
export const projectMembers = pgTable('project_members', {
  id: uuid('id').primaryKey().defaultRandom(),

  projectId: uuid('project_id').references(() => projects.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),

  role: varchar('role', { length: 50 }).default('member').notNull(), // 'owner', 'admin', 'member', 'viewer'

  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

// ============================================================================
// RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ many }) => ({
  createdProjects: many(projects),
  assignedTasks: many(tasks),
  comments: many(taskComments),
  projectMemberships: many(projectMembers),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  creator: one(users, {
    fields: [projects.createdBy],
    references: [users.id],
  }),
  tasks: many(tasks),
  members: many(projectMembers),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  assignee: one(users, {
    fields: [tasks.assigneeId],
    references: [users.id],
  }),
  comments: many(taskComments),
}));

export const taskCommentsRelations = relations(taskComments, ({ one }) => ({
  task: one(tasks, {
    fields: [taskComments.taskId],
    references: [tasks.id],
  }),
  author: one(users, {
    fields: [taskComments.authorId],
    references: [users.id],
  }),
}));

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectMembers.userId],
    references: [users.id],
  }),
}));

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;

export type TaskComment = typeof taskComments.$inferSelect;
export type NewTaskComment = typeof taskComments.$inferInsert;

export type ProjectMember = typeof projectMembers.$inferSelect;
export type NewProjectMember = typeof projectMembers.$inferInsert;
