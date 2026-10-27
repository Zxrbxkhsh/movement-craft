import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import Package from '../models/Package';
import Config from '../models/Config';
import Addon from '../models/Addon';
import Service from '../models/Service';
import Admin from '../models/Admin';
import { getAuthorizedAdminPassword } from './authService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../data');
const PACKAGES_JSON_PATH = path.join(DATA_DIR, 'packages.json');
const CONFIG_JSON_PATH = path.join(DATA_DIR, 'config.json');

// Initial fallback package list
const DEFAULT_PACKAGES = [
  {
    id: 'birthday-surprise',
    title: 'Birthday Surprise',
    subtitle: 'Glamorous entry & celebratory birthday atmosphere',
    image: '/src/assets/images/surprise_birthday_celebration_1793027120311.jpg',
    badge: 'Most Popular',
    startingPrice: 3499,
    description: 'Make birthdays unforgettable with grand sparkler pyrotechnics, atmospheric cold smoke, a custom designer cake, and professional high-definition reel coverage.',
    popular: true,
    isPublished: true,
    customizationEnabled: true,
    displayOrder: 1,
    terms: 'Bookings should ideally be confirmed 24 hours prior. Exact sparkler timing coordinated directly.',
    inclusions: [
      { text: 'Fire Entry (Cold Pyro Fountains)' },
      { text: 'Smoke Entry (Dry Ice Atmosphere)' },
      { text: 'Birthday Cake (Fresh Designer Cake)' },
      { text: 'Curated Return Gift' },
      { text: 'Photography & Instagram Cinematic Reel' }
    ],
    addons: []
  },
  {
    id: 'midnight-surprise',
    title: 'Midnight Surprise',
    subtitle: 'Secret 12:00 AM doorstep magical reveal',
    image: '/src/assets/images/hero_luxury_surprise_setup_1793027122212.jpg',
    badge: 'Midnight 12 AM',
    startingPrice: 4299,
    description: 'The ultimate midnight greeting at the stroke of 12! Our secret team transforms your doorstep with warm candles, flowers, cake, and gift arrangements before they step outside.',
    popular: true,
    isPublished: true,
    customizationEnabled: true,
    displayOrder: 2,
    terms: 'Arriving quietly by 11:30 PM. Complete stealth execution.',
    inclusions: [
      { text: 'Home Entrance & Pathway Decoration' },
      { text: 'Midnight Birthday/Anniversary Cake', isOurSide: true },
      { text: 'Special Ring / Curated Gift', isOurSide: true },
      { text: 'Return Gift Box', isOurSide: true },
      { text: 'Special Midnight Setup & Lighting' }
    ],
    addons: []
  },
  {
    id: 'theatre-surprise',
    title: 'Theatre Surprise',
    subtitle: 'Private silver screen romance & video reveal',
    image: '/src/assets/images/surprise_theatre_midnight_1793027123086.jpg',
    badge: 'Cinematic Luxury',
    startingPrice: 7999,
    description: 'Rent out or reserve a private theatre experience where a personal memories video plays right on the giant cinema screen during the interval, accompanied by sparkling pyrotechnics.',
    popular: false,
    isPublished: true,
    customizationEnabled: true,
    displayOrder: 3,
    terms: 'Theatre bookings require 48 hours notice for technical screen testing.',
    inclusions: [
      { text: 'Grand Fire Entry' },
      { text: 'Atmospheric Smoke Entry' },
      { text: 'Big Screen Photo / Video Display' },
      { text: 'Interval Surprise Clip & Audio' },
      { text: 'Cake & Special Spotlight Moment' }
    ],
    addons: []
  },
  {
    id: 'cafe-surprise',
    title: 'Cafe Surprise',
    subtitle: 'Candlelit dining & floral romantic ambiance',
    image: '/src/assets/images/hero_luxury_surprise_setup_1793027122212.jpg',
    badge: 'Intimate Dinner',
    startingPrice: 2999,
    description: 'A private corner or rooftop cafe setup decorated with warm fairy lights, floral centerpieces, candles, and sweet surprises tailored for anniversaries and date nights.',
    popular: false,
    isPublished: true,
    customizationEnabled: true,
    displayOrder: 4,
    terms: 'Food and beverage charges ordered from the cafe menu are separate.',
    inclusions: [
      { text: 'Premium Cafe & Table Decoration' },
      { text: 'Custom Celebration Cake', isOurSide: true },
      { text: 'Special Ring or Gift', isOurSide: true },
      { text: 'Return Gift Package', isOurSide: true },
      { text: 'Photography & Keepsake Reel' }
    ],
    addons: []
  },
  {
    id: 'proposal-surprise',
    title: 'Proposal or Special Surprise',
    subtitle: "Say 'Yes' under a fairy-lit flower heart arch",
    image: '/src/assets/images/surprise_romantic_proposal_1793027122863.jpg',
    badge: 'Will You Marry Me?',
    startingPrice: 6499,
    description: "The dream proposal setup with an illuminated giant rose arch, candlelit red carpet aisle, 'Will You Marry Me' marquee sign, ring pedestal, and cinematic 4K video reel capture.",
    popular: true,
    isPublished: true,
    customizationEnabled: true,
    displayOrder: 5,
    terms: 'Full coordination with venue management included.',
    inclusions: [
      { text: 'Romantic Floral Arch & Fairy Light Decor' },
      { text: 'Special Red Carpet Entry Pathway' },
      { text: 'Spotlight Ring Setup & Pedestal' },
      { text: 'Gourmet Celebration Cake', isOurSide: true },
      { text: 'Cinematic Photography & 4K Romantic Reel' }
    ],
    addons: []
  }
];

