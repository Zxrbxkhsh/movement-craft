import { Response } from 'express';
import Package from '../models/Package';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { isDbConnected } from '../config/db';
import { readFallbackPackages, writeFallbackPackages } from '../services/migrationService';

export async function getPackages(req: AuthenticatedRequest, res: Response): Promise<void> {
  const isAdmin = req.user?.role === 'admin';

  if (isDbConnected()) {
    try {
      const filter = isAdmin ? {} : { isPublished: { $ne: false } };
      const packages = await Package.find(filter).sort({ displayOrder: 1, createdAt: 1 });
      res.json(packages);
      return;
    } catch (err: any) {
      console.error('Error querying packages in MongoDB, falling back:', err.message);
    }
  }

  // Fallback to JSON
  const allPackages = readFallbackPackages();
  const sorted = [...allPackages].sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));

  if (isAdmin) {
    res.json(sorted);
  } else {
    res.json(sorted.filter(p => p.isPublished !== false));
  }
}

export async function getPackageById(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { id } = req.params;

  if (isDbConnected()) {
    try {
      const pkg = await Package.findOne({ id });
      if (!pkg) {
        res.status(404).json({ success: false, error: 'Package not found.' });
        return;
      }
      res.json(pkg);
      return;
    } catch (err: any) {
      console.error('Error finding package in MongoDB:', err.message);
    }
  }

  const allPackages = readFallbackPackages();
  const found = allPackages.find(p => p.id === id);
  if (!found) {
    res.status(404).json({ success: false, error: 'Package not found.' });
    return;
  }
  res.json(found);
}

export async function createPackage(req: AuthenticatedRequest, res: Response): Promise<void> {
  const newPkgData = req.body;

  // 1. Check maximum package limit (25)
  let currentCount = 0;
  if (isDbConnected()) {
    currentCount = await Package.countDocuments();
  } else {
    currentCount = readFallbackPackages().length;
  }

  if (currentCount >= 25) {
    res.status(400).json({
      success: false,
      error: 'Package limit reached. A maximum of 25 packages is allowed.'
    });
    return;
  }

  const id = newPkgData.id || 'pkg_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
  const pkgToSave = {
    ...newPkgData,
    id,
    displayOrder: typeof newPkgData.displayOrder === 'number' ? newPkgData.displayOrder : currentCount + 1,
    isPublished: newPkgData.isPublished !== false,
    customizationEnabled: newPkgData.customizationEnabled !== false,
    inclusions: Array.isArray(newPkgData.inclusions) ? newPkgData.inclusions : [],
    addons: Array.isArray(newPkgData.addons) ? newPkgData.addons : []
  };

  if (isDbConnected()) {
    try {
      const created = await Package.create(pkgToSave);
      // Synchronize fallback
      const fallbackList = readFallbackPackages().filter(p => p.id !== id);
      fallbackList.push(created.toJSON ? created.toJSON() : pkgToSave);
      writeFallbackPackages(fallbackList);

      res.status(201).json(created);
      return;
    } catch (err: any) {
      console.error('Error creating package in MongoDB:', err.message);
      res.status(500).json({ success: false, error: err.message || 'Failed to save package to database.' });
      return;
    }
  }

  // Fallback JSON mode
  const packages = readFallbackPackages();
  packages.push(pkgToSave);
  writeFallbackPackages(packages);
  res.status(201).json(pkgToSave);
}

export async function updatePackage(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const updates = req.body;

  if (isDbConnected()) {
    try {
      const updated = await Package.findOneAndUpdate(
        { id },
        { ...updates, id },
        { new: true, runValidators: true }
      );

      if (!updated) {
        res.status(404).json({ success: false, error: 'Package not found.' });
        return;
      }

      // Sync fallback
      const fallbackList = readFallbackPackages().map(p => (p.id === id ? { ...p, ...updates, id } : p));
      writeFallbackPackages(fallbackList);

      res.json(updated);
      return;
    } catch (err: any) {
      console.error('Error updating package in MongoDB:', err.message);
      res.status(500).json({ success: false, error: err.message || 'Failed to update package in database.' });
      return;
    }
  }

  // Fallback JSON mode
  const packages = readFallbackPackages();
  const index = packages.findIndex(p => p.id === id);
  if (index === -1) {
    res.status(404).json({ success: false, error: 'Package not found.' });
    return;
  }

  const existing = packages[index];
  const updatedPkg = { ...existing, ...updates, id: existing.id };
  packages[index] = updatedPkg;
  writeFallbackPackages(packages);
  res.json(updatedPkg);
}

export async function deletePackage(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { id } = req.params;

  if (isDbConnected()) {
    try {
      const deleted = await Package.findOneAndDelete({ id });
      if (!deleted) {
        res.status(404).json({ success: false, error: 'Package not found.' });
        return;
      }

      // Sync fallback
      const fallbackList = readFallbackPackages().filter(p => p.id !== id);
      writeFallbackPackages(fallbackList);

      res.json({ success: true, message: 'Package deleted successfully.' });
      return;
    } catch (err: any) {
      console.error('Error deleting package in MongoDB:', err.message);
      res.status(500).json({ success: false, error: err.message || 'Failed to delete package.' });
      return;
    }
  }

  // Fallback JSON mode
  let packages = readFallbackPackages();
  const exists = packages.some(p => p.id === id);
  if (!exists) {
    res.status(404).json({ success: false, error: 'Package not found.' });
    return;
  }

  packages = packages.filter(p => p.id !== id);
  writeFallbackPackages(packages);
  res.json({ success: true, message: 'Package deleted successfully.' });
}

