import mongoose, { Schema, Document } from 'mongoose';

export interface IProvider extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  category: string;
  logo?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProviderSchema = new Schema<IProvider>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

ProviderSchema.index({ country: 1 });
ProviderSchema.index({ category: 1 });

export default mongoose.model<IProvider>('Provider', ProviderSchema);

