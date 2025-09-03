import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { Vendor } from '@/lib/models/vendor';
import { Venue } from '@/lib/models/venue';
import { Booking } from '@/lib/models/booking';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get statistics from database
    const [
      totalUsers,
      totalVendors,
      totalVenues,
      totalBookings,
      pendingApprovals,
      activeUsers,
    ] = await Promise.all([
      (User as any).countDocuments({}),
      (Vendor as any).countDocuments({}),
      (Venue as any).countDocuments({}),
      (Booking as any).countDocuments({}),
      (Vendor as any).countDocuments({ status: 'pending' }),
      (User as any).countDocuments({ 
        lastActive: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
      }),
    ]);

    // Calculate total revenue
    const revenueResult = await (Booking as any).aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Calculate conversion rate (simplified)
    const conversionRate = totalUsers > 0 ? (totalBookings / totalUsers) * 100 : 0;

    const stats = {
      totalUsers,
      totalVendors,
      totalVenues,
      totalBookings,
      totalRevenue,
      pendingApprovals,
      activeUsers,
      conversionRate: Math.round(conversionRate * 100) / 100,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
}