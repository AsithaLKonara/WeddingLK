import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  // Basic Information
  _email: string;
  password?: string;
  _name: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';

  // Role Management
  role: 'user' | 'vendor' | 'wedding_planner' | 'admin' | 'maintainer';
  _roleVerified: boolean;
  roleVerifiedAt?: Date;
  roleVerifiedBy?: mongoose.Types.ObjectId;

  // Profile Information
  avatar?: string;
  bio?: string;
  location: {
    _country: string;
    _state: string;
    _city: string;
    zipCode?: string;
    coordinates?: {
      _latitude: number;
      _longitude: number;
    };
  };

  // Preferences
  preferences: {
    _language: string;
    _currency: string;
    _timezone: string;
    notifications: {
      _email: boolean;
      _sms: boolean;
      _push: boolean;
    };
    marketing: {
      _email: boolean;
      _sms: boolean;
      _push: boolean;
    };
  };

  // Social Authentication
  socialAccounts: {
    google?: {
      _id: string;
      _email: string;
      _name: string;
      picture?: string;
    };
    facebook?: {
      _id: string;
      _email: string;
      _name: string;
      picture?: string;
    };
    instagram?: {
      _id: string;
      _username: string;
      _fullName: string;
      picture?: string;
    };
    linkedin?: {
      _id: string;
      _email: string;
      _name: string;
      picture?: string;
    };
  };

  // Verification Status
  _isEmailVerified: boolean;
  _isPhoneVerified: boolean;
  _isIdentityVerified: boolean;
  verificationDocuments: mongoose.Types.ObjectId[];

  // Account Status
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification';
  lastLoginAt?: Date;
  _loginAttempts: number;
  lockedUntil?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt: Date;

  // Methods
  comparePassword(_candidatePassword: string): Promise<boolean>;
  updateLastActive(): Promise<void>;
  incrementLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
  lockAccount(_durationMinutes: number): Promise<void>;
  unlockAccount(): Promise<void>;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function (_this: any) {
        // Password is required only if no social accounts
        return (
          !this.socialAccounts || Object.keys(this.socialAccounts).length === 0
        );
      },
      minlength: 8,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    },

    // Role Management
    role: {
      type: String,
      enum: ['user', 'vendor', 'wedding_planner', 'admin', 'maintainer'],
      default: 'user',
      required: true,
    },
    roleVerified: {
      type: Boolean,
      default: false,
    },
    roleVerifiedAt: {
      type: Date,
    },
    roleVerifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // Profile Information
    avatar: {
      type: String,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    location: {
      country: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
      },
      coordinates: {
        latitude: {
          type: Number,
          min: -90,
          max: 90,
        },
        longitude: {
          type: Number,
          min: -180,
          max: 180,
        },
      },
    },

    // Preferences
    preferences: {
      language: {
        type: String,
        default: 'en',
      },
      currency: {
        type: String,
        default: 'USD',
      },
      timezone: {
        type: String,
        default: 'UTC',
      },
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        sms: {
          type: Boolean,
          default: false,
        },
        push: {
          type: Boolean,
          default: true,
        },
      },
      marketing: {
        email: {
          type: Boolean,
          default: false,
        },
        sms: {
          type: Boolean,
          default: false,
        },
        push: {
          type: Boolean,
          default: false,
        },
      },
    },

    // Social Authentication
    socialAccounts: {
      google: {
        id: String,
        email: String,
        name: String,
        picture: String,
      },
      facebook: {
        id: String,
        email: String,
        name: String,
        picture: String,
      },
      instagram: {
        id: String,
        username: String,
        fullName: String,
        picture: String,
      },
      linkedin: {
        id: String,
        email: String,
        name: String,
        picture: String,
      },
    },

    // Verification Status
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isIdentityVerified: {
      type: Boolean,
      default: false,
    },
    verificationDocuments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
      },
    ],

    // Account Status
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended', 'pending_verification'],
      default: 'pending_verification',
    },
    lastLoginAt: {
      type: Date,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockedUntil: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1, status: 1 });
UserSchema.index({ 'location.city': 1, 'location.state': 1 });
UserSchema.index({ 'socialAccounts.google.id': 1 });
UserSchema.index({ 'socialAccounts.facebook.id': 1 });
UserSchema.index({ 'socialAccounts.instagram.id': 1 });
UserSchema.index({ 'socialAccounts.linkedin.id': 1 });

// Pre-save middleware
UserSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    try {
      // Hash password with salt
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password as string, salt);
    } catch (error) {
      return next(error as Error);
    }
  }

  // Set lastActiveAt to current time
  this.lastActiveAt = new Date();

  next();
});

// Instance methods
UserSchema.methods.comparePassword = async function (
  _candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.updateLastActive = async function (): Promise<void> {
  this.lastActiveAt = new Date();
  await this.save();
};

UserSchema.methods.incrementLoginAttempts = async function (): Promise<void> {
  this.loginAttempts += 1;
  if (this.loginAttempts >= 5) {
    this.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
  }
  await this.save();
};

UserSchema.methods.resetLoginAttempts = async function (): Promise<void> {
  this.loginAttempts = 0;
  this.lockedUntil = undefined;
  await this.save();
};

UserSchema.methods.lockAccount = async function (
  _durationMinutes: number
): Promise<void> {
  this.lockedUntil = new Date(Date.now() + durationMinutes * 60 * 1000);
  this.status = 'suspended';
  await this.save();
};

UserSchema.methods.unlockAccount = async function (): Promise<void> {
  this.lockedUntil = undefined;
  this.status = 'active';
  this.loginAttempts = 0;
  await this.save();
};

// Static methods
UserSchema.statics.findBySocialAccount = function (
  _provider: string,
  _socialId: string
) {
  return this.findOne({ [`socialAccounts.${provider}.id`]: socialId });
};

UserSchema.statics.findByEmail = function (_email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

export const User =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
