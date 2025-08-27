import { ObjectId } from 'mongodb'
import bcrypt from 'bcryptjs'

export interface IUser {
  _id?: ObjectId
  email: string
  password: string
  name: string
  role: 'user' | 'vendor' | 'wedding_planner' | 'admin' | 'maintainer'
  roleVerified: boolean
  profile: {
    firstName: string
    lastName: string
    phone: string
    dateOfBirth?: Date
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'
    avatar?: string
    bio?: string
  }
  location: {
    country: string
    state: string
    city: string
    address?: string
    postalCode?: string
    coordinates?: {
      latitude: number
      longitude: number
    }
  }
  preferences: {
    weddingStyle?: string[]
    budget?: {
      min: number
      max: number
      currency: string
    }
    guestCount?: {
      min: number
      max: number
    }
    preferredDates?: Date[]
    preferredLocations?: string[]
    specialRequirements?: string[]
  }
  socialAccounts: Array<{
    provider: 'google' | 'facebook' | 'instagram' | 'apple'
    providerId: string
    accessToken: string
    refreshToken?: string
    expiresAt?: Date
    additionalData?: Record<string, unknown>
  }>
  verification: {
    emailVerified: boolean
    phoneVerified: boolean
    identityVerified: boolean
    emailVerificationToken?: string
    phoneVerificationCode?: string
    identityDocuments?: Array<{
      type: string
      documentId: string
      status: 'pending' | 'approved' | 'rejected'
      uploadedAt: Date
      verifiedAt?: Date
    }>
  }
  security: {
    twoFactorEnabled: boolean
    twoFactorSecret?: string
    loginAttempts: number
    lockoutUntil?: Date
    passwordChangedAt: Date
    passwordResetToken?: string
    passwordResetExpires?: Date
  }
  activity: {
    lastLogin: Date
    lastActive: Date
    loginHistory: Array<{
      timestamp: Date
      ip: string
      userAgent: string
      location?: string
      success: boolean
    }>
    totalLogins: number
    totalSessions: number
  }
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
    marketing: boolean
    preferences: {
      newBookings: boolean
      bookingUpdates: boolean
      paymentReminders: boolean
      specialOffers: boolean
      systemUpdates: boolean
    }
  }
  metadata: {
    source: 'direct' | 'google' | 'facebook' | 'instagram' | 'apple' | 'referral'
    referralCode?: string
    referredBy?: ObjectId
    tags: string[]
    notes?: string
  }
  status: 'active' | 'inactive' | 'suspended' | 'deleted'
  createdAt: Date
  updatedAt: Date
}

export class UserModel {
  private collection: any

  constructor(collection: any) {
    this.collection = collection
  }

  // Create indexes for better performance
  async createIndexes(): Promise<void> {
    try {
      await this.collection.createIndex({ email: 1 }, { unique: true })
      await this.collection.createIndex({ 'profile.phone': 1 })
      await this.collection.createIndex({ 'socialAccounts.providerId': 1 })
      await this.collection.createIndex({ role: 1 })
      await this.collection.createIndex({ status: 1 })
      await this.collection.createIndex({ createdAt: 1 })
      await this.collection.createIndex({ 'location.city': 1 })
      await this.collection.createIndex({ 'preferences.budget.max': 1 })
      
      console.log('✅ User indexes created successfully')
    } catch (error) {
      console.error('❌ Error creating user indexes:', error)
    }
  }

  // Create a new user
  async create(userData: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>): Promise<IUser> {
    try {
      // Hash password if provided
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 12)
      }

      const now = new Date()
      
