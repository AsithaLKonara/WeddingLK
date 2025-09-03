import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Vendor } from '@/lib/models/vendor';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    // Build query
    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (category && category !== 'all') {
      query.category = category;
    }

    // Fetch vendors
    const vendors = await (Vendor as any).find(query)
      .select('name category status rating reviewCount createdAt isVerified')
      .sort({ createdAt: -1 })
      .limit(limit);

    // Transform data for frontend
    const transformedVendors = vendors.map((vendor: any) => ({
      id: vendor._id,
      name: vendor.name,
      category: vendor.category,
      status: vendor.status || 'pending',
      rating: vendor.rating || 0,
      reviewCount: vendor.reviewCount || 0,
      joinDate: vendor.createdAt,
      verified: vendor.isVerified || false,
    }));

    return NextResponse.json({
      vendors: transformedVendors,
      total: transformedVendors.length,
    });
  } catch (error) {
    console.error('Error fetching admin vendors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vendors' },
      { status: 500 }
    );
  }
}