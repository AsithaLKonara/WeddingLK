import mongoose, { Schema, Document } from 'mongoose';

export interface IPhoto extends Document {
  url: string;
  title: string;
  category: string;
  venue: string;
  venueId: string;
  photographer: mongoose.Types.ObjectId;
  date: string;
  likes: number;
  views: number;
  tags: string[];
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PhotoSchema = new Schema<IPhoto>({
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['ceremonies', 'decorations', 'couples', 'receptions', 'details', 'all'],
  },
  venue: {
    type: String,
    required: true,
  },
  venueId: {
    type: String,
    required: true,
  },
  photographer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
    min: 0,
  },
  views: {
    type: Number,
    default: 0,
    min: 0,
  },
  tags: [{
    type: String,
  }],
  description: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes
PhotoSchema.index({ category: 1, isActive: 1 });
PhotoSchema.index({ venue: 1, isActive: 1 });
PhotoSchema.index({ photographer: 1 });
PhotoSchema.index({ createdAt: -1 });

export const Photo = mongoose.models.Photo || mongoose.model<IPhoto>('Photo', PhotoSchema);
