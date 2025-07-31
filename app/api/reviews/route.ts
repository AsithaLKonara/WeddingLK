import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const venueId = searchParams.get('venueId')
    const vendorId = searchParams.get('vendorId')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    const db = await connectDB()
    const reviewsCollection = db.connection.db.collection('reviews')

    let query: any = {}
    if (venueId) query.venueId = venueId
    if (vendorId) query.vendorId = vendorId

    const skip = (page - 1) * limit
    const reviews = await reviewsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const total = await reviewsCollection.countDocuments(query)

    return NextResponse.json({
      success: true,
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { venueId, vendorId, rating, comment, clientName, clientEmail } = body

    if (!venueId && !vendorId) {
      return NextResponse.json(
        { error: 'Either venueId or vendorId is required' },
        { status: 400 }
      )
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    const db = await connectDB()
    const reviewsCollection = db.connection.db.collection('reviews')

    const review = {
      venueId,
      vendorId,
      rating,
      comment,
      clientName,
      clientEmail,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await reviewsCollection.insertOne(review)

    return NextResponse.json({
      success: true,
      review: { ...review, _id: result.insertedId }
    })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
} 