const DEFAULT_CONFIG = {
  key: 'main_config',
  name: 'Movement Craft',
  tagline: 'You choose the moment. We craft the memory.',
  founder: 'Kuldeep Rajput',
  phone: '+91 8793877192',
  whatsapp: '+918793877192',
  instagram: '@movementcraft.events',
  location: 'Chhatrapati Sambhaji Nagar, Maharashtra',
  serviceCity: 'Chhatrapati Sambhaji Nagar (Aurangabad)',
  announcement: {
    enabled: true,
    text: '🎉 Now Booking for Weddings, Midnight Birthdays & Proposal Moments in Chhatrapati Sambhaji Nagar — Call +91 8793877192'
  }
};

const DEFAULT_ADDONS = [
  {
    id: 'cold-pyro-extra',
    name: 'Extra Cold Pyro Fountains (Pair)',
    category: 'entry',
    price: 800,
    description: 'Smokeless, cold-touch pyrotechnic spark fountains for cinematic entries.'
  },
  {
    id: 'dry-ice-smoke',
    name: 'Heavy Dry Ice Cloud Entry',
    category: 'entry',
    price: 1200,
    description: 'Low-lying dreamy fog that rolls across the floor like clouds.'
  },
  {
    id: 'neon-sign',
    name: 'Custom Neon Glow Sign Rental',
    category: 'decor',
    price: 600,
    description: "Bright warm-white or pink neon letters (e.g. 'Better Together', 'Marry Me')."
  },
  {
    id: 'rose-bouquet-100',
    name: '100 Dutch Red Roses Bouquet',
    category: 'gifts',
    price: 1500,
    description: 'Grand arrangement of premium fresh long-stem red roses.'
  },
  {
    id: 'live-guitarist',
    name: 'Live Acoustic Guitarist / Violinist (30 mins)',
    category: 'entry',
    price: 2000,
    description: 'Professional musician playing your special songs live during the surprise reveal.'
  },
  {
    id: 'drone-shoot',
    name: '4K Aerial Drone Cinematography',
    category: 'media',
    price: 2500,
    description: 'High-flying cinematic perspectives for outdoor and rooftop venues.'
  },
  {
    id: 'love-scroll',
    name: 'Handmade Vintage Love Letter Scroll with Wax Seal',
    category: 'gifts',
    price: 500,
    description: 'Custom printed or calligraphy parchment with romantic wax stamp seal.'
  },
  {
    id: 'chocolate-hamper',
    name: 'Luxury Imported Chocolate Box Hamper',
    category: 'gifts',
    price: 900,
    description: 'Curated assortment of fine chocolates in an embossed presentation box.'
  }
];

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

