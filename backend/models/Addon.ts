import mongoose, { Schema, Document } from 'mongoose';

export interface IAddon extends Document {
  id: string;
  name: string;
  category: 'entry' | 'gifts' | 'media' | 'decor';
  price: number;
  description: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AddonSchema = new Schema<IAddon>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Add-on name is required'],
      trim: true
    },
    category: {
      type: String,
      enum: ['entry', 'gifts', 'media', 'decor'],
      default: 'decor'
    },
    price: {
      type: Number,
      required: [true, 'Add-on price is required'],
      min: [0, 'Price must be non-negative']
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    isAvailable: {
      type: Boolean,
      default: true
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

export const Addon = mongoose.models.Addon || mongoose.model<IAddon>('Addon', AddonSchema);
export default Addon;

