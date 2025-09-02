import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

export interface IUser {
  _id?: ObjectId;
  _email: string;
  _password: string;
  _name: string;
  role: 'user' | 'vendor' | 'wedding_planner' | 'admin' | 'maintainer';
  _roleVerified: boolean;
  profile: {
    _firstName: string;
    _lastName: string;
    _phone: string;
    dateOfBirth?: Date;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    avatar?: string;
    bio?: string;
  };
  location: {
    _country: string;
    _state: string;
    _city: string;
    address?: string;
    postalCode?: string;
    coordinates?: {
      _latitude: number;
      _longitude: number;
    };
  };
  preferences: {
    weddingStyle?: string[];
    budget?: {
      _min: number;
      _max: number;
      _currency: string;
    };
    guestCount?: {
      _min: number;
      _max: number;
    };
    preferredDates?: Date[];
    preferredLocations?: string[];
    specialRequirements?: string[];
  };
  socialAccounts: Array<{
    provider: 'google' | 'facebook' | 'instagram' | 'apple';
    _providerId: string;
    _accessToken: string;
    refreshToken?: string;
    expiresAt?: Date;
    additionalData?: Record<string, unknown>;
  }>;
  verification: {
    _emailVerified: boolean;
    _phoneVerified: boolean;
    _identityVerified: boolean;
    emailVerificationToken?: string;
    phoneVerificationCode?: string;
    identityDocuments?: Array<{
      _type: string;
      _documentId: string;
      status: 'pending' | 'approved' | 'rejected';
      uploadedAt: Date;
      verifiedAt?: Date;
    }>;
  };
  security: {
    _twoFactorEnabled: boolean;
    twoFactorSecret?: string;
    _loginAttempts: number;
    lockoutUntil?: Date;
    passwordChangedAt: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
  };
  activity: {
    lastLogin: Date;
    lastActive: Date;
    loginHistory: Array<{
      timestamp: Date;
      _ip: string;
      _userAgent: string;
      location?: string;
      success: boolean;
    }>;
    _totalLogins: number;
    _totalSessions: number;
  };
  notifications: {
    _email: boolean;
    _sms: boolean;
    _push: boolean;
    _marketing: boolean;
    preferences: {
      _newBookings: boolean;
      _bookingUpdates: boolean;
      _paymentReminders: boolean;
      _specialOffers: boolean;
      _systemUpdates: boolean;
    };
  };
  metadata: {
    source:
      | 'direct'
      | 'google'
      | 'facebook'
      | 'instagram'
      | 'apple'
      | 'referral';
    referralCode?: string;
    referredBy?: ObjectId;
    _tags: string[];
    notes?: string;
  };
  status: 'active' | 'inactive' | 'suspended' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
}

export class UserModel {
  private _collection: any;

  constructor(_collection: any) {
    this.collection = collection;
  }

  // Create indexes for better performance
  async createIndexes(): Promise<void> {
    try {
      await this.collection.createIndex({ email: 1 }, { unique: true });
      await this.collection.createIndex({ 'profile.phone': 1 });
      await this.collection.createIndex({ 'socialAccounts.providerId': 1 });
      await this.collection.createIndex({ role: 1 });
      await this.collection.createIndex({ status: 1 });
      await this.collection.createIndex({ createdAt: 1 });
      await this.collection.createIndex({ 'location.city': 1 });
      await this.collection.createIndex({ 'preferences.budget.max': 1 });

      console.log('✅ User indexes created successfully');
    } catch (error) {
      console.error('❌ Error creating user indexes:', error);
    }
  }

  // Create a new user
  async create(
    userData: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>
  ): Promise<IUser> {
    try {
      // Hash password if provided
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 12);
      }

