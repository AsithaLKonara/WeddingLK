import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import Venue from '@/lib/models/Venue'
import User from '@/lib/models/User'

// GET /api/venues - Get venues
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const minCapacity = searchParams.get('minCapacity')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build query
    const query: any = { isActive: true }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' }
    }
    
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = parseFloat(minPrice)
      if (maxPrice) query.price.$lte = parseFloat(maxPrice)
    }
    
    if (minCapacity) {
      query.capacity = { $gte: parseInt(minCapacity) }
    }

    // Get venues with owner population
    const venues = await Venue.find(query)
      .populate('owner', 'name email phone')
      .sort({ rating: -1, price: 1 })
      .limit(limit)

    const total = await Venue.countDocuments(query)

    return NextResponse.json({
      success: true,
      data: venues,
      total
    })

  } catch (error) {
    console.error('Venues fetch error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch venues',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// POST /api/venues - Create venue
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const body = await request.json()
    const { 
      name, 
      description, 
      location, 
      address, 
      price, 
      capacity, 
      images, 
      amenities, 
      contact,
      ownerId 
    } = body

    if (!name || !description || !location || !address || !price || !capacity || !ownerId) {
      return NextResponse.json({
        error: 'Name, description, location, address, price, capacity, and ownerId are required'
      }, { status: 400 })
    }

    // Validate owner exists
    const owner = await User.findById(ownerId)
    if (!owner) {
      return NextResponse.json({
        error: 'Owner not found'
      }, { status: 404 })
    }

    // Create new venue
    const venue = new Venue({
      name,
      description,
      location,
      address,
      price: parseFloat(price),
      capacity: parseInt(capacity),
      images: images || [],
      amenities: amenities || [],
      contact,
      owner: ownerId,
      availability: {
        isAvailable: true,
        availableDates: []
      }
    })

    await venue.save()

    return NextResponse.json({
      success: true,
      data: venue,
      message: 'Venue created successfully'
    })

  } catch (error) {
    console.error('Venue creation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Venue creation failed',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
} 