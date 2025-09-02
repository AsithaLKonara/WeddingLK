// import { connectDB } from '@/lib/db';
// import User from '@/lib/models/user';
import { Vendor } from '@/lib/models/vendor';
import { Venue } from '@/lib/models/venue';

export interface UserAvatarData {
  _id: string;
  _name: string;
  _email: string;
  avatar?: string;
  _role: string;
  phone?: string;
  isVerified?: boolean;
  isActive?: boolean;
}

export interface VendorAvatarData {
  _id: string;
  _name: string;
  _businessName: string;
  avatar?: string;
  _category: string;
  location: {
    _city: string;
    _province: string;
  };
  rating?: {
    _average: number;
    _count: number;
  };
  isVerified?: boolean;
  owner?: UserAvatarData;
}

export interface VenueAvatarData {
  _id: string;
  _name: string;
  avatar?: string;
  location: {
    _city: string;
    _province: string;
  };
  _capacity: number;
  priceRange: {
    _min: number;
    _max: number;
  };
  rating?: {
    _average: number;
    _count: number;
  };
  isVerified?: boolean;
}

export class UserAvatarService {
  /**
   * Get user avatar and basic info by ID
   */
  static async getUserById(_userId: string): Promise<UserAvatarData | null> {
    try {
      await connectDB();
      const user = await (User as any).findById(userId).select(
        'name email avatar role phone isVerified isActive'
      );
      return user ? user.toObject() : null;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  /**
   * Get user avatar and basic info by email
   */
  static async getUserByEmail(_email: string): Promise<UserAvatarData | null> {
    try {
      await connectDB();
      const user = await (User as any).findOne({ email }).select(
        'name email avatar role phone isVerified isActive'
      );
      return user ? user.toObject() : null;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
  }

  /**
   * Get multiple users by IDs
   */
  static async getUsersByIds(_userIds: string[]): Promise<UserAvatarData[]> {
    try {
      await connectDB();
      const users = await (User as any).find({ id: { $in: userIds } }).select(
        'name email avatar role phone isVerified isActive'
      );
      return users.map((_user: any) => user.toObject());
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  /**
   * Get all users
   */
  static async getAllUsers(): Promise<UserAvatarData[]> {
    try {
      await connectDB();
      const users = await (User as any).find().select(
        'name email avatar role phone isVerified isActive'
      );
      return users.map((_user: any) => user.toObject());
    } catch (error) {
      console.error('Error fetching all users:', error);
      return [];
    }
  }

  /**
   * Get vendor with owner avatar data
   */
  static async getVendorWithOwner(
    _vendorId: string
  ): Promise<VendorAvatarData | null> {
    try {
      await connectDB();
      const vendor = await (Vendor as any).findById(vendorId)
        .populate('owner', 'name email avatar role phone isVerified isActive')
        .select(
          'name businessName avatar category location rating isVerified owner'
        );

      if (!vendor) return null;

      const vendorData = vendor.toObject();
      return {
        ...vendorData,
        owner: vendorData.owner as UserAvatarData,
      };
    } catch (error) {
      console.error('Error fetching vendor with owner:', error);
      return null;
    }
  }

  /**
   * Get all vendors with owner avatar data
   */
  static async getAllVendorsWithOwners(): Promise<VendorAvatarData[]> {
    try {
      await connectDB();
      const vendors = await (Vendor as any).find()
        .populate('owner', 'name email avatar role phone isVerified isActive')
        .select(
          'name businessName avatar category location rating isVerified owner'
        );

      return vendors.map((_vendor: any) => {
        const vendorData = vendor.toObject();
        return {
          ...vendorData,
          owner: vendorData.owner as UserAvatarData,
        };
      });
    } catch (error) {
      console.error('Error fetching vendors with owners:', error);
      return [];
    }
  }

  /**
   * Get all venues
   */
  static async getAllVenues(): Promise<VenueAvatarData[]> {
    try {
      await connectDB();
      const venues = await (Venue as any).find().select(
        'name avatar location capacity priceRange rating isVerified'
      );
      return venues.map((_venue: any) => venue.toObject());
    } catch (error) {
      console.error('Error fetching venues:', error);
      return [];
    }
  }

  /**
   * Get venue by ID
   */
  static async getVenueById(_venueId: string): Promise<VenueAvatarData | null> {
    try {
      await connectDB();
      const venue = await (Venue as any).findById(venueId).select(
        'name avatar location capacity priceRange rating isVerified'
      );
      return venue ? venue.toObject() : null;
    } catch (error) {
      console.error('Error fetching venue:', error);
      return null;
    }
  }
}
