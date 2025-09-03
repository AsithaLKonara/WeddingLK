import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const role = searchParams.get('role');
    const status = searchParams.get('status');

    // Build query
    const query: any = {};
    if (role && role !== 'all') {
      query.role = role;
    }
    if (status && status !== 'all') {
      query.status = status;
    }

    // Fetch users
    const users = await (User as any).find(query)
      .select('name email role status createdAt lastActive isVerified')
      .sort({ createdAt: -1 })
      .limit(limit);

    // Transform data for frontend
    const transformedUsers = users.map((user: any) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status || 'active',
      joinDate: user.createdAt,
      lastActive: user.lastActive || user.createdAt,
      verified: user.isVerified || false,
    }));

    return NextResponse.json({
      users: transformedUsers,
      total: transformedUsers.length,
    });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}