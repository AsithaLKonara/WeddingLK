import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Message } from '@/lib/models/message'
import { Conversation } from '@/lib/models/conversation'
import { Notification } from '@/lib/models/notification'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/messages - Get messages for a conversation
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const before = searchParams.get('before') // For pagination

    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 })
    }

    await connectDB()

    // Verify user is part of the conversation
    const conversation = await Conversation.findById(conversationId)
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    const isParticipant = conversation.participants.some(
      (p: any) => p.user.toString() === session.user.id
    )
    if (!isParticipant) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Build query
    const query: any = {
      conversationId,
      isDeleted: false,
    }

    if (before) {
      query.createdAt = { $lt: new Date(before) }
    }

    // Get messages
    const messages = await Message.find(query)
      .populate('sender', 'firstName lastName email profileImage userType')
      .populate('recipient', 'firstName lastName email profileImage userType')
      .populate('replyTo', 'content sender')
      .populate('reactions.user', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)

    // Mark messages as read
    const unreadMessages = messages.filter(
      (msg: any) => msg.recipient._id.toString() === session.user.id && !msg.isRead
    )

    if (unreadMessages.length > 0) {
      const messageIds = unreadMessages.map((msg: any) => msg._id)
      await Message.markAsRead(messageIds, session.user.id)
      
      // Update conversation unread count
      await conversation.markAsRead(session.user.id)
    }

    return NextResponse.json({
      success: true,
      messages: messages.reverse(), // Return in chronological order
      hasMore: messages.length === limit,
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// POST /api/messages - Send a new message
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      conversationId,
      recipientId,
      content,
      messageType = 'text',
      attachments = [],
      bookingId,
      venueId,
      vendorId,
      replyTo,
    } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 })
    }

    if (content.length > 2000) {
      return NextResponse.json({ error: 'Message too long (max 2000 characters)' }, { status: 400 })
    }

    await connectDB()

    let conversation
    let actualRecipientId = recipientId

    // If conversationId is provided, use existing conversation
    if (conversationId) {
      conversation = await Conversation.findById(conversationId)
      if (!conversation) {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
      }

      // Verify user is part of the conversation
      const isParticipant = conversation.participants.some(
        (p: any) => p.user.toString() === session.user.id
      )
      if (!isParticipant) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }

      // Get recipient from conversation
      const recipientParticipant = conversation.participants.find(
        (p: any) => p.user.toString() !== session.user.id && p.isActive
      )
      if (recipientParticipant) {
        actualRecipientId = recipientParticipant.user.toString()
      }
    } else {
      // Create new conversation if needed
      if (!recipientId) {
        return NextResponse.json({ error: 'Recipient ID is required for new conversations' }, { status: 400 })
      }

      // Check if direct conversation already exists
      conversation = await Conversation.findOne({
        conversationType: 'direct',
        'participants.user': { $all: [session.user.id, recipientId] },
        'participants': { $size: 2 },
        isActive: true,
      })

      if (!conversation) {
        // Create new conversation
        conversation = await Conversation.create({
          participants: [
            { user: session.user.id, role: session.user.role || 'user' },
            { user: recipientId, role: 'user' }, // You might want to get actual role
          ],
          conversationType: 'direct',
          bookingId,
          venueId,
          vendorId,
        })
      }
    }

    // Create message
    const message = await Message.create({
      conversationId: conversation._id,
      sender: session.user.id,
      recipient: actualRecipientId,
      content: content.trim(),
      messageType,
      attachments,
      bookingId,
      venueId,
      vendorId,
      replyTo,
      metadata: {
        userAgent: request.headers.get('user-agent') || '',
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
        deviceType: 'web',
      },
    })

    // Populate message with user data
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'firstName lastName email profileImage userType')
      .populate('recipient', 'firstName lastName email profileImage userType')
      .populate('replyTo', 'content sender')

    // Update conversation last message
    await conversation.updateLastMessage(populatedMessage)

    // Create notification for recipient
    await Notification.createNotification({
      recipient: actualRecipientId,
      sender: session.user.id,
      type: 'new_message',
      title: `New message from ${populatedMessage.sender.firstName}`,
      message: content.length > 50 ? `${content.substring(0, 50)}...` : content,
      data: {
        messageId: message._id,
        conversationId: conversation._id,
        actionUrl: `/dashboard/messages?conversation=${conversation._id}`,
        actionText: 'View Message',
      },
    })

    return NextResponse.json({
      success: true,
      message: populatedMessage,
      conversation: {
        id: conversation._id,
        lastMessage: conversation.lastMessage,
      },
    })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

// PUT /api/messages - Update message (edit)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { messageId, content } = body

    if (!messageId || !content) {
      return NextResponse.json({ error: 'Message ID and content are required' }, { status: 400 })
    }

    if (content.length > 2000) {
      return NextResponse.json({ error: 'Message too long (max 2000 characters)' }, { status: 400 })
    }

    await connectDB()

    const message = await Message.findById(messageId)
    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    // Check if user is the sender
    if (message.sender.toString() !== session.user.id) {
      return NextResponse.json({ error: 'You can only edit your own messages' }, { status: 403 })
    }

    // Check if message is too old to edit (e.g., 15 minutes)
    const editTimeLimit = 15 * 60 * 1000 // 15 minutes in milliseconds
    if (Date.now() - message.createdAt.getTime() > editTimeLimit) {
      return NextResponse.json({ error: 'Message is too old to edit' }, { status: 400 })
    }

    // Edit message
    await message.edit(content)

    const updatedMessage = await Message.findById(messageId)
      .populate('sender', 'firstName lastName email profileImage userType')
      .populate('recipient', 'firstName lastName email profileImage userType')

    return NextResponse.json({
      success: true,
      message: updatedMessage,
    })
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    )
  }
}

// DELETE /api/messages - Delete message
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const messageId = searchParams.get('messageId')

    if (!messageId) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 })
    }

    await connectDB()

    const message = await Message.findById(messageId)
    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    // Check if user is the sender or admin
    if (message.sender.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'You can only delete your own messages' }, { status: 403 })
    }

    // Soft delete message
    await message.softDelete(session.user.id)

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    )
  }
} 