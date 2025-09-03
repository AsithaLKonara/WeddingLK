import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Package } from '@/lib/models/package';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build query
    const query: any = { isActive: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (location && location !== 'all') {
      query.location = location;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    // Fetch packages
    const packages = await (Package as any).find(query)
      .populate('vendor', 'name avatar rating reviewCount verified')
      .sort({ createdAt: -1 })
      .limit(limit);

    // Transform data for frontend
    const transformedPackages = packages.map((pkg: any) => ({
      id: pkg._id,
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      originalPrice: pkg.originalPrice,
      currency: pkg.currency || 'LKR',
      category: pkg.category,
      features: pkg.features || [],
      images: pkg.images || [],
      vendor: {
        id: pkg.vendor?._id,
        name: pkg.vendor?.name || 'Unknown Vendor',
        avatar: pkg.vendor?.avatar || '/placeholder.svg',
        rating: pkg.vendor?.rating || 0,
        reviewCount: pkg.vendor?.reviewCount || 0,
        verified: pkg.vendor?.verified || false,
      },
      location: pkg.location,
      maxGuests: pkg.maxGuests,
      duration: pkg.duration,
      availability: pkg.availability || [],
      boostType: pkg.boostType || 'none',
      boostExpiry: pkg.boostExpiry,
      tags: pkg.tags || [],
      rating: pkg.rating || 0,
      reviewCount: pkg.reviewCount || 0,
      isBookmarked: false, // This should be determined by user context
    }));

    return NextResponse.json({
      packages: transformedPackages,
      total: transformedPackages.length,
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch packages' },
      { status: 500 }
    );
  }
}