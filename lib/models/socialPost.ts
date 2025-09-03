import mongoose, { Schema, Document } from 'mongoose';

export interface ISocialPost extends Document {
  user: mongoose.Types.ObjectId;
  content: string;
  images: string[];
  location?: string;
  platform: 'instagram' | 'facebook' | 'twitter';
  category: string;
  likes: number;
  comments: mongoose.Types.ObjectId[];
  shares: number;
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SocialPostSchema = new Schema<ISocialPost>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
  }],
  location: {
    type: String,
  },
  platform: {
    type: String,
    enum: ['instagram', 'facebook', 'twitter'],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
    min: 0,
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  shares: {
    type: Number,
    default: 0,
    min: 0,
  },
  tags: [{
    type: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes
SocialPostSchema.index({ platform: 1, isActive: 1 });
SocialPostSchema.index({ category: 1, isActive: 1 });
SocialPostSchema.index({ user: 1 });
SocialPostSchema.index({ createdAt: -1 });

export const SocialPost = mongoose.models.SocialPost || mongoose.model<ISocialPost>('SocialPost', SocialPostSchema);
