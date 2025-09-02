import { NextRequest, NextResponse } from 'next/server';
// import { connectDB } from '@/lib/db';
import { Vendor } from '@/lib/models/vendor';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get featured vendors with basic info
    const vendors = await (Vendor as any).find({
      featured: true,
      isActive: true,
      isVerified: true,
    })
      .select(
        'name businessName category description location contact rating portfolio'
      )
      .limit(6)
      .sort({ 'rating.average': -1, createdAt: -1 });

    // If no vendors found, return mock data
    if (!vendors || vendors.length === 0) {
      const mockVendors = [
        {
          id: 'mock1',
          businessName: 'Perfect Moments Photography',
          name: 'Photography',
          description: 'Professional wedding photography services',
          category: 'Photography',
          location: { city: 'Colombo', province: 'Western' },
          contact: { phone: '+94 71 456 7890', email: 'info@photography.com' },
          rating: { average: 4.8 },
          portfolio: [],
          isVerified: true,
          isActive: true,
          featured: true,
        },
        {
          id: 'mock2',
          businessName: 'Elegant Decorators',
          name: 'Decoration',
          description: 'Beautiful wedding decorations',
          category: 'Decoration',
          location: { city: 'Colombo', province: 'Western' },
          contact: { phone: '+94 71 567 8901', email: 'info@decorators.com' },
          rating: { average: 4.7 },
          portfolio: [],
          isVerified: true,
          isActive: true,
          featured: true,
        },
      ];
      return NextResponse.json({ vendors: mockVendors });
    }

    return NextResponse.json({ vendors });
  } catch (error) {
    console.error('Error fetching featured vendors:', error);

    // Return mock data on error
    const mockVendors = [
      {
        id: 'mock1',
        businessName: 'Perfect Moments Photography',
        name: 'Photography',
        description: 'Professional wedding photography services',
        category: 'Photography',
        location: { city: 'Colombo', province: 'Western' },
        contact: { phone: '+94 71 456 7890', email: 'info@photography.com' },
        rating: { average: 4.8 },
        portfolio: [],
        isVerified: true,
        isActive: true,
        featured: true,
      },
      {
        id: 'mock2',
        businessName: 'Elegant Decorators',
        name: 'Decoration',
        description: 'Beautiful wedding decorations',
        category: 'Decoration',
        location: { city: 'Colombo', province: 'Western' },
        contact: { phone: '+94 71 567 8901', email: 'info@decorators.com' },
        rating: { average: 4.7 },
        portfolio: [],
        isVerified: true,
        isActive: true,
        featured: true,
      },
    ];
    return NextResponse.json({ vendors: mockVendors });
  }
}
