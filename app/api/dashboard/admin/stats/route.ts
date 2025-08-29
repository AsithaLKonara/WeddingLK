import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/mongodb';

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();

    // Get current date and date ranges
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Parallel aggregation queries for better performance
    const [
      userStats,
      venueStats,
      vendorStats,
      bookingStats,
      revenueStats,
      recentActivity,
    ] = await Promise.all([
      // User statistics
      db
        .collection('users')
        .aggregate([
          { $match: { status: { $ne: 'deleted' } } },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              active: {
                $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] },
              },
              inactive: {
                $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] },
              },
              suspended: {
                $sum: { $cond: [{ $eq: ['$status', 'suspended'] }, 1, 0] },
              },
              verified: { $sum: { $cond: ['$roleVerified', 1, 0] } },
              unverified: { $sum: { $cond: ['$roleVerified', 0, 1] } },
              newThisMonth: {
                $sum: {
                  $cond: [{ $gte: ['$createdAt', thirtyDaysAgo] }, 1, 0],
                },
              },
              newThisWeek: {
                $sum: { $cond: [{ $gte: ['$createdAt', sevenDaysAgo] }, 1, 0] },
              },
            },
          },
        ])
        .toArray(),

      // Venue statistics
      db
        .collection('venues')
        .aggregate([
          { $match: { status: 'active' } },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              verified: { $sum: { $cond: ['$isVerified', 1, 0] } },
              pending: {
                $sum: {
                  $cond: [{ $eq: ['$verificationStatus', 'pending'] }, 1, 0],
                },
              },
              newThisMonth: {
                $sum: {
                  $cond: [{ $gte: ['$createdAt', thirtyDaysAgo] }, 1, 0],
                },
              },
            },
          },
        ])
        .toArray(),

      // Vendor statistics
      db
        .collection('vendors')
        .aggregate([
          { $match: { status: 'active' } },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              verified: { $sum: { $cond: ['$isVerified', 1, 0] } },
              pending: {
                $sum: {
                  $cond: [{ $eq: ['$verificationStatus', 'pending'] }, 1, 0],
                },
              },
              newThisMonth: {
                $sum: {
                  $cond: [{ $gte: ['$createdAt', thirtyDaysAgo] }, 1, 0],
                },
              },
            },
          },
        ])
        .toArray(),

      // Booking statistics
      db
        .collection('bookings')
        .aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              confirmed: {
                $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] },
              },
              pending: {
                $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
              },
              completed: {
                $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
              },
              cancelled: {
                $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] },
              },
              thisMonth: {
                $sum: {
                  $cond: [{ $gte: ['$createdAt', thirtyDaysAgo] }, 1, 0],
                },
              },
              thisWeek: {
                $sum: { $cond: [{ $gte: ['$createdAt', sevenDaysAgo] }, 1, 0] },
              },
            },
          },
        ])
        .toArray(),

      // Revenue statistics
      db
        .collection('payments')
        .aggregate([
          { $match: { status: 'completed' } },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' },
              thisMonth: {
                $sum: {
                  $cond: [
                    { $gte: ['$createdAt', thirtyDaysAgo] },
                    '$amount',
                    0,
                  ],
                },
              },
              thisWeek: {
                $sum: {
                  $cond: [{ $gte: ['$createdAt', sevenDaysAgo] }, '$amount', 0],
                },
              },
              average: { $avg: '$amount' },
              count: { $sum: 1 },
            },
          },
        ])
        .toArray(),

      // Recent activity
      db
        .collection('activity_logs')
        .aggregate([
          { $sort: { createdAt: -1 } },
          { $limit: 10 },
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'user',
            },
          },
          {
            $project: {
              _id: 1,
              type: 1,
              description: 1,
              createdAt: 1,
              user: { $arrayElemAt: ['$user.name', 0] },
            },
          },
        ])
        .toArray(),
    ]);

    // Extract results
    const userData = userStats[0] || {
      total: 0,
      active: 0,
      inactive: 0,
      suspended: 0,
      verified: 0,
      unverified: 0,
      newThisMonth: 0,
      newThisWeek: 0,
    };

    const venueData = venueStats[0] || {
      total: 0,
      verified: 0,
      pending: 0,
      newThisMonth: 0,
    };

    const vendorData = vendorStats[0] || {
      total: 0,
      verified: 0,
      pending: 0,
      newThisMonth: 0,
    };

    const bookingData = bookingStats[0] || {
      total: 0,
      confirmed: 0,
      pending: 0,
      completed: 0,
      cancelled: 0,
      thisMonth: 0,
      thisWeek: 0,
    };

    const revenueData = revenueStats[0] || {
      total: 0,
      thisMonth: 0,
      thisWeek: 0,
      average: 0,
      count: 0,
    };

    // Calculate growth percentages
    const userGrowth =
      userData.newThisWeek > 0
        ? ((userData.newThisWeek / userData.total) * 100).toFixed(1)
        : '0.0';

    const revenueGrowth =
      revenueData.thisWeek > 0
        ? ((revenueData.thisWeek / revenueData.total) * 100).toFixed(1)
        : '0.0';

    // System health check
    const systemHealth = await checkSystemHealth();

    return NextResponse.json({
      success: true,
      data: {
        users: {
          total: userData.total,
          active: userData.active,
          inactive: userData.inactive,
          suspended: userData.suspended,
          verified: userData.verified,
          unverified: userData.unverified,
          newThisMonth: userData.newThisMonth,
          newThisWeek: userData.newThisWeek,
          growth: userGrowth,
        },
        venues: {
          total: venueData.total,
          verified: venueData.verified,
          pending: venueData.pending,
          newThisMonth: venueData.newThisMonth,
        },
        vendors: {
          total: vendorData.total,
          verified: vendorData.verified,
          pending: vendorData.pending,
          newThisMonth: vendorData.newThisMonth,
        },
        bookings: {
          total: bookingData.total,
          confirmed: bookingData.confirmed,
          pending: bookingData.pending,
          completed: bookingData.completed,
          cancelled: bookingData.cancelled,
          thisMonth: bookingData.thisMonth,
          thisWeek: bookingData.thisWeek,
        },
        revenue: {
          total: revenueData.total,
          thisMonth: revenueData.thisMonth,
          thisWeek: revenueData.thisWeek,
          average: revenueData.average,
          count: revenueData.count,
          growth: revenueGrowth,
        },
        system: {
          health: systemHealth.status,
          message: systemHealth.message,
          responseTime: systemHealth.responseTime,
        },
        recentActivity: recentActivity.map(activity => ({
          id: activity._id.toString(),
          type: activity.type,
          description: activity.description,
          user: activity.user || 'System',
          timestamp: activity.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch admin statistics',
      },
      { status: 500 }
    );
  }
}

async function checkSystemHealth(): Promise<{
  status: 'healthy' | 'warning' | 'critical';
  message: string;
  responseTime: number;
}> {
  const startTime = Date.now();

  try {
    const db = await getDb();
    await db.admin().ping();

    const responseTime = Date.now() - startTime;

    // Determine health status based on response time
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    let message = 'System operating normally';

    if (responseTime > 1000) {
      status = 'warning';
      message = 'System experiencing slow response times';
    }

    if (responseTime > 5000) {
      status = 'critical';
      message = 'System experiencing significant delays';
    }

    return { status, message, responseTime };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    return {
      status: 'critical',
      message:
        error instanceof Error ? error.message : 'Database connection failed',
      responseTime,
    };
  }
}
