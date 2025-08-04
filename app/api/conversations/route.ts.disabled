import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Conversation } from '@/lib/models/conversation'
import { Message } from '@/lib/models/message'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/conversations - Get user conversations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const includeArchived = searchParams.get('includeArchived') === 'true'
    const type = searchParams.get('type')

    await connectDB()

    const options: any = {
      limit,
      offset,
      includeArchived,
    }

    if (type) {
      options.type = type
    }

    const conversations = await Conversation.getUserConversations(session.user.id, options)

    // Get unread counts for each conversation
    const conversationsWithUnreadCounts = await Promise.all(
      conversations.map(async (conversation: any) => {
        const unreadCount = await Message.countDocuments({
          conversationId: conversation._id,
          recipient: session.user.id,
          isRead: false,
          isDeleted: false,
        })

        return {
          ...conversation.toObject(),
          unreadCount,
        }
      })
    )

    return NextResponse.json({
      success: true,
      conversations: conversationsWithUnreadCounts,
      hasMore: conversations.length === limit,
    })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}

// POST /api/conversations - Create new conversation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      participants,
      conversationType = 'direct',
      title,
      description,
      bookingId,
      venueId,
      vendorId,
    } = body

    if (!participants || participants.length === 0) {
      return NextResponse.json({ error: 'At least one participant is required' }, { status: 400 })
    }

    // Add current user to participants if not already included
    const currentUserParticipant = {
      user: session.user.id,
      role: session.user.role || 'user',
    }

    const allParticipants = participants.some((p: any) => p.user === session.user.id)
      ? participants
      : [currentUserParticipant, ...participants]

    await connectDB()

    // Create conversation
    const conversation = await Conversation.create({
      participants: allParticipants,
      conversationType,
      title,
      description,
      bookingId,
      venueId,
      vendorId,
      metadata: {
        createdBy: session.user.id,
        purpose: bookingId ? 'booking' : 'general',
      },
    })

    const populatedConversation = await Conversation.findById(conversation._id)
      .populate('participants.user', 'firstName lastName email profileImage userType')
      .populate('bookingId', 'bookingNumber date')
      .populate('venueId', 'name')
      .populate('vendorId', 'businessName')

    return NextResponse.json({
      success: true,
      conversation: populatedConversation,
    })
  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    )
  }
}

// PUT /api/conversations - Update conversation
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { conversationId, title, description, settings } = body

    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 })
    }

    await connectDB()

    const conversation = await Conversation.findById(conversationId)
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Check if user is participant
    const isParticipant = conversation.participants.some(
      (p: any) => p.user.toString() === session.user.id
    )
    if (!isParticipant) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Update conversation
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (settings !== undefined) updateData.settings = settings

    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversationId,
      updateData,
      { new: true }
    )
      .populate('participants.user', 'firstName lastName email profileImage userType')
      .populate('bookingId', 'bookingNumber date')
      .populate('venueId', 'name')
      .populate('vendorId', 'businessName')

    return NextResponse.json({
      success: true,
      conversation: updatedConversation,
    })
  } catch (error) {
    console.error('Error updating conversation:', error)
    return NextResponse.json(
      { error: 'Failed to update conversation' },
      { status: 500 }
    )
  }
}

// DELETE /api/conversations - Archive conversation
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')

    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 })
    }

    await connectDB()

    const conversation = await Conversation.findById(conversationId)
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Check if user is participant
    const isParticipant = conversation.participants.some(
      (p: any) => p.user.toString() === session.user.id
    )
    if (!isParticipant) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Archive conversation for this user
    await conversation.archive(session.user.id)

    return NextResponse.json({
      success: true,
      message: 'Conversation archived successfully',
    })
  } catch (error) {
    console.error('Error archiving conversation:', error)
    return NextResponse.json(
      { error: 'Failed to archive conversation' },
      { status: 500 }
    )
  }
} 