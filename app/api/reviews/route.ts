import { NextRequest, NextResponse } from 'next/server'

// Mock reviews data storage
const reviews = [
  {
    id: 'review_1',
    entityId: 'venue_1',
    entityType: 'venue',
    author: 'John & Sarah',
    rating: 5,
    title: 'Amazing venue experience',
    content: 'The venue was perfect for our wedding. Beautiful architecture and excellent service.',
    photos: ['review_photo1.jpg'],
    userId: 'user_123',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'published'
  },
  {
    id: 'review_2',
    entityId: 'vendor_1',
    entityType: 'vendor',
    author: 'Mike & Lisa',
    rating: 4,
    title: 'Great photography service',
    content: 'Professional photographer who captured our special day perfectly.',
    photos: [],
    userId: 'user_456',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    status: 'published'
  },
  {
    id: 'review_3',
    entityId: 'venue_2',
    entityType: 'venue',
    author: 'David & Emma',
    rating: 5,
    title: 'Beautiful garden venue',
    content: 'Stunning outdoor venue with perfect weather for our wedding.',
    photos: ['review_photo2.jpg', 'review_photo3.jpg'],
    userId: 'user_789',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    status: 'published'
  }
]

// POST /api/reviews - Submit review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { entityId, entityType, rating, title, content, photos } = body

    if (!entityId || !entityType || !rating || !title || !content) {
      return NextResponse.json({
        error: 'Entity ID, entity type, rating, title, and content are required'
      }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({
        error: 'Rating must be between 1 and 5'
      }, { status: 400 })
    }

    // Create new review
    const reviewId = `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const newReview = {
      id: reviewId,
      entityId,
      entityType,
      author: 'John & Sarah', // Mock author
      rating: parseInt(rating),
      title,
      content,
      photos: photos || [],
      userId: 'user_123',
      createdAt: new Date().toISOString(),
      status: 'published'
    }

    // Add to reviews array
    reviews.push(newReview)

    return NextResponse.json({
      success: true,
      data: newReview,
      message: 'Review submitted successfully'
    })

  } catch (error) {
    console.error('Review submission error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit review',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// GET /api/reviews - Get reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entityId = searchParams.get('entityId')
    const entityType = searchParams.get('entityType')
    const rating = searchParams.get('rating')
    const limit = parseInt(searchParams.get('limit') || '10')

    let filteredReviews = reviews

    if (entityId) {
      filteredReviews = filteredReviews.filter(review => review.entityId === entityId)
    }

    if (entityType) {
      filteredReviews = filteredReviews.filter(review => review.entityType === entityType)
    }

    if (rating) {
      filteredReviews = filteredReviews.filter(review => review.rating >= parseInt(rating))
    }

    // Calculate average rating
    const averageRating = filteredReviews.length > 0 
      ? filteredReviews.reduce((sum, review) => sum + review.rating, 0) / filteredReviews.length
      : 0

    return NextResponse.json({
      success: true,
      data: filteredReviews.slice(0, limit),
      total: filteredReviews.length,
      averageRating: Math.round(averageRating * 10) / 10
    })

  } catch (error) {
    console.error('Reviews fetch error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch reviews',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
} 