export async function runDataMigration(): Promise<void> {
  console.log('📦 [Migration] Checking MongoDB collections for initial records...');

  try {
    // 1. Packages Migration
    const packageCount = await Package.countDocuments();
    if (packageCount === 0) {
      let packagesToInsert = DEFAULT_PACKAGES;
      if (fs.existsSync(PACKAGES_JSON_PATH)) {
        try {
          const raw = fs.readFileSync(PACKAGES_JSON_PATH, 'utf-8');
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            packagesToInsert = parsed;
          }
        } catch (e: any) {
          console.warn('⚠️ Could not parse existing packages.json, using defaults:', e.message);
        }
      }

      await Package.insertMany(packagesToInsert);
      console.log(`✅ [Migration] Inserted ${packagesToInsert.length} packages into MongoDB.`);
    } else {
      console.log(`ℹ️ [Migration] Packages collection already contains ${packageCount} records.`);
    }

    // 2. Config Migration
    const existingConfig = await Config.findOne({ key: 'main_config' });
    if (!existingConfig) {
      let configToInsert: any = DEFAULT_CONFIG;
      if (fs.existsSync(CONFIG_JSON_PATH)) {
        try {
          const raw = fs.readFileSync(CONFIG_JSON_PATH, 'utf-8');
          const parsed = JSON.parse(raw);
          if (parsed && parsed.name) {
            configToInsert = { ...DEFAULT_CONFIG, ...parsed, key: 'main_config' };
          }
        } catch (e: any) {
          console.warn('⚠️ Could not parse config.json, using defaults:', e.message);
        }
      }
      await Config.create(configToInsert);
      console.log('✅ [Migration] Default website configuration created in MongoDB.');
    }

    // 3. Add-ons Migration
    const addonCount = await Addon.countDocuments();
    if (addonCount === 0) {
      await Addon.insertMany(DEFAULT_ADDONS);
      console.log(`✅ [Migration] Inserted ${DEFAULT_ADDONS.length} add-ons into MongoDB.`);
    }

    // 4. Services Migration
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      await Service.insertMany(DEFAULT_SERVICES);
      console.log(`✅ [Migration] Inserted ${DEFAULT_SERVICES.length} services into MongoDB.`);
    }

    // 5. Admin Credentials Migration
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const adminPassword = getAuthorizedAdminPassword();
      if (adminPassword) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(adminPassword, salt);

        await Admin.create({
          username: 'admin',
          passwordHash: hash,
          role: 'admin'
        });
        console.log('✅ [Migration] Initial administrator credentials initialized with secure bcrypt hash.');
      } else {
        console.warn('⚠️ [Migration] ADMIN_PASSWORD not configured in .env. Admin credentials not seeded.');
      }
    }

    console.log('✨ [Migration] Database migration check completed successfully.');
  } catch (err: any) {
    console.error('❌ [Migration] Migration error:', err.message);
  }
}

// Fallback JSON operations when MongoDB is not connected
export function readFallbackPackages(): any[] {
  try {
    if (fs.existsSync(PACKAGES_JSON_PATH)) {
      const data = fs.readFileSync(PACKAGES_JSON_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading packages.json fallback:', err);
  }
  return DEFAULT_PACKAGES;
}

export function writeFallbackPackages(packages: any[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(PACKAGES_JSON_PATH, JSON.stringify(packages, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing packages.json fallback:', err);
  }
}

export function readFallbackConfig(): any {
  try {
    if (fs.existsSync(CONFIG_JSON_PATH)) {
      return JSON.parse(fs.readFileSync(CONFIG_JSON_PATH, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading config.json fallback:', e);
  }
  return DEFAULT_CONFIG;
}

export function writeFallbackConfig(cfg: any): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(CONFIG_JSON_PATH, JSON.stringify(cfg, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing config.json fallback:', err);
  }
}
