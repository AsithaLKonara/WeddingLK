import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/vendors - Get vendors with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const category = searchParams.get('category')
    const location = searchParams.get('location')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const rating = searchParams.get('rating')
    const vendorId = searchParams.get('vendorId')

    await connectDB()

    // Dynamically import the Vendor model
    const { Vendor } = await import('@/lib/models/vendor')

    // If specific vendor ID is requested
    if (vendorId) {
      const vendor = await Vendor.findById(vendorId)
        .populate('owner', 'firstName lastName email')
        .populate('reviews.user', 'firstName lastName')
      
      if (!vendor) {
        return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        vendor,
      })
    }

    // Build query
    const query: any = {}

    if (category) {
      query.category = { $regex: category, $options: 'i' }
    }

    if (location) {
      query['location.city'] = { $regex: location, $options: 'i' }
    }

    if (minPrice || maxPrice) {
      query['pricing.startingPrice'] = {}
      if (minPrice) query['pricing.startingPrice'].$gte = parseInt(minPrice)
      if (maxPrice) query['pricing.startingPrice'].$lte = parseInt(maxPrice)
    }

    if (rating) {
      query['rating.average'] = { $gte: parseFloat(rating) }
    }

    // Get vendors with pagination
    const vendors = await Vendor.find(query)
      .populate('owner', 'firstName lastName email')
      .populate('reviews.user', 'firstName lastName')
      .sort({ 'rating.average': -1, createdAt: -1 })
      .limit(limit)
      .skip(offset)

    const total = await Vendor.countDocuments(query)

    return NextResponse.json({
      success: true,
      vendors,
      pagination: {
        page: Math.floor(offset / limit) + 1,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching vendors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vendors' },
      { status: 500 }
    )
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
