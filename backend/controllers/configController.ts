import { Request, Response } from 'express';
import Config from '../models/Config';
import { isDbConnected } from '../config/db';
import { readFallbackConfig, writeFallbackConfig } from '../services/migrationService';

export async function getConfig(_req: Request, res: Response): Promise<void> {
  if (isDbConnected()) {
    try {
      const config = await Config.findOne({ key: 'main_config' });
      if (config) {
        res.json(config);
        return;
      }
    } catch (err: any) {
      console.error('Error fetching config from MongoDB, falling back:', err.message);
    }
  }

  const fallback = readFallbackConfig();
  res.json(fallback);
}

export async function updateConfig(req: Request, res: Response): Promise<void> {
  const newConfig = req.body;

  if (isDbConnected()) {
    try {
      const updated = await Config.findOneAndUpdate(
        { key: 'main_config' },
        { ...newConfig, key: 'main_config' },
        { new: true, upsert: true, runValidators: true }
      );

      // Sync fallback
      writeFallbackConfig(updated.toJSON ? updated.toJSON() : newConfig);

      res.json({ success: true, config: updated });
      return;
    } catch (err: any) {
      console.error('Error updating config in MongoDB:', err.message);
      res.status(500).json({ success: false, error: err.message || 'Failed to update configuration.' });
      return;
    }
  }

  // Fallback mode
  writeFallbackConfig(newConfig);
  res.json({ success: true, config: newConfig });
}