      // Create user object with explicit property assignment to avoid conflicts
      const user: IUser = {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        role: userData.role,
        roleVerified: false,
        profile: userData.profile,
        location: userData.location,
        preferences: userData.preferences,
        socialAccounts: userData.socialAccounts || [],
        verification: {
          emailVerified: userData.verification?.emailVerified || false,
          phoneVerified: userData.verification?.phoneVerified || false,
          identityVerified: userData.verification?.identityVerified || false,
          emailVerificationToken: userData.verification?.emailVerificationToken,
          phoneVerificationCode: userData.verification?.phoneVerificationCode,
          identityDocuments: userData.verification?.identityDocuments || []
        },
        security: {
          twoFactorEnabled: userData.security?.twoFactorEnabled || false,
          twoFactorSecret: userData.security?.twoFactorSecret,
          loginAttempts: userData.security?.loginAttempts || 0,
          lockoutUntil: userData.security?.lockoutUntil,
          passwordChangedAt: userData.security?.passwordChangedAt || now,
          passwordResetToken: userData.security?.passwordResetToken,
          passwordResetExpires: userData.security?.passwordResetExpires
        },
        activity: {
          lastLogin: userData.activity?.lastLogin || now,
          lastActive: userData.activity?.lastActive || now,
          loginHistory: userData.activity?.loginHistory || [],
          totalLogins: userData.activity?.totalLogins || 0,
          totalSessions: userData.activity?.totalSessions || 0
        },
        notifications: {
          email: userData.notifications?.email ?? true,
          sms: userData.notifications?.sms ?? true,
          push: userData.notifications?.push ?? true,
          marketing: userData.notifications?.marketing ?? false,
          preferences: {
            newBookings: userData.notifications?.preferences?.newBookings ?? true,
            bookingUpdates: userData.notifications?.preferences?.bookingUpdates ?? true,
            paymentReminders: userData.notifications?.preferences?.paymentReminders ?? true,
            specialOffers: userData.notifications?.preferences?.specialOffers ?? false,
            systemUpdates: userData.notifications?.preferences?.systemUpdates ?? true
          }
        },
        metadata: {
          source: userData.metadata?.source || 'direct',
          referralCode: userData.metadata?.referralCode,
          referredBy: userData.metadata?.referredBy,
          tags: userData.metadata?.tags || [],
          notes: userData.metadata?.notes
        },
        status: 'active',
        createdAt: now,
        updatedAt: now
      }

      const result = await this.collection.insertOne(user)
      user._id = result.insertedId

      return user
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  // Find user by ID
  async findById(id: string | ObjectId): Promise<IUser | null> {
    try {
      const objectId = typeof id === 'string' ? new ObjectId(id) : id
      const user = await this.collection.findOne({ _id: objectId, status: { $ne: 'deleted' } })
      return user
    } catch (error) {
      console.error('Error finding user by ID:', error)
      return null
    }
  }

  // Find user by email
  async findByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await this.collection.findOne({ 
        email: email.toLowerCase(), 
        status: { $ne: 'deleted' } 
      })
      return user
    } catch (error) {
      console.error('Error finding user by email:', error)
      return null
    }
  }

  // Find user by social account
  async findBySocialAccount(provider: string, providerId: string): Promise<IUser | null> {
    try {
      const user = await this.collection.findOne({
        'socialAccounts.provider': provider,
        'socialAccounts.providerId': providerId,
        status: { $ne: 'deleted' }
      })
      return user
    } catch (error) {
      console.error('Error finding user by social account:', error)
      return null
    }
  }

  // Update user
  async update(id: string | ObjectId, updateData: Partial<IUser>): Promise<boolean> {
    try {
      const objectId = typeof id === 'string' ? new ObjectId(id) : id
      const result = await this.collection.updateOne(
        { _id: objectId, status: { $ne: 'deleted' } },
        { 
          $set: { 
            ...updateData,
            updatedAt: new Date()
          }
        }
      )
      return result.modifiedCount > 0
    } catch (error) {
      console.error('Error updating user:', error)
      return false
    }
  }

  // Delete user (soft delete)
  async delete(id: string | ObjectId): Promise<boolean> {
    try {
      const objectId = typeof id === 'string' ? new ObjectId(id) : id
      const result = await this.collection.updateOne(
        { _id: objectId },
        { 
          $set: { 
            status: 'deleted',
            updatedAt: new Date()
          }
        }
      )
      return result.modifiedCount > 0
    } catch (error) {
      console.error('Error deleting user:', error)
      return false
    }
  }

  // Get all users (for admin)
  async findAll(limit = 100, skip = 0): Promise<IUser[]> {
    try {
      const users = await this.collection
        .find({ status: { $ne: 'deleted' } })
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 })
        .toArray()
      return users
    } catch (error) {
      console.error('Error finding all users:', error)
      return []
    }
  }

  // Search users
  async search(query: string, limit = 50): Promise<IUser[]> {
    try {
      const users = await this.collection
        .find({
          $and: [
            { status: { $ne: 'deleted' } },
            {
              $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { 'profile.firstName': { $regex: query, $options: 'i' } },
                { 'profile.lastName': { $regex: query, $options: 'i' } }
              ]
            }
          ]
        })
        .limit(limit)
        .sort({ createdAt: -1 })
        .toArray()
      return users
    } catch (error) {
      console.error('Error searching users:', error)
      return []
    }
  }
}
