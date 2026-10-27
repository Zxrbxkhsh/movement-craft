import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Admin from '../models/Admin';
import { isDbConnected } from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'movement_craft_secure_jwt_secret_2026';
const TOKEN_EXPIRY = '24h';

// In-memory active sessions for fallback / timing-safe token tracking
export const activeSessions = new Map<string, { createdAt: number; expiresAt: number; username: string }>();

// Read authorized administrator password from environment variable
export function getAuthorizedAdminPassword(): string | null {
  return process.env.ADMIN_PASSWORD || null;
}

// Timing-safe comparison of strings to mitigate side-channel timing attacks
export function timingSafeEqualString(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Verifies admin credentials against MongoDB (if connected) or environment password.
 */
export async function verifyAdminCredentials(inputPassword: string): Promise<boolean> {
  if (!inputPassword || typeof inputPassword !== 'string') {
    return false;
  }

  // 1. If MongoDB is connected, check Admin model
  if (isDbConnected()) {
    try {
      const admins = await Admin.find({});
      if (admins && admins.length > 0) {
        for (const admin of admins) {
          const match = await bcrypt.compare(inputPassword, admin.passwordHash);
          if (match) {
            // Update lastLogin timestamp
            admin.lastLogin = new Date();
            await admin.save();
            return true;
          }
        }
      }
    } catch (e: any) {
      console.error('Error verifying admin in MongoDB:', e.message);
    }
  }

  // 2. Check environment variable as authorized fallback or direct match
  const envPassword = getAuthorizedAdminPassword();
  if (envPassword && timingSafeEqualString(inputPassword, envPassword)) {
    return true;
  }

  return false;
}

/**
 * Creates a signed JWT admin session token and registers in active sessions.
 */
export function createAdminToken(username = 'admin'): string {
  const now = Date.now();
  const token = jwt.sign(
    {
      sub: username,
      role: 'admin',
      iat: Math.floor(now / 1000)
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );

  activeSessions.set(token, {
    createdAt: now,
    expiresAt: now + 24 * 60 * 60 * 1000,
    username
  });

  return token;
}

/**
 * Validates an incoming admin token (JWT or active session token).
 */
export function verifyAdminToken(token: string): boolean {
  if (!token) return false;

  // 1. Check in-memory session registry
  const session = activeSessions.get(token);
  if (session) {
    if (Date.now() > session.expiresAt) {
      activeSessions.delete(token);
      return false;
    }
    return true;
  }

  // 2. Verify JWT signature
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded && decoded.role === 'admin') {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

/**
 * Revokes an admin session token.
 */
export function revokeAdminToken(token: string): void {
  if (token) {
    activeSessions.delete(token);
  }
}

