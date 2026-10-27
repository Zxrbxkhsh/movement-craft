import { Request, Response } from 'express';
import Addon from '../models/Addon';
import { isDbConnected } from '../config/db';

const DEFAULT_ADDONS = [
  { id: 'cold-pyro-extra', name: 'Extra Cold Pyro Fountains (Pair)', category: 'entry', price: 800, description: 'Smokeless, cold-touch pyrotechnic spark fountains for cinematic entries.', isAvailable: true },
  { id: 'dry-ice-smoke', name: 'Heavy Dry Ice Cloud Entry', category: 'entry', price: 1200, description: 'Low-lying dreamy fog that rolls across the floor like clouds.', isAvailable: true },
  { id: 'neon-sign', name: 'Custom Neon Glow Sign Rental', category: 'decor', price: 600, description: "Bright warm-white or pink neon letters (e.g. 'Better Together', 'Marry Me').", isAvailable: true },
  { id: 'rose-bouquet-100', name: '100 Dutch Red Roses Bouquet', category: 'gifts', price: 1500, description: 'Grand arrangement of premium fresh long-stem red roses.', isAvailable: true },
  { id: 'live-guitarist', name: 'Live Acoustic Guitarist / Violinist (30 mins)', category: 'entry', price: 2000, description: 'Professional musician playing your special songs live during the surprise reveal.', isAvailable: true },
  { id: 'drone-shoot', name: '4K Aerial Drone Cinematography', category: 'media', price: 2500, description: 'High-flying cinematic perspectives for outdoor and rooftop venues.', isAvailable: true },
  { id: 'love-scroll', name: 'Handmade Vintage Love Letter Scroll with Wax Seal', category: 'gifts', price: 500, description: 'Custom printed or calligraphy parchment with romantic wax stamp seal.', isAvailable: true },
  { id: 'chocolate-hamper', name: 'Luxury Imported Chocolate Box Hamper', category: 'gifts', price: 900, description: 'Curated assortment of fine chocolates in an embossed presentation box.', isAvailable: true }
];

export async function getAddons(_req: Request, res: Response): Promise<void> {
  if (isDbConnected()) {
    try {
      const addons = await Addon.find({ isAvailable: { $ne: false } }).sort({ price: 1 });
      res.json(addons);
      return;
    } catch (err: any) {
      console.error('Error querying add-ons in MongoDB:', err.message);
    }
  }
  res.json(DEFAULT_ADDONS);
}

export async function createAddon(req: Request, res: Response): Promise<void> {
  const { name, category, price, description } = req.body;

  if (!name || typeof price !== 'number') {
    res.status(400).json({ success: false, error: 'Add-on name and numeric price are required.' });
    return;
  }

  const id = req.body.id || 'addon_' + Date.now().toString(36);
  const addonData = {
    id,
    name,
    category: category || 'decor',
    price,
    description: description || '',
    isAvailable: req.body.isAvailable !== false
  };

  if (isDbConnected()) {
    try {
      const created = await Addon.create(addonData);
      res.status(201).json(created);
      return;
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Failed to create add-on in database.' });
      return;
    }
  }

  res.status(201).json(addonData);
}

export async function updateAddon(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const updates = req.body;

  if (isDbConnected()) {
    try {
      const updated = await Addon.findOneAndUpdate({ id }, updates, { new: true });
      if (!updated) {
        res.status(404).json({ success: false, error: 'Add-on not found.' });
        return;
      }
      res.json(updated);
      return;
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Failed to update add-on.' });
      return;
    }
  }

  res.json({ id, ...updates });
}

export async function deleteAddon(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  if (isDbConnected()) {
    try {
      const deleted = await Addon.findOneAndDelete({ id });
      if (!deleted) {
        res.status(404).json({ success: false, error: 'Add-on not found.' });
        return;
      }
      res.json({ success: true, message: 'Add-on removed successfully.' });
      return;
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Failed to delete add-on.' });
      return;
    }
  }

  res.json({ success: true, message: 'Add-on removed successfully.' });
}

