export interface PackageInclusion {
  text: string;
  isOurSide?: boolean; // Highlighted "Our Side" tag from brochure
}

export interface SurprisePackage {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badge?: string;
  startingPrice: number;
  discountedPrice?: number;
  inclusions: PackageInclusion[];
  addons?: AddonItem[];
  customizationEnabled?: boolean;
  terms?: string;
  displayOrder?: number;
  isPublished?: boolean;
  popular?: boolean;
  description: string;
}

export interface SurpriseService {
  id: string;
  name: string;
  iconName: string;
  description: string;
  category: 'romantic' | 'celebration' | 'family' | 'unique';
}

export interface AddonItem {
  id: string;
  name: string;
  category: 'entry' | 'gifts' | 'media' | 'decor';
  price: number;
  description: string;
}

export interface BusinessConfig {
  name: string;
  tagline: string;
  founder: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  location: string;
  serviceCity: string;
  announcement?: {
    enabled: boolean;
    text: string;
  };
}

export interface InquiryItem {
  _id?: string;
  name: string;
  phone: string;
  occasion?: string;
  packageTitle?: string;
  date?: string;
  timeSlot?: string;
  area?: string;
  addressDetails?: string;
  addons?: { id: string; name: string; price: number }[];
  estimatedBudget?: number;
  notes?: string;
  status?: 'new' | 'contacted' | 'confirmed' | 'cancelled';
  createdAt?: string;
}

export interface DbStatus {
  connected: boolean;
  state: string;
  database: string;
  host: string;
}
