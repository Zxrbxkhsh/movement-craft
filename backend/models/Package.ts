import mongoose, { Schema, Document } from 'mongoose';

export interface IPackageInclusion {
  text: string;
  isOurSide?: boolean;
}

export interface IPackageAddon {
  id: string;
  name: string;
  category: 'entry' | 'gifts' | 'media' | 'decor';
  price: number;
  description: string;
}

export interface IPackage extends Document {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badge?: string;
  startingPrice: number;
  discountedPrice?: number;
  inclusions: IPackageInclusion[];
  addons?: IPackageAddon[];
  customizationEnabled?: boolean;
  terms?: string;
  displayOrder?: number;
  isPublished?: boolean;
  popular?: boolean;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const PackageInclusionSchema = new Schema<IPackageInclusion>(
  {
    text: { type: String, required: true, trim: true },
    isOurSide: { type: Boolean, default: false }
  },
  { _id: false }
);

const PackageAddonSchema = new Schema<IPackageAddon>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['entry', 'gifts', 'media', 'decor'],
      default: 'decor'
    },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: '' }
  },
  { _id: false }
);

const PackageSchema = new Schema<IPackage>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Package title is required'],
      trim: true
    },
    subtitle: {
      type: String,
      default: '',
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    image: {
      type: String,
      default: '/assets/movement_craft_packages.jpeg'
    },
    badge: {
      type: String,
      default: ''
    },
    startingPrice: {
      type: Number,
      required: [true, 'Starting price is required'],
      min: [0, 'Price must be greater than or equal to 0']
    },
    discountedPrice: {
      type: Number,
      default: null
    },
    inclusions: {
      type: [PackageInclusionSchema],
      default: []
    },
    addons: {
      type: [PackageAddonSchema],
      default: []
    },
    customizationEnabled: {
      type: Boolean,
      default: true
    },
    terms: {
      type: String,
      default: ''
    },
    displayOrder: {
      type: Number,
      default: 99
    },
    isPublished: {
      type: Boolean,
      default: true
    },
    popular: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret: any) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Prevent re-compilation in development
export const Package = mongoose.models.Package || mongoose.model<IPackage>('Package', PackageSchema);
export default Package;

