import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { connectDB } from "@/lib/db"
import { Venue } from "@/lib/models/venue"

// Temporary auth options for testing - in production this should come from a proper config file
const authOptions = {
  providers: [],
  session: { strategy: "jwt" as const },
  callbacks: {
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract and validate query parameters
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = parseInt(searchParams.get("offset") || "0")
    const location = searchParams.get("location") || ""
    const minCapacity = parseInt(searchParams.get("minCapacity") || "0")
    const maxCapacity = parseInt(searchParams.get("maxCapacity") || "999999")
    const minPrice = parseInt(searchParams.get("minPrice") || "0")
    const maxPrice = parseInt(searchParams.get("maxPrice") || "999999999")
    const amenities = searchParams.get("amenities") || ""
    const featured = searchParams.get("featured") === "true"

    // Input validation
    if (limit > 100) {
      return NextResponse.json({ error: "Limit cannot exceed 100" }, { status: 400 })
    }
    
    if (offset < 0) {
      return NextResponse.json({ error: "Offset cannot be negative" }, { status: 400 })
    }

    // Query length validation
    if (location.length > 100) {
      return NextResponse.json({ error: "Location parameter too long" }, { status: 400 })
    }

    if (amenities.length > 500) {
      return NextResponse.json({ error: "Amenities parameter too long" }, { status: 400 })
    }

    // Sanitize inputs
    const sanitizedLocation = location.replace(/[<>]/g, '').trim()
    const sanitizedAmenities = amenities.replace(/[<>]/g, '').trim()

    await connectDB()

    // Build filter object
    const filter: any = {}
    
    if (sanitizedLocation) {
      filter.location = { $regex: sanitizedLocation, $options: "i" }
    }
    
    if (minCapacity > 0 || maxCapacity < 999999) {
      filter.capacity = {}
      if (minCapacity > 0) filter.capacity.$gte = minCapacity
      if (maxCapacity < 999999) filter.capacity.$lte = maxCapacity
    }
    
    if (minPrice > 0 || maxPrice < 999999999) {
      filter.price = {}
      if (minPrice > 0) filter.price.$gte = minPrice
      if (maxPrice < 999999999) filter.price.$lte = maxPrice
    }
    
    if (featured) {
      filter.featured = true
    }
    
    if (sanitizedAmenities) {
      const amenitiesArray = sanitizedAmenities.split(",").map(a => a.trim())
      filter.amenities = { $in: amenitiesArray }
    }

    const venues = await Venue.find(filter)
      .sort({ 'rating.average': -1 })
      .limit(limit)
      .skip(offset)
      .lean()

    const total = await Venue.countDocuments(filter)

    return NextResponse.json({
      venues,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (error) {
    console.error("Get venues error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
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
