import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { healthRoutes } from './routes/health.js';
import { projectRoutes } from './routes/projects.js';
import { taskRoutes } from './routes/tasks.js';
import { agentRoutes } from './routes/agents.js';
import { waitlistRoutes } from './routes/waitlist.js';
import { closeDatabaseConnection } from './config/database.js';

const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = process.env.HOST || '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize Fastify
const fastify = Fastify({
  logger: {
    level: NODE_ENV === 'development' ? 'debug' : 'info',
    transport: NODE_ENV === 'development' ? {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    } : undefined,
  },
  disableRequestLogging: false,
  requestIdHeader: 'x-request-id',
  requestIdLogLabel: 'reqId',
});

// Register plugins
await fastify.register(helmet, {
  contentSecurityPolicy: NODE_ENV === 'production',
});

await fastify.register(cors, {
  origin: NODE_ENV === 'development'
    ? ['http://localhost:5173', 'http://localhost:3000']
    : process.env.ALLOWED_ORIGINS?.split(',') || [],
  credentials: true,
});

// Root route
fastify.get('/', async (_request, _reply) => {
  return {
    service: 'MADLAB API',
    version: '2.0.0',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  };
});

// Register routes
await fastify.register(healthRoutes, { prefix: '/api' });
await fastify.register(projectRoutes, { prefix: '/api' });
await fastify.register(taskRoutes, { prefix: '/api' });
await fastify.register(agentRoutes, { prefix: '/api' });
await fastify.register(waitlistRoutes, { prefix: '/api' });

// Graceful shutdown
const signals = ['SIGINT', 'SIGTERM'];
signals.forEach((signal) => {
  process.on(signal, async () => {
    fastify.log.info(`Received ${signal}, closing server...`);
    await fastify.close();
    await closeDatabaseConnection();
    process.exit(0);
  });
});

// Start server
try {
  await fastify.listen({ port: PORT, host: HOST });
  fastify.log.info(`🚀 MADLAB API server listening on ${HOST}:${PORT}`);
  fastify.log.info(`📝 Environment: ${NODE_ENV}`);
  fastify.log.info(`🔗 Health check: http://localhost:${PORT}/api/health`);
  fastify.log.info(`🤖 AI Agents: http://localhost:${PORT}/api/agents/status`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
