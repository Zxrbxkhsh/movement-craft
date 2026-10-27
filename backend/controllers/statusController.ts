import { Request, Response } from 'express';
import { getDbStatus, isDbConnected } from '../config/db';
import Package from '../models/Package';
import Inquiry from '../models/Inquiry';
import { readFallbackPackages } from '../services/migrationService';

export async function getStatus(_req: Request, res: Response): Promise<void> {
  let packageCount = 0;
  let inquiryCount = 0;

  if (isDbConnected()) {
    try {
      packageCount = await Package.countDocuments();
      inquiryCount = await Inquiry.countDocuments();
    } catch {
      // ignore
    }
  } else {
    packageCount = readFallbackPackages().length;
  }

  res.json({
    success: true,
    status: 'healthy',
    database: getDbStatus(),
    metrics: {
      packagesCount: packageCount,
      inquiriesCount: inquiryCount
    },
    serverTime: new Date().toISOString()
  });
}

