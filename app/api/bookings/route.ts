import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/bookings - Get bookings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status')
    const venueId = searchParams.get('venueId')
    const vendorId = searchParams.get('vendorId')
    const userId = searchParams.get('userId')

    await connectDB()

    // Dynamically import the Booking model
    const { Booking } = await import('@/lib/models/booking')

    const query: any = {}

    // Filter by user role
    if (session.user.role === 'couple') {
      query.clientId = session.user.id
    } else if (session.user.role === 'vendor') {
      query.vendorId = session.user.id
    } else if (session.user.role === 'admin') {
      // Admins can see all bookings
    } else {
      return NextResponse.json({ error: 'Invalid user role' }, { status: 403 })
    }

    if (status) query.status = status
    if (venueId) query.venueId = venueId
    if (vendorId) query.vendorId = vendorId
    if (userId) query.userId = userId

    const bookings = await Booking.find(query)
      .populate('clientId', 'firstName lastName email phone')
      .populate('venueId', 'name location')
      .populate('vendorId', 'businessName contact')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)

    const total = await Booking.countDocuments(query)

    return NextResponse.json({
      success: true,
      bookings,
      pagination: {
        page: Math.floor(offset / limit) + 1,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

// POST /api/bookings - Create new booking
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      venueId,
      vendorId,
      date,
      guestCount,
      eventType,
      requirements,
      budget,
      contactInfo,
    } = body

    if (!venueId || !date || !guestCount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await connectDB()

    // Dynamically import the Booking model
    const { Booking } = await import('@/lib/models/booking')
    const { Notification } = await import('@/lib/models/notification')

    // Check if venue is available
    const existingBooking = await Booking.findOne({
      venueId,
      date: new Date(date),
      status: { $in: ['confirmed', 'pending'] }
    })

    if (existingBooking) {
      return NextResponse.json({ error: 'Venue is not available on this date' }, { status: 400 })
    }

    // Create booking
    const booking = await Booking.create({
      clientId: session.user.id,
      venueId,
      vendorId,
      date: new Date(date),
      guestCount,
      eventType: eventType || 'wedding',
      requirements,
      budget,
      contactInfo: {
        name: contactInfo?.name || `${session.user.firstName} ${session.user.lastName}`,
        email: contactInfo?.email || session.user.email,
        phone: contactInfo?.phone || session.user.phone,
      },
      status: 'pending',
      bookingNumber: `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
    })

    const populatedBooking = await Booking.findById(booking._id)
      .populate('clientId', 'firstName lastName email phone')
      .populate('venueId', 'name location owner')
      .populate('vendorId', 'businessName contact owner')

    // Create notifications
    if (populatedBooking.venueId?.owner) {
      await Notification.createNotification({
        recipient: populatedBooking.venueId.owner,
        sender: session.user.id,
        type: 'booking_request',
        title: 'New Booking Request',
        message: `New booking request for ${populatedBooking.venueId.name} on ${new Date(date).toLocaleDateString()}`,
        data: {
          bookingId: booking._id,
          venueId: venueId,
          actionUrl: `/dashboard/bookings/${booking._id}`,
          actionText: 'View Booking',
        },
      })
    }

    if (vendorId && populatedBooking.vendorId?.owner) {
      await Notification.createNotification({
        recipient: populatedBooking.vendorId.owner,
        sender: session.user.id,
        type: 'booking_request',
        title: 'New Booking Request',
        message: `New booking request for ${populatedBooking.vendorId.businessName} on ${new Date(date).toLocaleDateString()}`,
        data: {
          bookingId: booking._id,
          vendorId: vendorId,
          actionUrl: `/dashboard/bookings/${booking._id}`,
          actionText: 'View Booking',
        },
      })
    }

    return NextResponse.json({
      success: true,
      booking: populatedBooking,
      message: 'Booking request submitted successfully',
    })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

// PUT /api/bookings - Update booking status
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { bookingId, status, notes, price } = body

    if (!bookingId || !status) {
      return NextResponse.json({ error: 'Booking ID and status are required' }, { status: 400 })
    }

    await connectDB()

    // Dynamically import the Booking model
    const { Booking } = await import('@/lib/models/booking')
    const { Notification } = await import('@/lib/models/notification')

    const booking = await Booking.findById(bookingId)
      .populate('clientId', 'firstName lastName email')
      .populate('venueId', 'name owner')
      .populate('vendorId', 'businessName owner')

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check permissions
    const isOwner = booking.venueId?.owner?.toString() === session.user.id ||
                   booking.vendorId?.owner?.toString() === session.user.id
    const isClient = booking.clientId._id.toString() === session.user.id
    const isAdmin = session.user.role === 'admin'

    if (!isOwner && !isClient && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Update booking
    const updateData: any = { status }
    if (notes) updateData.notes = notes
    if (price) updateData.price = price

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      updateData,
      { new: true }
    )
      .populate('clientId', 'firstName lastName email')
      .populate('venueId', 'name owner')
      .populate('vendorId', 'businessName owner')

    // Create notification for status change
    if (isOwner || isAdmin) {
      // Notify client
      await Notification.createNotification({
        recipient: booking.clientId._id,
        sender: session.user.id,
        type: 'booking_updated',
        title: 'Booking Status Updated',
        message: `Your booking has been ${status}`,
        data: {
          bookingId: booking._id,
          actionUrl: `/dashboard/bookings/${booking._id}`,
          actionText: 'View Booking',
        },
      })
    } else if (isClient) {
      // Notify venue/vendor owners
      if (booking.venueId?.owner) {
        await Notification.createNotification({
          recipient: booking.venueId.owner,
          sender: session.user.id,
          type: 'booking_updated',
          title: 'Booking Updated',
          message: `Booking ${booking.bookingNumber} has been updated`,
          data: {
            bookingId: booking._id,
            actionUrl: `/dashboard/bookings/${booking._id}`,
            actionText: 'View Booking',
          },
        })
      }

      if (booking.vendorId?.owner) {
        await Notification.createNotification({
          recipient: booking.vendorId.owner,
          sender: session.user.id,
          type: 'booking_updated',
          title: 'Booking Updated',
          message: `Booking ${booking.bookingNumber} has been updated`,
          data: {
            bookingId: booking._id,
            actionUrl: `/dashboard/bookings/${booking._id}`,
            actionText: 'View Booking',
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      message: 'Booking updated successfully',
    })
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}

// DELETE /api/bookings - Cancel booking
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('bookingId')

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 })
    }

    await connectDB()

    // Dynamically import the Booking model
    const { Booking } = await import('@/lib/models/booking')
    const { Notification } = await import('@/lib/models/notification')

    const booking = await Booking.findById(bookingId)
      .populate('clientId', 'firstName lastName email')
      .populate('venueId', 'name owner')
      .populate('vendorId', 'businessName owner')

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check permissions
    const isOwner = booking.venueId?.owner?.toString() === session.user.id ||
                   booking.vendorId?.owner?.toString() === session.user.id
    const isClient = booking.clientId._id.toString() === session.user.id
    const isAdmin = session.user.role === 'admin'

    if (!isOwner && !isClient && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Cancel booking
    await Booking.findByIdAndUpdate(bookingId, { status: 'cancelled' })

    // Create notification for cancellation
    if (isOwner || isAdmin) {
      // Notify client
      await Notification.createNotification({
        recipient: booking.clientId._id,
        sender: session.user.id,
        type: 'booking_cancelled',
        title: 'Booking Cancelled',
        message: `Your booking ${booking.bookingNumber} has been cancelled`,
        data: {
          bookingId: booking._id,
          actionUrl: `/dashboard/bookings/${booking._id}`,
          actionText: 'View Booking',
        },
      })
    } else if (isClient) {
      // Notify venue/vendor owners
      if (booking.venueId?.owner) {
        await Notification.createNotification({
          recipient: booking.venueId.owner,
          sender: session.user.id,
          type: 'booking_cancelled',
          title: 'Booking Cancelled',
          message: `Booking ${booking.bookingNumber} has been cancelled by the client`,
          data: {
            bookingId: booking._id,
            actionUrl: `/dashboard/bookings/${booking._id}`,
            actionText: 'View Booking',
          },
        })
      }

      if (booking.vendorId?.owner) {
        await Notification.createNotification({
          recipient: booking.vendorId.owner,
          sender: session.user.id,
          type: 'booking_cancelled',
          title: 'Booking Cancelled',
          message: `Booking ${booking.bookingNumber} has been cancelled by the client`,
          data: {
            bookingId: booking._id,
            actionUrl: `/dashboard/bookings/${booking._id}`,
            actionText: 'View Booking',
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully',
    })
  } catch (error) {
    console.error('Error cancelling booking:', error)
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    )
  }
} 