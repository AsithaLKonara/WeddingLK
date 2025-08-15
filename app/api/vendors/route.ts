import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Vendor } from "@/lib/models/vendor"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract and validate query parameters
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = parseInt(searchParams.get("offset") || "0")
    const category = searchParams.get("category") || ""
    const location = searchParams.get("location") || ""
    const minPrice = parseInt(searchParams.get("minPrice") || "0")
    const maxPrice = parseInt(searchParams.get("maxPrice") || "999999999")
    const rating = parseFloat(searchParams.get("rating") || "0")
    const featured = searchParams.get("featured") === "true"

    // Input validation
    if (limit > 100) {
      return NextResponse.json({ error: "Limit cannot exceed 100" }, { status: 400 })
    }
    
    if (offset < 0) {
      return NextResponse.json({ error: "Offset cannot be negative" }, { status: 400 })
    }

    // Query length validation
    if (category.length > 100) {
      return NextResponse.json({ error: "Category parameter too long" }, { status: 400 })
    }

    if (location.length > 100) {
      return NextResponse.json({ error: "Location parameter too long" }, { status: 400 })
    }

    // Sanitize inputs
    const sanitizedCategory = category.replace(/[<>]/g, '').trim()
    const sanitizedLocation = location.replace(/[<>]/g, '').trim()

    await connectDB()

    // Build filter object
    const filter: any = {}
    
    if (sanitizedCategory) {
      filter.category = { $regex: sanitizedCategory, $options: "i" }
    }
    
    if (sanitizedLocation) {
      filter.location = { $regex: sanitizedLocation, $options: "i" }
    }
    
    if (minPrice > 0 || maxPrice < 999999999) {
      filter.price = {}
      if (minPrice > 0) filter.price.$gte = minPrice
      if (maxPrice < 999999999) filter.price.$lte = maxPrice
    }
    
    if (rating > 0) {
      filter.rating = { $gte: rating }
    }
    
    if (featured) {
      filter.featured = true
    }

    const vendors = await Vendor.find(filter)
      .sort({ rating: -1 })
      .limit(limit)
      .skip(offset)
      .lean()

    const total = await Vendor.countDocuments(filter)

    return NextResponse.json({
      vendors,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (error) {
    console.error("Get vendors error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/vendors - Create new vendor
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      businessName,
      category,
      description,
      location,
      contact,
      services,
      portfolio,
      pricing,
    } = body

    if (!name || !businessName || !category || !description || !location || !contact) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await connectDB()

    // Dynamically import the Vendor model
    const { Vendor } = await import('@/lib/models/vendor')

    // Create vendor
    const vendor = await Vendor.create({
      name,
      businessName,
      category,
      description,
      location,
      contact,
      services: services || [],
      portfolio: portfolio || [],
      pricing: pricing || { startingPrice: 0, currency: 'LKR' },
      owner: session.user.id,
    })

    const populatedVendor = await Vendor.findById(vendor._id)
      .populate('owner', 'firstName lastName email')

    return NextResponse.json({
      success: true,
      vendor: populatedVendor,
      message: 'Vendor created successfully',
    })
  } catch (error) {
    console.error('Error creating vendor:', error)
    return NextResponse.json(
      { error: 'Failed to create vendor' },
      { status: 500 }
    )
  }
}

// PUT /api/vendors - Update vendor
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { vendorId, ...updateData } = body

    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor ID is required' }, { status: 400 })
    }

    await connectDB()

    // Dynamically import the Vendor model
    const { Vendor } = await import('@/lib/models/vendor')

    const vendor = await Vendor.findById(vendorId)
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    // Check if user is owner or admin
    if (vendor.owner.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const updatedVendor = await Vendor.findByIdAndUpdate(
      vendorId,
      updateData,
      { new: true }
    )
      .populate('owner', 'firstName lastName email')
      .populate('reviews.user', 'firstName lastName')

    return NextResponse.json({
      success: true,
      vendor: updatedVendor,
      message: 'Vendor updated successfully',
    })
  } catch (error) {
    console.error('Error updating vendor:', error)
    return NextResponse.json(
      { error: 'Failed to update vendor' },
      { status: 500 }
    )
  }
}

// DELETE /api/vendors - Delete vendor
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get('vendorId')

    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor ID is required' }, { status: 400 })
    }

    await connectDB()

    // Dynamically import the Vendor model
    const { Vendor } = await import('@/lib/models/vendor')

    const vendor = await Vendor.findById(vendorId)
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    // Check if user is owner or admin
    if (vendor.owner.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    await Vendor.findByIdAndDelete(vendorId)

    return NextResponse.json({
      success: true,
      message: 'Vendor deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting vendor:', error)
    return NextResponse.json(
      { error: 'Failed to delete vendor' },
      { status: 500 }
    )
  }
}

// PATCH /api/vendors - Update vendor onboarding
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { vendorId, services, portfolio, packages, availability, onboardingComplete } = body

    if (!vendorId) {
      return NextResponse.json({ error: 'Missing vendorId' }, { status: 400 })
    }

    await connectDB()

    // Dynamically import the Vendor model
    const { Vendor } = await import('@/lib/models/vendor')

    const vendor = await Vendor.findById(vendorId)
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    // Check if user is owner or admin
    if (vendor.owner.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const update: any = {}
    if (services) update.services = services
    if (portfolio) update.portfolio = portfolio
    if (packages) update['pricing.packages'] = packages
    if (availability) update.availability = availability
    if (typeof onboardingComplete === 'boolean') update.onboardingComplete = onboardingComplete

    const updatedVendor = await Vendor.findByIdAndUpdate(
      vendorId,
      { $set: update },
      { new: true }
    )
      .populate('owner', 'firstName lastName email')

    return NextResponse.json({
      success: true,
      vendor: updatedVendor,
      message: 'Vendor onboarding updated successfully',
    })
  } catch (error) {
    console.error('Error updating vendor onboarding:', error)
    return NextResponse.json(
      { error: 'Failed to update vendor onboarding' },
      { status: 500 }
    )
  }
}
