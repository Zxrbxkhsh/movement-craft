import { Request, Response, NextFunction } from 'express';
import { verifyAdminToken } from '../services/authService';

export interface AuthenticatedRequest extends Request {
  user?: {
    role: string;
    username?: string;
  };
}

/**
 * Middleware: Requires valid Admin Bearer token
 */
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing or invalid administrator authentication token.'
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  const isValid = verifyAdminToken(token);

  if (!isValid) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Administrator session expired or token is invalid.'
    });
    return;
  }

  req.user = { role: 'admin' };
  next();
}

/**
 * Middleware: Optional admin identification for public endpoints (like GET /api/packages)
 * Sets req.user.role = 'admin' if valid token provided; does NOT reject unauthenticated requests.
 */
export function optionalAdminAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (verifyAdminToken(token)) {
      req.user = { role: 'admin' };
    }
  }
  next();
}

