import mongoose, { Schema, Document } from 'mongoose';

export interface IBusinessConfig extends Document {
  key: string;
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
  createdAt: Date;
  updatedAt: Date;
}

const ConfigSchema = new Schema<IBusinessConfig>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'main_config'
    },
    name: {
      type: String,
      default: 'Movement Craft',
      trim: true
    },
    tagline: {
      type: String,
      default: 'You choose the moment. We craft the memory.',
      trim: true
    },
    founder: {
      type: String,
      default: 'Kuldeep Rajput',
      trim: true
    },
    phone: {
      type: String,
      default: '+91 8793877192',
      trim: true
    },
    whatsapp: {
      type: String,
      default: '+918793877192',
      trim: true
    },
    instagram: {
      type: String,
      default: '@movementcraft.events',
      trim: true
    },
    location: {
      type: String,
      default: 'Chhatrapati Sambhaji Nagar, Maharashtra',
      trim: true
    },
    serviceCity: {
      type: String,
      default: 'Chhatrapati Sambhaji Nagar (Aurangabad)',
      trim: true
    },
    announcement: {
      enabled: { type: Boolean, default: true },
      text: {
        type: String,
        default: '🎉 Now Booking for Weddings, Midnight Birthdays & Proposal Moments in Chhatrapati Sambhaji Nagar — Call +91 8793877192'
      }
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret: any) => {
        delete ret._id;
        delete ret.__v;
        delete ret.key;
        return ret;
      }
    }
  }
);

export const Config = mongoose.models.Config || mongoose.model<IBusinessConfig>('Config', ConfigSchema);
export default Config;

