import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

interface FeedPost {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    location?: string;
  };
  content: string;
  images: string[];
  location?: string;
  date: Date;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  tags: string[];
  type: 'wedding' | 'engagement' | 'planning' | 'inspiration';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type');
    const userId = searchParams.get('userId'); // For personalized feed

    const db = await getDb();
    const postsCollection = db.collection('feed_posts');
    const usersCollection = db.collection('users');

    // Build query
    const query: any = { status: 'active' };
    if (type) {
      query.type = type;
    }

    // Get posts with pagination
    const skip = (page - 1) * limit;
    const posts = await postsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get user information for each post
    const enrichedPosts: FeedPost[] = await Promise.all(
      posts.map(async post => {
        const user = await usersCollection.findOne(
          { _id: new ObjectId(post.userId) },
          { projection: { name: 1, profile: 1, verification: 1, location: 1 } }
        );

        // Check if current user has liked/bookmarked this post
        let isLiked = false;
        let isBookmarked = false;

        if (userId) {
          const userLikes = await db.collection('post_likes').findOne({
            postId: post._id.toString(),
            userId: userId,
          });
          isLiked = !!userLikes;

          const userBookmarks = await db.collection('user_bookmarks').findOne({
            postId: post._id.toString(),
            userId: userId,
          });
          isBookmarked = !!userBookmarks;
        }

        return {
          id: post._id.toString(),
          user: {
            id: post.userId,
            name: user?.name || 'Unknown User',
            avatar: user?.profile?.avatar || '/avatars/default.jpg',
            verified: user?.verification?.emailVerified || false,
            location: user?.location?.city,
          },
          content: post.content,
          images: post.images || [],
          location: post.location,
          date: post.createdAt,
          likes: post.likes || 0,
          comments: post.comments || 0,
          shares: post.shares || 0,
          isLiked,
          isBookmarked,
          tags: post.tags || [],
          type: post.type,
        };
      })
    );

    // Get total count for pagination
    const totalPosts = await postsCollection.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: {
        posts: enrichedPosts,
        pagination: {
          page,
          limit,
          total: totalPosts,
          totalPages: Math.ceil(totalPosts / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching feed posts:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch feed posts',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, images, location, type, tags, userId } = body;

    if (!content || !userId) {
      return NextResponse.json(
        { success: false, error: 'Content and userId are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const postsCollection = db.collection('feed_posts');

    const newPost = {
      userId,
      content,
      images: images || [],
      location,
      type: type || 'wedding',
      tags: tags || [],
      likes: 0,
      comments: 0,
      shares: 0,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await postsCollection.insertOne(newPost);

    return NextResponse.json({
      success: true,
      data: {
        id: result.insertedId.toString(),
        message: 'Post created successfully',
      },
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create post',
      },
      { status: 500 }
    );
  }
}
