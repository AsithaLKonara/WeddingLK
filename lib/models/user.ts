import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  name: string
  phone?: string
  role: 'user' | 'vendor' | 'admin'
  avatar?: string
  preferences: {
    weddingDate?: Date
    budget?: number
    guestCount?: number
    location?: string
    style?: string
  }
  favorites?: {
    venues: mongoose.Types.ObjectId[]
    vendors: mongoose.Types.ObjectId[]
  }
  messages?: Array<{
    senderId: mongoose.Types.ObjectId
    recipientId: mongoose.Types.ObjectId
    recipientType: string
    subject: string
    message: string
    timestamp: Date
    read: boolean
  }>
  twoFactorTemp?: string
  isVerified: boolean
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'vendor', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String
  },
  preferences: {
    weddingDate: Date,
    budget: Number,
    guestCount: Number,
    location: String,
    style: String
  },
  favorites: {
    venues: [{ type: Schema.Types.ObjectId, ref: 'Venue' }],
    vendors: [{ type: Schema.Types.ObjectId, ref: 'Vendor' }]
  },
  messages: [{
    senderId: { type: Schema.Types.ObjectId, ref: 'User' },
    recipientId: { type: Schema.Types.ObjectId, ref: 'User' },
    recipientType: String,
    subject: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
  }],
  twoFactorTemp: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date
}, {
  timestamps: true
})

// Indexes
UserSchema.index({ role: 1 })
UserSchema.index({ isActive: 1 })

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
