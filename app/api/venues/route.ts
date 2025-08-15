import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/venues - Get venues with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const location = searchParams.get('location')
    const minCapacity = searchParams.get('minCapacity')
    const maxCapacity = searchParams.get('maxCapacity')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const amenities = searchParams.get('amenities')
    const featured = searchParams.get('featured')
    const venueId = searchParams.get('venueId')

    await connectDB()

    // Dynamically import the Venue model
    const { Venue } = await import('@/lib/models/venue')

    // If specific venue ID is requested
    if (venueId) {
      const venue = await Venue.findById(venueId)
        .populate('owner', 'firstName lastName email')
        .populate('reviews.user', 'firstName lastName')
      
      if (!venue) {
        return NextResponse.json({ error: 'Venue not found' }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        venue,
      })
    }

    // Build query
    const query: any = { isActive: true }

    if (location) {
      query['location.city'] = { $regex: location, $options: 'i' }
    }

    if (minCapacity || maxCapacity) {
      query.capacity = {}
      if (minCapacity) query.capacity.$gte = parseInt(minCapacity)
      if (maxCapacity) query.capacity.$lte = parseInt(maxCapacity)
    }

    if (minPrice || maxPrice) {
      query['pricing.basePrice'] = {}
      if (minPrice) query['pricing.basePrice'].$gte = parseInt(minPrice)
      if (maxPrice) query['pricing.basePrice'].$lte = parseInt(maxPrice)
    }

    if (amenities) {
      const amenityArray = amenities.split(',').map((a: string) => a.trim())
      query.amenities = { $in: amenityArray }
    }

    if (featured === 'true') {
      query.featured = true
    }

    // Get venues with pagination
    const venues = await Venue.find(query)
      .populate('owner', 'firstName lastName email')
      .populate('reviews.user', 'firstName lastName')
      .sort({ featured: -1, 'rating.average': -1, createdAt: -1 })
      .limit(limit)
      .skip(offset)

    const total = await Venue.countDocuments(query)

    return NextResponse.json({
      success: true,
      venues,
      pagination: {
        page: Math.floor(offset / limit) + 1,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching venues:', error)
    return NextResponse.json(
      { error: 'Failed to fetch venues' },
      { status: 500 }
    )
  }
}

// POST /api/venues - Create new venue
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      description,
      location,
      capacity,
      pricing,
      amenities,
      images,
    } = body

    if (!name || !description || !location || !capacity || !pricing) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await connectDB()

    // Dynamically import the Venue model
    const { Venue } = await import('@/lib/models/venue')

    // Create venue
    const venue = await Venue.create({
      name,
      description,
      location,
      capacity,
      pricing,
      amenities: amenities || [],
      images: images || [],
      owner: session.user.id,
      isActive: true,
      featured: false,
    })

    const populatedVenue = await Venue.findById(venue._id)
      .populate('owner', 'firstName lastName email')

    return NextResponse.json({
      success: true,
      venue: populatedVenue,
      message: 'Venue created successfully',
    })
  } catch (error) {
    console.error('Error creating venue:', error)
    return NextResponse.json(
      { error: 'Failed to create venue' },
      { status: 500 }
    )
  }
}

// PUT /api/venues - Update venue
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { venueId, ...updateData } = body

    if (!venueId) {
      return NextResponse.json({ error: 'Venue ID is required' }, { status: 400 })
    }

    await connectDB()

    // Dynamically import the Venue model
    const { Venue } = await import('@/lib/models/venue')

    const venue = await Venue.findById(venueId)
    if (!venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 })
    }

    // Check if user is owner or admin
    if (venue.owner.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const updatedVenue = await Venue.findByIdAndUpdate(
      venueId,
      updateData,
      { new: true }
    )
      .populate('owner', 'firstName lastName email')
      .populate('reviews.user', 'firstName lastName')

    return NextResponse.json({
      success: true,
      venue: updatedVenue,
      message: 'Venue updated successfully',
    })
  } catch (error) {
    console.error('Error updating venue:', error)
    return NextResponse.json(
      { error: 'Failed to update venue' },
      { status: 500 }
    )
  }
}

// DELETE /api/venues - Delete venue
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const venueId = searchParams.get('venueId')

    if (!venueId) {
      return NextResponse.json({ error: 'Venue ID is required' }, { status: 400 })
    }

    await connectDB()

    // Dynamically import the Venue model
    const { Venue } = await import('@/lib/models/venue')

    const venue = await Venue.findById(venueId)
    if (!venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 })
    }

    // Check if user is owner or admin
    if (venue.owner.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Soft delete - mark as inactive
    await Venue.findByIdAndUpdate(venueId, { isActive: false })

    return NextResponse.json({
      success: true,
      message: 'Venue deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting venue:', error)
    return NextResponse.json(
      { error: 'Failed to delete venue' },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
