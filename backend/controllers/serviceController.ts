import { Request, Response } from 'express';
import Service from '../models/Service';
import { isDbConnected } from '../config/db';

const DEFAULT_SERVICES = [
  { id: 'midnight', name: 'Midnight Surprise', iconName: 'Moon', description: '12:00 AM doorstep magical decor with cake, music, and gifts.', category: 'celebration' },
  { id: 'cafe', name: 'Cafe Surprise', iconName: 'Coffee', description: 'Private restaurant booth or terrace with fairy lights and roses.', category: 'romantic' },
  { id: 'indoor', name: 'Indoor Surprise', iconName: 'Home', description: 'Cozy bedroom, living room, or suite transformations.', category: 'celebration' },
  { id: 'theatre', name: 'Theatre Surprise', iconName: 'Film', description: 'Big screen photo/video interval tribute with private screening.', category: 'unique' },
  { id: 'outdoor', name: 'Outdoor Surprise', iconName: 'TreePine', description: 'Scenic gardens, poolside cabanas, and scenic open-air setups.', category: 'celebration' },
  { id: 'proposal', name: 'Proposal Surprise', iconName: 'Gem', description: 'Heart arches, candle pathways, and forever memories.', category: 'romantic' },
  { id: 'birthday', name: 'Birthday Surprise', iconName: 'Cake', description: 'Cold pyros, balloon cascades, neon signs, and cake cutting.', category: 'celebration' },
  { id: 'anniversary', name: 'Anniversary Surprise', iconName: 'Heart', description: 'Celebrate milestones with romantic nostalgia and private dining.', category: 'romantic' },
  { id: 'rose', name: 'Rose Surprise', iconName: 'Flower2', description: 'Luxurious bouquet deliveries, rose petals carpets, and floral rings.', category: 'romantic' },
  { id: 'gift', name: 'Gift Surprise', iconName: 'Gift', description: 'Bespoke gift hampers, explosion boxes, and personalized items.', category: 'unique' },
  { id: 'family', name: 'Family Surprise', iconName: 'Users', description: 'Warm gatherings for parents, grandparents, and family milestones.', category: 'family' },
  { id: 'love-letter', name: 'Love Letter Surprise', iconName: 'Mail', description: 'Handcrafted parchment scrolls, wax seals, and romantic verses.', category: 'romantic' },
  { id: 'just-because', name: 'Just Because Surprise', iconName: 'Sparkles', description: 'Unexpected cheer and thoughtful moments to brighten someone’s day.', category: 'unique' },
  { id: 'special', name: 'Special Surprise', iconName: 'Star', description: 'Custom baby showers, promotions, farewells, and homecoming events.', category: 'celebration' }
];

export async function getServices(_req: Request, res: Response): Promise<void> {
  if (isDbConnected()) {
    try {
      const services = await Service.find({}).sort({ createdAt: 1 });
      res.json(services);
      return;
    } catch (err: any) {
      console.error('Error querying services in MongoDB:', err.message);
    }
  }
  res.json(DEFAULT_SERVICES);
}

