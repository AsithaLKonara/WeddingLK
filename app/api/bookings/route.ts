import { NextRequest, NextResponse } from 'next/server'

// Mock bookings data storage
const bookings = [
  {
    id: 'booking_1',
    venueId: 'venue_1',
    venueName: 'Grand Ballroom Hotel',
    date: '2024-12-15',
    guestCount: 150,
    totalAmount: 50000,
    status: 'confirmed',
    userId: 'user_123',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'booking_2',
    venueId: 'venue_2',
    venueName: 'Garden Palace',
    date: '2024-11-20',
    guestCount: 100,
    totalAmount: 35000,
    status: 'pending',
    userId: 'user_123',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 'booking_3',
    venueId: 'venue_3',
    venueName: 'Ocean View Resort',
    date: '2024-10-10',
    guestCount: 200,
    totalAmount: 75000,
    status: 'cancelled',
    userId: 'user_123',
    createdAt: new Date(Date.now() - 259200000).toISOString()
  }
]

// Mock venue data for lookup
const venues = [
  { id: 'venue_1', name: 'Grand Ballroom Hotel' },
  { id: 'venue_2', name: 'Garden Palace' },
  { id: 'venue_3', name: 'Ocean View Resort' }
]

// POST /api/bookings - Create booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { venueId, vendorId, date, guestCount, totalAmount, services } = body

    if (!venueId || !date || !guestCount || !totalAmount) {
      return NextResponse.json({
        error: 'Venue ID, date, guest count, and total amount are required'
      }, { status: 400 })
    }

    // Find venue name
    const venue = venues.find(v => v.id === venueId)
    const venueName = venue ? venue.name : 'Unknown Venue'

    // Create new booking
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const newBooking = {
      id: bookingId,
      venueId,
      venueName,
      date,
      guestCount: parseInt(guestCount),
      totalAmount: parseFloat(totalAmount),
      services: services || [],
      status: 'pending',
      userId: 'user_123',
      createdAt: new Date().toISOString()
    }

    // Add to bookings array
    bookings.push(newBooking)

    return NextResponse.json({
      success: true,
      data: newBooking,
      message: 'Booking created successfully'
    })

  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Booking creation failed',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// GET /api/bookings - Get bookings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')

    let filteredBookings = bookings

    if (status) {
      filteredBookings = bookings.filter(booking => booking.status === status)
    }

    return NextResponse.json({
      success: true,
      data: filteredBookings.slice(0, limit),
      total: filteredBookings.length
    })

  } catch (error) {
    console.error('Bookings fetch error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch bookings',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
} 