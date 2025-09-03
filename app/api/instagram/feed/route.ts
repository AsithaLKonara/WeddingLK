import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { SocialPost } from '@/lib/models/socialPost';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');

    // Build query
    const query: any = { 
      isActive: true,
      platform: 'instagram'
    };

    if (category && category !== 'all') {
      query.category = category;
    }

    // Fetch social posts
    const posts = await (SocialPost as any).find(query)
      .populate('user', 'name avatar isVerified')
      .sort({ createdAt: -1 })
      .limit(limit);

    // Transform data for frontend
    const transformedPosts = posts.map((post: any) => ({
      _id: post._id,
      user: {
        _id: post.user?._id,
        _name: post.user?.name || 'Unknown User',
        _avatar: post.user?.avatar || '/placeholder.svg',
        _verified: post.user?.isVerified || false,
        location: post.location || '',
      },
      content: post.content,
      images: post.images || [],
      location: post.location,
      date: post.createdAt,
      likes: post.likes || 0,
      comments: post.comments || [],
      shares: post.shares || 0,
      isLiked: false, // This should be determined by user context
      tags: post.tags || [],
      category: post.category,
    }));

    return NextResponse.json({
      posts: transformedPosts,
      total: transformedPosts.length,
    });
  } catch (error) {
    console.error('Error fetching Instagram feed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Instagram feed' },
      { status: 500 }
    );
  }
}
