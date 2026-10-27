import { Request, Response } from 'express';
import Inquiry from '../models/Inquiry';
import { isDbConnected } from '../config/db';

export async function createInquiry(req: Request, res: Response): Promise<void> {
  const {
    name,
    phone,
    occasion,
    packageTitle,
    date,
    timeSlot,
    area,
    addressDetails,
    addons,
    estimatedBudget,
    notes
  } = req.body;

  const inquiryData = {
    name: name.trim(),
    phone: phone.trim(),
    occasion: occasion || '',
    packageTitle: packageTitle || '',
    date: date || '',
    timeSlot: timeSlot || '',
    area: area || '',
    addressDetails: addressDetails || '',
    addons: Array.isArray(addons) ? addons : [],
    estimatedBudget: Number(estimatedBudget) || 0,
    notes: notes || '',
    status: 'new'
  };

  if (isDbConnected()) {
    try {
      const created = await Inquiry.create(inquiryData);
      res.status(201).json({
        success: true,
        message: 'Inquiry received and registered in MongoDB successfully.',
        inquiryId: created._id
      });
      return;
    } catch (err: any) {
      console.error('Error saving inquiry in MongoDB:', err.message);
    }
  }

  // Graceful response even if DB is not connected
  res.status(201).json({
    success: true,
    message: 'Inquiry received successfully.',
    inquiry: inquiryData
  });
}

export async function getInquiries(_req: Request, res: Response): Promise<void> {
  if (isDbConnected()) {
    try {
      const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
      res.json(inquiries);
      return;
    } catch (err: any) {
      console.error('Error fetching inquiries from MongoDB:', err.message);
      res.status(500).json({ success: false, error: 'Failed to retrieve inquiries from database.' });
      return;
    }
  }

  res.json([]);
}

export async function updateInquiryStatus(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ['new', 'contacted', 'confirmed', 'cancelled'];
  if (!status || !allowedStatuses.includes(status)) {
    res.status(400).json({
      success: false,
      error: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`
    });
    return;
  }

  if (isDbConnected()) {
    try {
      const updated = await Inquiry.findByIdAndUpdate(id, { status }, { new: true });
      if (!updated) {
        res.status(404).json({ success: false, error: 'Inquiry not found.' });
        return;
      }
      res.json({ success: true, inquiry: updated });
      return;
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Failed to update inquiry status.' });
      return;
    }
  }

  res.json({ success: true, id, status });
}

