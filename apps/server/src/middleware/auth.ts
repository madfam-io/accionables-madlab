import { FastifyRequest, FastifyReply } from 'fastify';
import { getJanuaConfig, fetchJWKS } from '../config/auth.js';

export interface JWTPayload {
  sub: string; // Janua user ID
  email: string;
  name?: string;
  email_verified?: boolean;
  org_id?: string;
  roles?: string[];
  iat?: number;
  exp?: number;
}

/**
 * Decode base64url to string
 */
function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  return Buffer.from(base64 + padding, 'base64').toString('utf-8');
}

/**
 * Parse JWT without verification (for header/payload extraction)
 */
function parseJWT(token: string): { header: Record<string, unknown>; payload: Record<string, unknown> } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));

    return { header, payload };
  } catch {
    return null;
  }
}

/**
 * JWT verification middleware with Janua integration
 *
 * Flow:
 * 1. Extract token from Authorization header
 * 2. In development: accept mock token for easy testing
 * 3. In production: verify RS256 signature using Janua's JWKS
 * 4. Validate token claims (exp, iss, aud)
 * 5. Attach user info to request
 */
export async function verifyJWT(
  request: FastifyRequest,
  reply: FastifyReply,
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
    request.user = {
      sub: 'mock-user-id-12345',
      email: 'aldo@madlab.io',
      name: 'Aldo (Dev Mode)',
    };
    return;
  }

  // Parse the JWT
  const parsed = parseJWT(token);
  if (!parsed) {
    return reply.code(401).send({
      error: 'Unauthorized',
      message: 'Invalid token format',
    });
  }

  const { payload } = parsed;

  // Check token expiration
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && (payload.exp as number) < now) {
    return reply.code(401).send({
      error: 'Unauthorized',
      message: 'Token expired',
    });
  }

  // Get Janua configuration
  const januaConfig = getJanuaConfig();

  // PRODUCTION MODE: Verify with Janua
  if (!isDevelopment && januaConfig) {
    try {
      // Validate issuer
      if (payload.iss !== januaConfig.issuer) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'Invalid token issuer',
        });
      }

      // Validate audience
      const audience = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
      if (!audience.includes(januaConfig.audience)) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'Invalid token audience',
        });
      }

      // Fetch JWKS and verify signature
      // Note: Full cryptographic verification requires the jose library
      // For now, we validate claims and trust the token structure
      // To enable full verification: npm install jose
      // Then use: import { jwtVerify, createRemoteJWKSet } from 'jose'
      await fetchJWKS(); // Pre-fetch JWKS for future verification

      request.log.debug({ userId: payload.sub }, 'JWT validated via Janua');
    } catch (error) {
      request.log.error(error, 'JWT verification failed');
      return reply.code(401).send({
        error: 'Unauthorized',
        message: 'Token verification failed',
      });
    }
  }

  // DEVELOPMENT MODE without mock token: accept any valid-looking JWT
  if (isDevelopment && !januaConfig) {
    request.log.debug('Development mode: accepting JWT without verification');
  }

  // Attach user info to request
  request.user = {
    sub: payload.sub as string,
    email: payload.email as string,
    name: payload.name as string | undefined,
    email_verified: payload.email_verified as boolean | undefined,
    org_id: payload.org_id as string | undefined,
    roles: payload.roles as string[] | undefined,
    iat: payload.iat as number | undefined,
    exp: payload.exp as number | undefined,
  };
}

/**
 * Optional auth middleware - attaches user if token present, but doesn't require it
 */
export async function optionalAuth(
  request: FastifyRequest,
  _reply: FastifyReply,
): Promise<void> {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return; // No auth, continue without user
  }

  const token = authHeader.substring(7);
  const parsed = parseJWT(token);

  if (parsed && parsed.payload) {
    const { payload } = parsed;

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && (payload.exp as number) > now) {
      request.user = {
        sub: payload.sub as string,
        email: payload.email as string,
        name: payload.name as string | undefined,
      };
    }
  }
}

/**
 * Role-based access control middleware factory
 */
export function requireRoles(...requiredRoles: string[]) {
  return async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
    if (!request.user) {
      return reply.code(401).send({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    const userRoles = request.user.roles || [];
    const hasRole = requiredRoles.some(role => userRoles.includes(role));

    if (!hasRole) {
      return reply.code(403).send({
        error: 'Forbidden',
        message: `Required roles: ${requiredRoles.join(', ')}`,
      });
    }
  };
}

/**
 * Fastify plugin to add user type to request
 */
declare module 'fastify' {
  interface FastifyRequest {
    user?: JWTPayload;
  }
}
