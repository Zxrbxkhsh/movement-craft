import { Request, Response, NextFunction } from 'express';

export function validatePackageInput(req: Request, res: Response, next: NextFunction): void {
  const { title, startingPrice } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    res.status(400).json({ success: false, error: 'Package title is required and cannot be empty.' });
    return;
  }

  if (typeof startingPrice !== 'number' || isNaN(startingPrice) || startingPrice < 0) {
    res.status(400).json({ success: false, error: 'A valid starting price greater than or equal to 0 is required.' });
    return;
  }

  next();
}

export function validateInquiryInput(req: Request, res: Response, next: NextFunction): void {
  const { name, phone } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    res.status(400).json({ success: false, error: 'Client name is required.' });
    return;
  }

  if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
    res.status(400).json({ success: false, error: 'Contact phone number is required.' });
    return;
  }

  next();
}

export function validateConfigInput(req: Request, res: Response, next: NextFunction): void {
  const config = req.body;

  if (!config || typeof config !== 'object') {
    res.status(400).json({ success: false, error: 'Configuration data object is required.' });
    return;
  }

  if (config.name && typeof config.name !== 'string') {
    res.status(400).json({ success: false, error: 'Business name must be a string.' });
    return;
  }

  next();
}