      const now = new Date();

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
          emailVerificationToken: userData.verification?.emailVerificationToken || undefined,
          phoneVerificationCode: userData.verification?.phoneVerificationCode || undefined,
          identityDocuments: userData.verification?.identityDocuments || [],
        },
        security: {
          twoFactorEnabled: userData.security?.twoFactorEnabled || false,
          twoFactorSecret: userData.security?.twoFactorSecret || undefined,
          loginAttempts: userData.security?.loginAttempts || 0,
          lockoutUntil: userData.security?.lockoutUntil || undefined,
          passwordChangedAt: userData.security?.passwordChangedAt || now,
          passwordResetToken: userData.security?.passwordResetToken || undefined,
          passwordResetExpires: userData.security?.passwordResetExpires || undefined,
        },
        activity: {
          lastLogin: userData.activity?.lastLogin || now,
          lastActive: userData.activity?.lastActive || now,
          loginHistory: userData.activity?.loginHistory || [],
          totalLogins: userData.activity?.totalLogins || 0,
          totalSessions: userData.activity?.totalSessions || 0,
        },
        notifications: {
          email: userData.notifications?.email ?? true,
          sms: userData.notifications?.sms ?? true,
          push: userData.notifications?.push ?? true,
          marketing: userData.notifications?.marketing ?? false,
          preferences: {
            newBookings:
              userData.notifications?.preferences?.newBookings ?? true,
            bookingUpdates:
              userData.notifications?.preferences?.bookingUpdates ?? true,
            paymentReminders:
              userData.notifications?.preferences?.paymentReminders ?? true,
            specialOffers:
              userData.notifications?.preferences?.specialOffers ?? false,
            systemUpdates:
              userData.notifications?.preferences?.systemUpdates ?? true,
          },
        },
        metadata: {
          source: userData.metadata?.source || 'direct',
          referralCode: userData.metadata?.referralCode || undefined,
          referredBy: userData.metadata?.referredBy || undefined,
          tags: userData.metadata?.tags || [],
          notes: userData.metadata?.notes || undefined,
        },
        status: 'active',
        createdAt: now,
        updatedAt: now,
      };

      const result = await this.collection.insertOne(user);
      user._id = result.insertedId;

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Find user by ID
  async findById(_id: string | ObjectId): Promise<IUser | null> {
    try {
      const objectId = typeof id === 'string' ? new ObjectId(id) : id;
      const user = await this.collection.findOne({
        id: objectId,
        status: { $ne: 'deleted' },
      });
      return user;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  // Find user by email
  async findByEmail(_email: string): Promise<IUser | null> {
    try {
      const user = await this.collection.findOne({
        email: email.toLowerCase(),
        status: { $ne: 'deleted' },
      });
      return user;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  // Find user by social account
  async findBySocialAccount(
    _provider: string,
    _providerId: string
  ): Promise<IUser | null> {
    try {
      const user = await this.collection.findOne({
        'socialAccounts.provider': provider,
        'socialAccounts.providerId': providerId,
        status: { $ne: 'deleted' },
      });
      return user;
    } catch (error) {
      console.error('Error finding user by social account:', error);
      return null;
    }
  }

  // Update user
  async update(
    _id: string | ObjectId,
    _updateData: Partial<$2>
  ): Promise<boolean> {
    try {
      const objectId = typeof id === 'string' ? new ObjectId(id) : id;
      const result = await this.collection.updateOne(
        { id: objectId, status: { $ne: 'deleted' } },
        {
          $set: {
            ...updateData,
            updatedAt: new Date(),
          },
        }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }

  // Delete user (soft delete)
  async delete(_id: string | ObjectId): Promise<boolean> {
    try {
      const objectId = typeof id === 'string' ? new ObjectId(id) : id;
      const result = await this.collection.updateOne(
        { id: objectId },
        {
          $set: {
            status: 'deleted',
            updatedAt: new Date(),
          },
        }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
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
        .toArray();
      return users;
    } catch (error) {
      console.error('Error finding all users:', error);
      return [];
    }
  }

  // Search users
  async search(_query: string, limit = 50): Promise<IUser[]> {
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
                { 'profile.lastName': { $regex: query, $options: 'i' } },
              ],
            },
          ],
        })
        .limit(limit)
        .sort({ createdAt: -1 })
        .toArray();
      return users;
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }
}
