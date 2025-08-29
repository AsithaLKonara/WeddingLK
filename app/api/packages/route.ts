import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

interface WeddingPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: 'LKR';
  category: 'basic' | 'premium' | 'luxury' | 'custom';
  venue: {
    id: string;
    name: string;
    location: string;
    image: string;
    rating: number;
  };
  features: string[];
  guestCapacity: {
    min: number;
    max: number;
  };
  duration: string;
  includes: string[];
  exclusions: string[];
  availability: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  isBoosted: boolean;
  boostType?: 'featured' | 'trending' | 'sponsored';
  discount?: number;
  isPopular: boolean;
  isNew: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const minPrice = parseInt(searchParams.get('minPrice') || '0');
    const maxPrice = parseInt(searchParams.get('maxPrice') || '1000000');
    const minGuests = parseInt(searchParams.get('minGuests') || '0');
    const maxGuests = parseInt(searchParams.get('maxGuests') || '1000');
    const features = searchParams.get('features')?.split(',') || [];
    const sortBy = searchParams.get('sortBy') || 'recommended';
    const location = searchParams.get('location') || '';

    const db = await getDb();
    const packagesCollection = db.collection('wedding_packages');
    const venuesCollection = db.collection('venues');

    // Build query
    const query: any = { status: 'active' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (minPrice > 0 || maxPrice < 1000000) {
      query.price = {};
      if (minPrice > 0) query.price.$gte = minPrice;
      if (maxPrice < 1000000) query.price.$lte = maxPrice;
    }

    if (minGuests > 0 || maxGuests < 1000) {
      query.$and = [
        { 'guestCapacity.max': { $gte: minGuests } },
        { 'guestCapacity.min': { $lte: maxGuests } },
      ];
    }

    if (features.length > 0) {
      query.features = { $all: features };
    }

    if (location) {
      query['venue.location'] = { $regex: location, $options: 'i' };
    }

    // Build sort
    let sort: any = { createdAt: -1 };

    switch (sortBy) {
      case 'price-low':
        sort = { price: 1 };
        break;
      case 'price-high':
        sort = { price: -1 };
        break;
      case 'rating':
        sort = { rating: -1 };
        break;
      case 'popularity':
        sort = { isPopular: -1, rating: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      default:
        // Recommended: boosted packages first, then by rating
        sort = { isBoosted: -1, rating: -1, createdAt: -1 };
    }

    // Get packages with pagination
    const skip = (page - 1) * limit;
    const packages = await packagesCollection
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    // Enrich packages with venue information
    const enrichedPackages: WeddingPackage[] = await Promise.all(
      packages.map(async pkg => {
        const venue = await venuesCollection.findOne(
          { _id: new ObjectId(pkg.venueId) },
          { projection: { name: 1, location: 1, images: 1, rating: 1 } }
        );

        return {
          id: pkg._id.toString(),
          name: pkg.name,
          description: pkg.description,
          price: pkg.price,
          originalPrice: pkg.originalPrice,
          currency: pkg.currency || 'LKR',
          category: pkg.category,
          venue: {
            id: pkg.venueId,
            name: venue?.name || 'Unknown Venue',
            location: venue?.location?.city || 'Unknown Location',
            image: venue?.images?.[0] || '/venues/default.jpg',
            rating: venue?.rating || 0,
          },
          features: pkg.features || [],
          guestCapacity: pkg.guestCapacity || { min: 0, max: 0 },
          duration: pkg.duration || 'Full day',
          includes: pkg.includes || [],
          exclusions: pkg.exclusions || [],
          availability: pkg.availability || [],
          images: pkg.images || [],
          rating: pkg.rating || 0,
          reviewCount: pkg.reviewCount || 0,
          isBoosted: pkg.isBoosted || false,
          boostType: pkg.boostType,
          discount: pkg.discount,
          isPopular: pkg.isPopular || false,
          isNew: pkg.isNew || false,
        };
      })
    );

    // Get total count for pagination
    const totalPackages = await packagesCollection.countDocuments(query);

    // Get category counts for filters
    const categoryCounts = await packagesCollection
      .aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ])
      .toArray();

    return NextResponse.json({
      success: true,
      data: {
        packages: enrichedPackages,
        pagination: {
          page,
          limit,
          total: totalPackages,
          totalPages: Math.ceil(totalPackages / limit),
        },
        filters: {
          categories: categoryCounts.map(cat => ({
            name: cat._id,
            count: cat.count,
          })),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch packages',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      category,
      venueId,
      features,
      guestCapacity,
      duration,
      includes,
      exclusions,
      availability,
      images,
      vendorId,
    } = body;

    if (!name || !description || !price || !category || !venueId || !vendorId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const packagesCollection = db.collection('wedding_packages');

    const newPackage = {
      name,
      description,
      price: parseFloat(price),
      category,
      venueId,
      vendorId,
      features: features || [],
      guestCapacity: guestCapacity || { min: 0, max: 0 },
      duration: duration || 'Full day',
      includes: includes || [],
      exclusions: exclusions || [],
      availability: availability || [],
      images: images || [],
      rating: 0,
      reviewCount: 0,
      isBoosted: false,
      isPopular: false,
      isNew: true,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await packagesCollection.insertOne(newPackage);

    return NextResponse.json({
      success: true,
      data: {
        id: result.insertedId.toString(),
        message: 'Package created successfully',
      },
    });
  } catch (error) {
    console.error('Error creating package:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create package',
      },
      { status: 500 }
    );
  }
}
