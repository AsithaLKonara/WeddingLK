import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Photo } from '@/lib/models/photo';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const venue = searchParams.get('venue');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build query
    const query: any = { isActive: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (venue && venue !== 'all') {
      query.venue = venue;
    }

    // Fetch photos
    const photos = await (Photo as any).find(query)
      .populate('photographer', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit);

    // Transform data for frontend
    const transformedPhotos = photos.map((photo: any) => ({
      _id: photo._id,
      _url: photo.url,
      _title: photo.title,
      _category: photo.category,
      _venue: photo.venue,
      _venueId: photo.venueId,
      _photographer: photo.photographer?.name || 'Unknown',
      _photographerAvatar: photo.photographer?.avatar || '/placeholder.svg',
      _date: photo.date,
      _likes: photo.likes || 0,
      _views: photo.views || 0,
      _isLiked: false, // This should be determined by user context
      _tags: photo.tags || [],
      _description: photo.description || '',
    }));

    return NextResponse.json({
      photos: transformedPhotos,
      total: transformedPhotos.length,
    });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}
