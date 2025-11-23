import { FastifyRequest, FastifyReply } from 'fastify';

export interface JWTPayload {
  sub: string; // Janua user ID
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

/**
 * Mock JWT verification middleware for development
 *
 * In production, this will:
 * 1. Extract token from Authorization header
 * 2. Verify RS256 signature using Janua's public keys
 * 3. Validate token claims (exp, iss, aud)
 * 4. Attach user info to request
 */
export async function verifyJWT(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Extract token from Authorization header
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({
      error: 'Unauthorized',
      message: 'Missing or invalid Authorization header',
    });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  // DEVELOPMENT MODE: Accept hardcoded mock token
  if (isDevelopment && token === 'dev-token-mock-user') {
    // Attach mock user to request
    request.user = {
      sub: 'mock-user-id-12345',
      email: 'aldo@madlab.io',
      name: 'Aldo (Dev Mode)',
    };
    return;
  }

  // PRODUCTION MODE: Verify JWT with Janua public keys
  // TODO: Implement RS256 verification with Janua
  if (!isDevelopment) {
    try {
      // This is where we'll integrate with Janua's JWT verification
      // For now, reject all tokens in production
      return reply.code(401).send({
        error: 'Unauthorized',
        message: 'JWT verification not yet implemented for production',
      });
    } catch (error) {
      return reply.code(401).send({
        error: 'Unauthorized',
        message: 'Invalid token',
      });
    }
  }

  // If we reach here in development with non-mock token, reject
  return reply.code(401).send({
    error: 'Unauthorized',
    message: 'Invalid development token. Use "dev-token-mock-user"',
  });
}

/**
 * Fastify plugin to add user type to request
 */
declare module 'fastify' {
  interface FastifyRequest {
    user?: JWTPayload;
  }
}
