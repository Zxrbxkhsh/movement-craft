import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  id: string;
  name: string;
  iconName: string;
  description: string;
  category: 'romantic' | 'celebration' | 'family' | 'unique';
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
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
      required: [true, 'Service name is required'],
      trim: true
    },
    iconName: {
      type: String,
      default: 'Sparkles',
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    category: {
      type: String,
      enum: ['romantic', 'celebration', 'family', 'unique'],
      default: 'celebration'
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

export const Service = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
export default Service;

