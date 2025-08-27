// Security Middleware for WeddingLK
// Provides authentication, authorization, and rate limiting

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { logger } from '@/lib/logger';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    role: string;
    isVerified: boolean;
  };
  ip?: string;
}

// Rate limiting configuration
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15 minutes
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');

// In-memory rate limiting store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function withRateLimit(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: AuthenticatedRequest) => {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    
    // Clean up expired entries
    Array.from(rateLimitStore.entries()).forEach(([key, value]) => {
      if (now > value.resetTime) {
        rateLimitStore.delete(key);
      }
    });
    
    const key = `rate_limit:${ip}`;
    const current = rateLimitStore.get(key);
    
    if (!current || now > current.resetTime) {
      // Reset or create new rate limit entry
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + RATE_LIMIT_WINDOW,
      });
    } else if (current.count >= RATE_LIMIT_MAX) {
      // Rate limit exceeded
      logger.warn('Rate limit exceeded', { ip, count: current.count });
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    } else {
      // Increment count
      current.count++;
    }
    
    return handler(req);
  };
}

export function withAuthentication(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: AuthenticatedRequest) => {
    try {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      
      if (!token) {
        logger.warn('Authentication required', { url: req.url });
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
      
      // Add user info to request
      req.user = {
        id: token.sub!,
        email: token.email!,
        role: token.role as string,
        isVerified: token.isVerified as boolean,
      };
      
      logger.info('User authenticated', { userId: req.user.id, email: req.user.email });
      return handler(req);
    } catch (error) {
      logger.error('Authentication error', { error: error instanceof Error ? error.message : 'Unknown error' });
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
  };
}

export function withAuthorization(requiredRole: string | string[]) {
  return function(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
    return async (req: AuthenticatedRequest) => {
      if (!req.user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
      
      const userRole = req.user.role;
      const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      
      if (!requiredRoles.includes(userRole)) {
        logger.warn('Insufficient permissions', { 
          userId: req.user.id, 
          userRole, 
          requiredRoles,
          url: req.url 
        });
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }
      
      logger.info('Authorization granted', { 
        userId: req.user.id, 
        userRole, 
        requiredRoles 
      });
      return handler(req);
    };
  };
}

export function withVerification(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: AuthenticatedRequest) => {
    if (!req.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    if (!req.user.isVerified) {
      logger.warn('Account verification required', { userId: req.user.id });
      return NextResponse.json(
        { error: 'Account verification required. Please verify your email address.' },
        { status: 403 }
      );
    }
    
    return handler(req);
  };
}

// Combined middleware for common use cases
export function withAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return withRateLimit(withAuthentication(handler));
}

export function withAuthAndRole(requiredRole: string | string[]) {
  return function(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
    return withRateLimit(withAuthentication(withAuthorization(requiredRole)(handler)));
  };
}

export function withFullAuth(requiredRole: string | string[]) {
  return function(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
    return withRateLimit(withAuthentication(withAuthorization(requiredRole)(withVerification(handler))));
  };
}

// CORS middleware
export function withCORS(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const response = await handler(req);
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    
    return response;
  };
}

// Security headers middleware
export function withSecurityHeaders(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const response = await handler(req);
    
    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    
    return response;
  };
}

// Request ID middleware for tracking
export function withRequestId(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const requestId = generateRequestId();
    
    // Add request ID to headers for client reference
    const response = await handler(req);
    response.headers.set('X-Request-ID', requestId);
    
    return response;
  };
}

// Utility function to generate request IDs
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Export middleware composition helper
export function composeMiddleware(...middlewares: Array<(handler: any) => any>) {
  return function(handler: any) {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
  };
}
