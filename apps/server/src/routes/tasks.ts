import { FastifyInstance } from 'fastify';
import { eq, and, sql, inArray } from 'drizzle-orm';
import { db } from '../config/database.js';
import { tasks, users, projects } from '../db/schema.js';

export async function taskRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/tasks
   * Get tasks with optional filtering
   * Query params: projectId, assigneeId, status, phase, difficulty
   */
  fastify.get<{
    Querystring: {
      projectId?: string;
      assigneeId?: string;
      status?: string;
      phase?: string;
      difficulty?: string;
    };
  }>('/tasks', async (request, reply) => {
    try {
      const { projectId, assigneeId, status, phase, difficulty } = request.query;

      // Build WHERE conditions
      const conditions = [];
      if (projectId) conditions.push(eq(tasks.projectId, projectId));
      if (assigneeId) conditions.push(eq(tasks.assigneeId, assigneeId));
      if (status) conditions.push(eq(tasks.status, status as any));
      if (phase) conditions.push(eq(tasks.phase, parseInt(phase)));
      if (difficulty) conditions.push(eq(tasks.difficulty, difficulty as any));

      // Query tasks with assignee details
      const allTasks = await db
        .select({
          task: tasks,
          assignee: {
            id: users.id,
            name: users.name,
            email: users.email,
            avatar: users.avatar,
          },
        })
        .from(tasks)
        .leftJoin(users, eq(tasks.assigneeId, users.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      // Transform to match frontend expectations
      const transformedTasks = allTasks.map(({ task, assignee }) => ({
        ...task,
        assignee: assignee?.name || 'Unassigned',
        assigneeDetails: assignee,
      }));

      return reply.send({
        success: true,
        data: transformedTasks,
        count: transformedTasks.length,
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Failed to fetch tasks',
      });
    }
  });

  /**
   * GET /api/tasks/:id
   * Get a single task with full details
   */
  fastify.get<{ Params: { id: string } }>('/tasks/:id', async (request, reply) => {
    try {
      const { id } = request.params;

      const result = await db
        .select({
          task: tasks,
          assignee: {
            id: users.id,
            name: users.name,
            email: users.email,
            avatar: users.avatar,
          },
          project: {
            id: projects.id,
            name: projects.name,
            nameEn: projects.nameEn,
          },
        })
        .from(tasks)
        .leftJoin(users, eq(tasks.assigneeId, users.id))
        .leftJoin(projects, eq(tasks.projectId, projects.id))
        .where(eq(tasks.id, id))
        .limit(1);

      if (!result.length) {
        return reply.code(404).send({
          success: false,
          error: 'Task not found',
        });
      }

      const { task, assignee, project } = result[0];

      return reply.send({
        success: true,
        data: {
          ...task,
          assignee: assignee?.name || 'Unassigned',
          assigneeDetails: assignee,
          project,
        },
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Failed to fetch task',
      });
    }
  });

  /**
   * POST /api/tasks
   * Create a new task
   */
  fastify.post<{
    Body: {
      projectId: string;
      title: string;
      titleEn?: string;
      description?: string;
      descriptionEn?: string;
      assigneeId?: string;
      status?: string;
      estimatedHours?: number;
      difficulty?: string;
      phase?: number;
      section?: string;
      sectionEn?: string;
      startDate?: string;
      endDate?: string;
      dependencies?: string[];
      metadata?: Record<string, any>;
    };
  }>('/tasks', async (request, reply) => {
    try {
      const newTask = await db
        .insert(tasks)
        .values({
          projectId: request.body.projectId,
          title: request.body.title,
          titleEn: request.body.titleEn,
          description: request.body.description,
          descriptionEn: request.body.descriptionEn,
          assigneeId: request.body.assigneeId,
          status: (request.body.status as any) || 'not-started',
          estimatedHours: request.body.estimatedHours,
          difficulty: request.body.difficulty as any,
          phase: request.body.phase || 1,
          section: request.body.section,
          sectionEn: request.body.sectionEn,
          startDate: request.body.startDate ? new Date(request.body.startDate) : undefined,
          endDate: request.body.endDate ? new Date(request.body.endDate) : undefined,
          dependencies: request.body.dependencies || [],
          metadata: request.body.metadata || {},
        })
        .returning();

      return reply.code(201).send({
        success: true,
        data: newTask[0],
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Failed to create task',
      });
    }
  });

  /**
   * PATCH /api/tasks/:id
   * Update a task (status, progress, dates, metadata, etc.)
   */
  fastify.patch<{
    Params: { id: string };
    Body: {
      title?: string;
      titleEn?: string;
      description?: string;
      status?: string;
      assigneeId?: string;
      estimatedHours?: number;
      actualHours?: number;
      difficulty?: string;
      phase?: number;
      progress?: number;
      startDate?: string;
      endDate?: string;
      completedAt?: string;
      dependencies?: string[];
      metadata?: Record<string, any>;
    };
  }>('/tasks/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const updates: any = {};

      // Only update fields that were provided
      if (request.body.title !== undefined) updates.title = request.body.title;
      if (request.body.titleEn !== undefined) updates.titleEn = request.body.titleEn;
      if (request.body.description !== undefined) updates.description = request.body.description;
      if (request.body.status !== undefined) updates.status = request.body.status;
      if (request.body.assigneeId !== undefined) updates.assigneeId = request.body.assigneeId;
      if (request.body.estimatedHours !== undefined) updates.estimatedHours = request.body.estimatedHours;
      if (request.body.actualHours !== undefined) updates.actualHours = request.body.actualHours;
      if (request.body.difficulty !== undefined) updates.difficulty = request.body.difficulty;
      if (request.body.phase !== undefined) updates.phase = request.body.phase;
      if (request.body.progress !== undefined) updates.progress = request.body.progress;
      if (request.body.dependencies !== undefined) updates.dependencies = request.body.dependencies;
      if (request.body.metadata !== undefined) updates.metadata = request.body.metadata;

      // Handle dates
      if (request.body.startDate !== undefined) {
        updates.startDate = request.body.startDate ? new Date(request.body.startDate) : null;
      }
      if (request.body.endDate !== undefined) {
        updates.endDate = request.body.endDate ? new Date(request.body.endDate) : null;
      }
      if (request.body.completedAt !== undefined) {
        updates.completedAt = request.body.completedAt ? new Date(request.body.completedAt) : null;
      }

      // Auto-set completedAt when status changes to completed
      if (request.body.status === 'completed' && !updates.completedAt) {
        updates.completedAt = new Date();
        updates.progress = 100;
      }

      // Always update the updatedAt timestamp
      updates.updatedAt = new Date();

      const updatedTask = await db
        .update(tasks)
        .set(updates)
        .where(eq(tasks.id, id))
        .returning();

      if (!updatedTask.length) {
        return reply.code(404).send({
          success: false,
          error: 'Task not found',
        });
      }

      return reply.send({
        success: true,
        data: updatedTask[0],
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Failed to update task',
      });
    }
  });

  /**
   * DELETE /api/tasks/:id
   * Delete a task
   */
  fastify.delete<{ Params: { id: string } }>('/tasks/:id', async (request, reply) => {
    try {
      const { id } = request.params;

      const deleted = await db.delete(tasks).where(eq(tasks.id, id)).returning();

      if (!deleted.length) {
        return reply.code(404).send({
          success: false,
          error: 'Task not found',
        });
      }

      return reply.send({
        success: true,
        message: 'Task deleted successfully',
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Failed to delete task',
      });
    }
  });

  /**
   * PATCH /api/tasks/bulk
   * Bulk update tasks (for drag-and-drop, bulk status changes, etc.)
   */
  fastify.patch<{
    Body: {
      updates: Array<{
        id: string;
        status?: string;
        progress?: number;
        startDate?: string;
        endDate?: string;
        phase?: number;
      }>;
    };
  }>('/tasks/bulk', async (request, reply) => {
    try {
      const { updates } = request.body;

      // Process each update
      const results = await Promise.all(
        updates.map(async (update) => {
          const updateData: any = { updatedAt: new Date() };

          if (update.status) updateData.status = update.status;
          if (update.progress !== undefined) updateData.progress = update.progress;
          if (update.phase !== undefined) updateData.phase = update.phase;
          if (update.startDate) updateData.startDate = new Date(update.startDate);
          if (update.endDate) updateData.endDate = new Date(update.endDate);

          return db.update(tasks).set(updateData).where(eq(tasks.id, update.id)).returning();
        }),
      );

      return reply.send({
        success: true,
        data: results.flat(),
        count: results.length,
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Failed to bulk update tasks',
      });
    }
  });
}
