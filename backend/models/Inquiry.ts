import mongoose, { Schema, Document } from 'mongoose';

export interface IInquiryAddon {
  id: string;
  name: string;
  price: number;
}

export interface IInquiry extends Document {
  name: string;
  phone: string;
  occasion?: string;
  packageTitle?: string;
  date?: string;
  timeSlot?: string;
  area?: string;
  addressDetails?: string;
  addons?: IInquiryAddon[];
  estimatedBudget?: number;
  notes?: string;
  status: 'new' | 'contacted' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const InquiryAddonSchema = new Schema<IInquiryAddon>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true }
  },
  { _id: false }
);

const InquirySchema = new Schema<IInquiry>(
  {
    name: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Contact phone number is required'],
      trim: true
    },
    occasion: {
      type: String,
      default: '',
      trim: true
    },
    packageTitle: {
      type: String,
      default: '',
      trim: true
    },
    date: {
      type: String,
      default: '',
      trim: true
    },
    timeSlot: {
      type: String,
      default: '',
      trim: true
    },
    area: {
      type: String,
      default: '',
      trim: true
    },
    addressDetails: {
      type: String,
      default: '',
      trim: true
    },
    addons: {
      type: [InquiryAddonSchema],
      default: []
    },
    estimatedBudget: {
      type: Number,
      default: 0
    },
    notes: {
      type: String,
      default: '',
      trim: true
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'confirmed', 'cancelled'],
      default: 'new'
    }
  },
  {
    timestamps: true
  }
);

export const Inquiry = mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);
export default Inquiry;

