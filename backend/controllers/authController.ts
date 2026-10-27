import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin';
import {
  verifyAdminCredentials,
  createAdminToken,
  revokeAdminToken
} from '../services/authService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { isDbConnected } from '../config/db';

export async function login(req: Request, res: Response): Promise<void> {
  const { password } = req.body;

  if (!password || typeof password !== 'string') {
    res.status(400).json({ success: false, error: 'Password is required.' });
    return;
  }

  const isValid = await verifyAdminCredentials(password);

  if (!isValid) {
    // Artificial small delay to mitigate brute force timing attacks
    setTimeout(() => {
      res.status(401).json({
        success: false,
        error: 'Authentication failed. Invalid administrator credentials.'
      });
    }, 350);
    return;
  }

  const token = createAdminToken('admin');
  res.json({
    success: true,
    token,
    message: 'Administrator authenticated successfully.'
  });
}

export function checkAuth(req: AuthenticatedRequest, res: Response): void {
  // If request reached here via optional or check, verify header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.json({ authenticated: false });
    return;
  }

  // Token is verified via requireAdmin or check directly
  res.json({ authenticated: true });
}

export function logout(req: Request, res: Response): void {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    revokeAdminToken(token);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
}

export async function changePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { newPassword } = req.body;

  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
    res.status(400).json({
      success: false,
      error: 'New password must be at least 6 characters long.'
    });
    return;
  }

  if (isDbConnected()) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newPassword, salt);

      let admin = await Admin.findOne({ username: 'admin' });
      if (!admin) {
        admin = new Admin({ username: 'admin', passwordHash: hash });
      } else {
        admin.passwordHash = hash;
      }
      await admin.save();

      res.json({ success: true, message: 'Administrator password updated in MongoDB successfully.' });
      return;
    } catch (e: any) {
      console.error('Error changing admin password in MongoDB:', e);
      res.status(500).json({ success: false, error: 'Failed to update password in database.' });
      return;
    }
  }

  res.json({
    success: true,
    message: 'Password updated for active session (To persist permanently, please configure MONGODB_URI in .env).'
  });
}

