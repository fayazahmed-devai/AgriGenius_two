import { supabase, createUserClient } from '../config/supabase.js';

/**
 * Authentication Middleware:
 * Verifies Supabase JWT access token from Authorization header.
 * Attaches authenticated user object and a user-scoped Supabase client to req.
 */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // In development mode, allow a mock authenticated session if configured
      if (process.env.NODE_ENV === 'development' && req.headers['x-dev-user-id']) {
        const devUserId = req.headers['x-dev-user-id'];
        req.user = {
          id: devUserId,
          email: 'farmer.demo@agroai.internal',
          user_metadata: { full_name: 'Demo Farmer' },
        };
        req.token = 'dev-token';
        req.supabase = supabase;
        return next();
      }

      return res.status(401).json({
        success: false,
        message: 'Authentication required. Missing or invalid Bearer token.',
        data: null,
        error: { code: 'UNAUTHORIZED', details: [] },
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token with Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      // If running locally in development and token matches a dev test bypass
      if (process.env.NODE_ENV === 'development' && token === 'demo-test-token') {
        req.user = {
          id: '00000000-0000-0000-0000-000000000001',
          email: 'farmer.demo@agroai.internal',
          user_metadata: { full_name: 'Demo Farmer' },
        };
        req.token = token;
        req.supabase = supabase;
        return next();
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication session.',
        data: null,
        error: { code: 'INVALID_TOKEN', details: [error?.message || 'Token verification failed'] },
      });
    }

    // Attach user and RLS-scoped Supabase client
    req.user = user;
    req.token = token;
    req.supabase = createUserClient(token);

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(500).json({
      success: false,
      message: 'Authentication service encountered an internal error.',
      data: null,
      error: { code: 'AUTH_INTERNAL_ERROR', details: [err.message] },
    });
  }
}

