import { FastifyInstance } from 'fastify';
import { eq, count } from 'drizzle-orm';
import { db } from '../config/database.js';
import { projects, tasks, projectMembers, users } from '../db/schema.js';

export async function projectRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/projects
   * Get all projects with member counts and task statistics
   */
  fastify.get('/projects', async (request, reply) => {
    try {
      // Get all projects
      const allProjects = await db.select().from(projects);

      // Enhance with statistics
      const projectsWithStats = await Promise.all(
        allProjects.map(async (project) => {
          // Count tasks
          const taskCount = await db
            .select({ count: count() })
            .from(tasks)
            .where(eq(tasks.projectId, project.id));

          // Count members
          const memberCount = await db
            .select({ count: count() })
            .from(projectMembers)
            .where(eq(projectMembers.projectId, project.id));

          // Get tasks breakdown by status
          const tasksByStatus = await db
            .select({
              status: tasks.status,
              count: count(),
            })
            .from(tasks)
            .where(eq(tasks.projectId, project.id))
            .groupBy(tasks.status);

          return {
            ...project,
            stats: {
              totalTasks: taskCount[0]?.count || 0,
              memberCount: memberCount[0]?.count || 0,
              tasksByStatus: tasksByStatus.reduce(
                (acc, { status, count }) => {
                  acc[status] = count;
                  return acc;
                },
                {} as Record<string, number>,
              ),
            },
          };
        }),
      );

      return reply.send({
        success: true,
        data: projectsWithStats,
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Failed to fetch projects',
      });
    }
  });

  /**
   * GET /api/projects/:id
   * Get a single project with full details
   */
  fastify.get<{ Params: { id: string } }>('/projects/:id', async (request, reply) => {
    try {
      const { id } = request.params;

      // Get project
      const project = await db
        .select()
        .from(projects)
        .where(eq(projects.id, id))
        .limit(1);

      if (!project.length) {
        return reply.code(404).send({
          success: false,
          error: 'Project not found',
        });
      }

      // Get project members with user details
      const members = await db
        .select({
          id: projectMembers.id,
          role: projectMembers.role,
          joinedAt: projectMembers.joinedAt,
          user: {
            id: users.id,
            name: users.name,
            email: users.email,
            avatar: users.avatar,
          },
        })
        .from(projectMembers)
        .leftJoin(users, eq(projectMembers.userId, users.id))
        .where(eq(projectMembers.projectId, id));

      // Get task count
      const taskCount = await db
        .select({ count: count() })
        .from(tasks)
        .where(eq(tasks.projectId, id));

      return reply.send({
        success: true,
        data: {
          ...project[0],
          members,
          taskCount: taskCount[0]?.count || 0,
        },
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Failed to fetch project',
      });
    }
  });

  /**
   * POST /api/projects
   * Create a new project
   */
  fastify.post<{
    Body: {
      name: string;
      nameEn?: string;
      description?: string;
      descriptionEn?: string;
      startDate?: string;
      endDate?: string;
      metadata?: Record<string, any>;
    };
  }>('/projects', async (request, reply) => {
    try {
      // TODO: Get actual user from JWT
      // For now, use a placeholder
      const createdBy = 'mock-user-id-12345'; // Replace with actual user ID from JWT

      const newProject = await db
        .insert(projects)
        .values({
          name: request.body.name,
          nameEn: request.body.nameEn,
          description: request.body.description,
          descriptionEn: request.body.descriptionEn,
          startDate: request.body.startDate ? new Date(request.body.startDate) : undefined,
          endDate: request.body.endDate ? new Date(request.body.endDate) : undefined,
          createdBy,
          metadata: request.body.metadata,
        })
        .returning();

      return reply.code(201).send({
        success: true,
        data: newProject[0],
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Failed to create project',
      });
    }
  });
}
