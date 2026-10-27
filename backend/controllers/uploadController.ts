import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.resolve(__dirname, '../../frontend/public/uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export function uploadPhoto(req: Request, res: Response): void {
  const { imageBase64, mimeType } = req.body;

  if (!imageBase64) {
    res.status(400).json({ success: false, error: 'No image data provided.' });
    return;
  }

  // Validate allowed MIME types
  const allowedTypes: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/avif': '.avif'
  };

  let cleanMime = mimeType?.toLowerCase() || 'image/jpeg';
  let ext = allowedTypes[cleanMime] || '.jpg';

  // Extract base64 payload if it includes data URL header
  let base64Data = imageBase64;
  if (imageBase64.includes(';base64,')) {
    const parts = imageBase64.split(';base64,');
    const detectedMime = parts[0].replace('data:', '').toLowerCase();
    if (allowedTypes[detectedMime]) {
      ext = allowedTypes[detectedMime];
    }
    base64Data = parts[1];
  }

  const buffer = Buffer.from(base64Data, 'base64');

  // Enforce 10MB maximum file size limit
  if (buffer.length > 10 * 1024 * 1024) {
    res.status(400).json({ success: false, error: 'Image size exceeds maximum 10MB limit.' });
    return;
  }

  const safeName = `pkg_${Date.now()}_${crypto.randomBytes(4).toString('hex')}${ext}`;
  const filePath = path.join(UPLOADS_DIR, safeName);

  try {
    fs.writeFileSync(filePath, buffer);
    const publicUrl = `/uploads/${safeName}`;
    res.json({ success: true, url: publicUrl });
  } catch (err: any) {
    console.error('Error writing uploaded file to disk:', err);
    res.status(500).json({ success: false, error: 'Failed to write uploaded image to disk.' });
  }
}
