// import { connectDB } from './db';
import { Vendor } from './models/vendor';
import { Venue } from './models/venue';

// Cache for data (3 minutes TTL)
const dataCache = new Map<string, { data: any; timestamp: number }>();
const DATA_CACHE_TTL = 3 * 60 * 1000;

export class OptimizedDataService {
  /**
   * Get vendors with optimized queries and pagination
   */
  async getVendors(
    options: {
      page?: number;
      limit?: number;
      businessType?: string;
      rating?: number;
      experience?: number;
      verified?: boolean;
      active?: boolean;
    } = {}
  ) {
    const {
      page = 1,
      limit = 10,
      businessType,
      rating,
      experience,
      verified = true,
      active = true,
    } = options;

    const cacheKey = `vendors_${JSON.stringify(options)}`;
    const now = Date.now();

    // Check cache
    const cached = dataCache.get(cacheKey);
    if (cached && now - cached.timestamp < DATA_CACHE_TTL) {
      console.log('🚀 Returning cached vendors');
      return { ...cached.data, cached: true };
    }

    console.log('📊 Fetching fresh vendor data...');
    const startTime = Date.now();

    try {
      await connectDB();

      // Build optimized query
      const query: any = {};

      if (verified !== undefined) query.isVerified = verified;
      if (active !== undefined) query.isActive = active;
      if (businessType)
        query.businessType = { $regex: businessType, $options: 'i' };
      if (rating) query.rating = { $gte: rating };
      if (experience) query.experience = { $gte: experience };

      // Execute optimized query with lean() for better performance
      const [vendors, total] = await Promise.all([
        (Vendor as any).find(query)
          .select(
            'businessName businessType description rating totalReviews experience isVerified isActive'
          )
          .sort({ rating: -1, totalReviews: -1, experience: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean()
          .exec(),

        (Vendor as any).countDocuments(query).exec(),
      ]);

      const result = {
        vendors,
        pagination: {
          total,
          limit,
          offset: (page - 1) * limit,
          hasMore: total > page * limit,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
        },
      };

      const queryTime = Date.now() - startTime;
      console.log(
        `⚡ Vendors fetched in ${queryTime}ms (${vendors.length} results)`
      );

      // Cache the result
      dataCache.set(cacheKey, {
        data: result,
        timestamp: now,
      });

      return { ...result, cached: false };
    } catch (error) {
      console.error('❌ Vendor fetch error:', error);
      throw error;
    }
  }

  /**
   * Get venues with optimized queries and pagination
   */
  async getVenues(
    options: {
      page?: number;
      limit?: number;
      type?: string;
      capacity?: { min?: number; max?: number };
      rating?: number;
      available?: boolean;
      verified?: boolean;
    } = {}
  ) {
    const {
      page = 1,
      limit = 10,
      type,
      capacity,
      rating,
      available = true,
      verified = true,
    } = options;

    const cacheKey = `venues_${JSON.stringify(options)}`;
    const now = Date.now();

    // Check cache
    const cached = dataCache.get(cacheKey);
    if (cached && now - cached.timestamp < DATA_CACHE_TTL) {
      console.log('🚀 Returning cached venues');
      return { ...cached.data, cached: true };
    }

    console.log('🏛️ Fetching fresh venue data...');
    const startTime = Date.now();

    try {
      await connectDB();

      // Build optimized query
      const query: any = {};

      if (verified !== undefined) query.isVerified = verified;
      if (available !== undefined) query.isAvailable = available;
      if (type) query.type = { $regex: type, $options: 'i' };
      if (rating) query.rating = { $gte: rating };
      if (capacity) {
        if (capacity.min) query.capacity = { $gte: capacity.min };
        if (capacity.max)
          query.capacity = { ...query.capacity, $lte: capacity.max };
      }

      // Execute optimized query with lean() for better performance
      const [venues, total] = await Promise.all([
        (Venue as any).find(query)
          .select(
            'name type description capacity rating totalReviews amenities pricing images isAvailable isVerified'
          )
          .sort({ rating: -1, totalReviews: -1, capacity: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean()
          .exec(),

        (Venue as any).countDocuments(query).exec(),
      ]);

      const result = {
        venues,
        pagination: {
          total,
          limit,
          offset: (page - 1) * limit,
          hasMore: total > page * limit,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
        },
      };

      const queryTime = Date.now() - startTime;
      console.log(
        `⚡ Venues fetched in ${queryTime}ms (${venues.length} results)`
      );

      // Cache the result
      dataCache.set(cacheKey, {
        data: result,
        timestamp: now,
      });

      return { ...result, cached: false };
    } catch (error) {
      console.error('❌ Venue fetch error:', error);
      throw error;
    }
  }

  /**
   * Get vendor by ID with optimized query
   */
  async getVendorById(_id: string) {
    const cacheKey = `vendor_${id}`;
    const now = Date.now();

    // Check cache
    const cached = dataCache.get(cacheKey);
    if (cached && now - cached.timestamp < DATA_CACHE_TTL) {
      return { ...cached.data, cached: true };
    }

    try {
      await connectDB();

      const vendor = await (Vendor as any).findById(id)
        .select(
          'businessName businessType description services experience rating totalReviews availability portfolio isVerified isActive'
        )
        .lean()
        .exec();

      if (!vendor) {
        throw new Error('Vendor not found');
      }

      // Cache the result
      dataCache.set(cacheKey, {
        data: vendor,
        timestamp: now,
      });

      return { ...vendor, cached: false };
    } catch (error) {
      console.error('❌ Vendor fetch error:', error);
      throw error;
    }
  }

  /**
   * Get venue by ID with optimized query
   */
  async getVenueById(_id: string) {
    const cacheKey = `venue_${id}`;
    const now = Date.now();

    // Check cache
    const cached = dataCache.get(cacheKey);
    if (cached && now - cached.timestamp < DATA_CACHE_TTL) {
      return { ...cached.data, cached: true };
    }

    try {
      await connectDB();

      const venue = await (Venue as any).findById(id)
        .select(
          'name type description capacity location amenities pricing images rating totalReviews isAvailable isVerified'
        )
        .lean()
        .exec();

      if (!venue) {
        throw new Error('Venue not found');
      }

      // Cache the result
      dataCache.set(cacheKey, {
        data: venue,
        timestamp: now,
      });

      return { ...venue, cached: false };
    } catch (error) {
      console.error('❌ Venue fetch error:', error);
      throw error;
    }
  }

  /**
   * Search vendors with text search
   */
  async searchVendors(
    _searchTerm: string,
    options: {
      page?: number;
      limit?: number;
      businessType?: string;
    } = {}
  ) {
    const { page = 1, limit = 10, businessType } = options;

    const cacheKey = `vendor_search_${searchTerm}_${JSON.stringify(options)}`;
    const now = Date.now();

    // Check cache
    const cached = dataCache.get(cacheKey);
    if (cached && now - cached.timestamp < DATA_CACHE_TTL) {
      return { ...cached.data, cached: true };
    }

    try {
      await connectDB();

      const query: any = {
        $and: [
          { isActive: true, isVerified: true },
          {
            $or: [
              { $text: { $search: searchTerm } },
              { businessName: { $regex: searchTerm, $options: 'i' } },
              { description: { $regex: searchTerm, $options: 'i' } },
            ],
          },
        ],
      };

      if (businessType) {
        query.$and.push({
          businessType: { $regex: businessType, $options: 'i' },
        });
      }

      const [vendors, total] = await Promise.all([
        Vendor.find(query)
          .select(
            'businessName businessType description rating totalReviews experience'
          )
          .sort({ score: { $meta: 'textScore' }, rating: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean()
          .exec(),

        Vendor.countDocuments(query).exec(),
      ]);

      const result = {
        vendors,
        pagination: {
          total,
          limit,
          offset: (page - 1) * limit,
          hasMore: total > page * limit,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
        },
      };

      // Cache the result
      dataCache.set(cacheKey, {
        data: result,
        timestamp: now,
      });

      return { ...result, cached: false };
    } catch (error) {
      console.error('❌ Vendor search error:', error);
      throw error;
    }
  }

  /**
   * Clear data cache
   */
  clearCache() {
    dataCache.clear();
    console.log('🧹 Data cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    Array.from(dataCache.entries()).forEach(([_key, value]) => {
      if (now - value.timestamp < DATA_CACHE_TTL) {
        validEntries++;
      } else {
        expiredEntries++;
      }
    });

    return {
      totalEntries: dataCache.size,
      validEntries,
      expiredEntries,
      cacheSize: dataCache.size,
    };
  }
}

export const optimizedDataService = new OptimizedDataService();
