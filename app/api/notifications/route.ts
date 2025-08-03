import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Notification } from '@/lib/models/notification'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/notifications - Get user notifications
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const type = searchParams.get('type')
    const isRead = searchParams.get('isRead')
    const includeArchived = searchParams.get('includeArchived') === 'true'

    await connectDB()

    const options: any = {
      limit,
      offset,
      includeArchived,
    }

    if (type) options.type = type
    if (isRead !== null) options.isRead = isRead === 'true'

    const notifications = await Notification.getUserNotifications(session.user.id, options)

    return NextResponse.json({
      success: true,
      notifications,
      hasMore: notifications.length === limit,
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

// POST /api/notifications - Create notification
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      recipientId,
      type,
      title,
      message,
      data = {},
      deliveryChannels = { inApp: true },
      scheduledFor,
      expiresAt,
    } = body

    if (!recipientId || !type || !title || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await connectDB()

    const notification = await Notification.createNotification({
      recipient: recipientId,
      sender: session.user.id,
      type,
      title,
      message,
      data,
      deliveryChannels,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      metadata: {
        userAgent: request.headers.get('user-agent') || '',
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
        deviceType: 'web',
      },
    })

    const populatedNotification = await Notification.findById(notification._id)
      .populate('sender', 'firstName lastName email profileImage')
      .populate('data.bookingId', 'bookingNumber date')
      .populate('data.venueId', 'name')
      .populate('data.vendorId', 'businessName')

    return NextResponse.json({
      success: true,
      notification: populatedNotification,
    })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}

// PUT /api/notifications - Mark notifications as read
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { notificationIds, markAllAsRead = false } = body

    await connectDB()

    if (markAllAsRead) {
      await Notification.markAllAsRead(session.user.id)
    } else if (notificationIds && notificationIds.length > 0) {
      await Notification.markAsRead(notificationIds, session.user.id)
    } else {
      return NextResponse.json({ error: 'No notification IDs provided' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: markAllAsRead ? 'All notifications marked as read' : 'Notifications marked as read',
    })
  } catch (error) {
    console.error('Error updating notifications:', error)
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    )
  }
}

// DELETE /api/notifications - Archive notification
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const notificationId = searchParams.get('notificationId')

    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 })
    }

    await connectDB()

    const notification = await Notification.findById(notificationId)
    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    // Check if user is the recipient
    if (notification.recipient.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    await notification.archive()

    return NextResponse.json({
      success: true,
      message: 'Notification archived successfully',
    })
  } catch (error) {
    console.error('Error archiving notification:', error)
    return NextResponse.json(
      { error: 'Failed to archive notification' },
      { status: 500 }
    )
  }
} 