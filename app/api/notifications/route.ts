import { NextRequest, NextResponse } from 'next/server'

// Mock notifications data storage
const notifications = [
  {
    id: 'notif_1',
    title: 'Booking Confirmed',
    message: 'Your booking at Grand Ballroom Hotel has been confirmed for December 15th, 2024.',
    type: 'success',
    read: false,
    userId: 'user_123',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    actionUrl: '/dashboard/bookings'
  },
  {
    id: 'notif_2',
    title: 'Payment Received',
    message: 'Payment of LKR 50,000 has been received for your venue booking.',
    type: 'info',
    read: false,
    userId: 'user_123',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    actionUrl: '/dashboard/payments'
  },
  {
    id: 'notif_3',
    title: 'New Message',
    message: 'You have a new message from Perfect Moments Photography.',
    type: 'info',
    read: true,
    userId: 'user_123',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    actionUrl: '/dashboard/messages'
  },
  {
    id: 'notif_4',
    title: 'Task Reminder',
    message: 'Don\'t forget to finalize your guest list by next week.',
    type: 'warning',
    read: false,
    userId: 'user_123',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    actionUrl: '/planning?tab=guest-list'
  },
  {
    id: 'notif_5',
    title: 'Venue Tour Scheduled',
    message: 'Your venue tour at Garden Palace is scheduled for tomorrow at 2 PM.',
    type: 'info',
    read: true,
    userId: 'user_123',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    actionUrl: '/dashboard/bookings'
  }
]

// GET /api/notifications - Get notifications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type')

    let filteredNotifications = notifications

    if (type && type !== 'all') {
      filteredNotifications = notifications.filter(notification => notification.type === type)
    }

    return NextResponse.json({
      success: true,
      data: filteredNotifications.slice(0, limit),
      total: filteredNotifications.length,
      unreadCount: filteredNotifications.filter(n => !n.read).length
    })

  } catch (error) {
    console.error('Notifications fetch error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch notifications',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// POST /api/notifications - Mark notification as read
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { notificationId, action } = body

    if (!notificationId || !action) {
      return NextResponse.json({
        error: 'Notification ID and action are required'
      }, { status: 400 })
    }

    const notification = notifications.find(n => n.id === notificationId)
    if (!notification) {
      return NextResponse.json({
        error: 'Notification not found'
      }, { status: 404 })
    }

    // Update notification based on action
    if (action === 'mark_read') {
      notification.read = true
    } else if (action === 'delete') {
      const index = notifications.findIndex(n => n.id === notificationId)
      if (index > -1) {
        notifications.splice(index, 1)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Notification updated successfully'
    })

  } catch (error) {
    console.error('Notification update error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update notification',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
} 