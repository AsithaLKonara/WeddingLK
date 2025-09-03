import mongoose, { Schema, Document } from 'mongoose';

export interface IPackage extends Document {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  category: 'basic' | 'standard' | 'premium' | 'luxury';
  features: string[];
  images: string[];
  vendor: mongoose.Types.ObjectId;
  location: string;
  maxGuests: number;
  duration: string;
  availability: string[];
  boostType: 'none' | 'standard' | 'featured' | 'trending';
  boostExpiry?: Date;
  tags: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema<IPackage>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  originalPrice: {
    type: Number,
    min: 0,
  },
  currency: {
    type: String,
    default: 'LKR',
  },
  category: {
    type: String,
    enum: ['basic', 'standard', 'premium', 'luxury'],
    required: true,
  },
  features: [{
    type: String,
  }],
  images: [{
    type: String,
  }],
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  maxGuests: {
    type: Number,
    required: true,
    min: 1,
  },
  duration: {
    type: String,
    required: true,
  },
  availability: [{
    type: String,
  }],
  boostType: {
    type: String,
    enum: ['none', 'standard', 'featured', 'trending'],
    default: 'none',
  },
  boostExpiry: {
    type: Date,
  },
  tags: [{
    type: String,
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes
PackageSchema.index({ category: 1, isActive: 1 });
PackageSchema.index({ location: 1, isActive: 1 });
PackageSchema.index({ price: 1, isActive: 1 });
PackageSchema.index({ boostType: 1, boostExpiry: 1 });
PackageSchema.index({ rating: -1, reviewCount: -1 });

export const Package = mongoose.models.Package || mongoose.model<IPackage>('Package', PackageSchema);
