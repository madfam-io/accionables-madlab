import { FastifyInstance } from 'fastify';
import { checkDatabaseConnection } from '../config/database.js';

export async function healthRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/health
   * Health check endpoint for monitoring and load balancers
   */
  fastify.get('/health', async (request, reply) => {
    const dbHealthy = await checkDatabaseConnection();

    const health = {
      status: dbHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbHealthy ? 'connected' : 'disconnected',
      environment: process.env.NODE_ENV || 'development',
    };

    const statusCode = dbHealthy ? 200 : 503;
    return reply.code(statusCode).send(health);
  });

  /**
   * GET /api/health/ready
   * Readiness probe for Kubernetes/container orchestration
   */
  fastify.get('/health/ready', async (request, reply) => {
    const dbHealthy = await checkDatabaseConnection();

    if (dbHealthy) {
      return reply.code(200).send({ ready: true });
    } else {
      return reply.code(503).send({ ready: false, reason: 'database_unavailable' });
    }
  });

  /**
   * GET /api/health/live
   * Liveness probe for Kubernetes/container orchestration
   */
  fastify.get('/health/live', async (request, reply) => {
    return reply.code(200).send({ alive: true });
  });
}
