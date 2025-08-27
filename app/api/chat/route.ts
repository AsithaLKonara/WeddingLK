import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db/mongodb'
import { ObjectId } from 'mongodb'

interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  content: string
  type: 'text' | 'image' | 'voice' | 'file'
  timestamp: Date
  status: 'sent' | 'delivered' | 'read'
  replyTo?: {
    messageId: string
    content: string
    senderName: string
  }
}

interface Conversation {
  id: string
  participants: string[]
  type: 'direct' | 'group'
  lastMessage?: {
    content: string
    timestamp: Date
    senderId: string
  }
  unreadCount: Record<string, number>
  metadata?: {
    title?: string
    image?: string
    description?: string
  }
  createdAt: Date
  updatedAt: Date
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const conversationId = searchParams.get('conversationId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const conversationsCollection = db.collection('conversations')
    const messagesCollection = db.collection('chat_messages')
    const usersCollection = db.collection('users')

    if (conversationId) {
      // Get messages for a specific conversation
      const messages = await messagesCollection
        .find({ conversationId })
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray()

      // Get conversation details
      const conversation = await conversationsCollection.findOne({
        _id: new ObjectId(conversationId)
      })

      if (!conversation) {
        return NextResponse.json(
          { success: false, error: 'Conversation not found' },
          { status: 404 }
        )
      }

      // Mark messages as read for this user
      await messagesCollection.updateMany(
        { 
          conversationId, 
          senderId: { $ne: userId },
          status: { $ne: 'read' }
        },
        { $set: { status: 'read' } }
      )

      // Reset unread count for this user
      await conversationsCollection.updateOne(
        { _id: new ObjectId(conversationId) },
        { $set: { [`unreadCount.${userId}`]: 0 } }
      )

      // Enrich messages with sender information
      const enrichedMessages: ChatMessage[] = await Promise.all(
        messages.map(async (message) => {
          const sender = await usersCollection.findOne(
            { _id: new ObjectId(message.senderId) },
            { projection: { name: 1, profile: 1 } }
          )

          return {
            id: message._id.toString(),
            conversationId: message.conversationId,
            senderId: message.senderId,
            content: message.content,
            type: message.type || 'text',
            timestamp: message.timestamp,
            status: message.status,
            replyTo: message.replyTo
          }
        })
      )

      return NextResponse.json({
        success: true,
        data: {
          conversation: {
            id: conversation._id.toString(),
            participants: conversation.participants,
            type: conversation.type,
            lastMessage: conversation.lastMessage,
            metadata: conversation.metadata,
            createdAt: conversation.createdAt,
            updatedAt: conversation.updatedAt
          },
          messages: enrichedMessages.reverse(), // Show oldest first
          pagination: {
            page,
            limit,
            total: await messagesCollection.countDocuments({ conversationId }),
            totalPages: Math.ceil(await messagesCollection.countDocuments({ conversationId }) / limit)
          }
        }
      })

    } else {
      // Get user's conversations
      const conversations = await conversationsCollection
        .find({ participants: userId })
        .sort({ updatedAt: -1 })
        .toArray()

      // Enrich conversations with participant information and last message
      const enrichedConversations: Conversation[] = await Promise.all(
        conversations.map(async (conv) => {
          // Get other participants' info
          const otherParticipants = conv.participants.filter((p: string) => p !== userId)
          const participantsInfo = await Promise.all(
            otherParticipants.map(async (participantId: string) => {
              const user = await usersCollection.findOne(
                { _id: new ObjectId(participantId) },
                { projection: { name: 1, profile: 1 } }
              )
              return {
                id: participantId,
                name: user?.name || 'Unknown User',
                avatar: user?.profile?.avatar || '/avatars/default.jpg'
              }
            })
          )

          return {
            id: conv._id.toString(),
            participants: conv.participants,
            type: conv.type,
            lastMessage: conv.lastMessage,
            unreadCount: conv.unreadCount || {},
            metadata: conv.metadata,
            createdAt: conv.createdAt,
            updatedAt: conv.updatedAt
          }
        })
      )

      return NextResponse.json({
        success: true,
        data: {
          conversations: enrichedConversations
        }
      })
    }

  } catch (error) {
    console.error('Error fetching chat data:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch chat data' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      conversationId, 
      senderId, 
      content, 
      type = 'text',
      replyTo,
      participants 
    } = body

    if (!senderId || !content) {
      return NextResponse.json(
        { success: false, error: 'Sender ID and content are required' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const messagesCollection = db.collection('chat_messages')
    const conversationsCollection = db.collection('conversations')

    let actualConversationId = conversationId

    // Create new conversation if not provided
    if (!conversationId && participants) {
      const newConversation = {
        participants: participants.length === 2 ? participants : [senderId, ...participants],
        type: participants.length === 2 ? 'direct' : 'group',
        unreadCount: {},
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const convResult = await conversationsCollection.insertOne(newConversation)
      actualConversationId = convResult.insertedId.toString()

      // Initialize unread counts for all participants except sender
      const unreadUpdates: any = {}
      participants.forEach((participantId: string) => {
        if (participantId !== senderId) {
          unreadUpdates[`unreadCount.${participantId}`] = 1
        }
      })

      if (Object.keys(unreadUpdates).length > 0) {
        await conversationsCollection.updateOne(
          { _id: convResult.insertedId },
          { $set: unreadUpdates }
        )
      }
    }

    // Create the message
    const newMessage = {
      conversationId: actualConversationId,
      senderId,
      content,
      type,
      timestamp: new Date(),
      status: 'sent',
      replyTo: replyTo ? {
        messageId: replyTo.messageId,
        content: replyTo.content,
        senderName: replyTo.senderName
      } : undefined
    }

    const messageResult = await messagesCollection.insertOne(newMessage)

    // Update conversation with last message and unread counts
    const updateData: any = {
      updatedAt: new Date(),
      lastMessage: {
        content,
        timestamp: newMessage.timestamp,
        senderId
      }
    }

    // Increment unread count for other participants
    const conversation = await conversationsCollection.findOne({
      _id: new ObjectId(actualConversationId)
    })

    if (conversation) {
      const otherParticipants = conversation.participants.filter((p: string) => p !== senderId)
      otherParticipants.forEach((participantId: string) => {
        updateData[`unreadCount.${participantId}`] = 
          (conversation.unreadCount?.[participantId] || 0) + 1
      })
    }

    await conversationsCollection.updateOne(
      { _id: new ObjectId(actualConversationId) },
      { $set: updateData }
    )

    return NextResponse.json({
      success: true,
      data: {
        messageId: messageResult.insertedId.toString(),
        conversationId: actualConversationId,
        message: 'Message sent successfully'
      }
    })

  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send message' 
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { messageId, action, conversationId, userId } = body

    if (!messageId || !action) {
      return NextResponse.json(
        { success: false, error: 'Message ID and action are required' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const messagesCollection = db.collection('chat_messages')

    let updateData: any = {}

    switch (action) {
      case 'mark_read':
        updateData.status = 'read'
        break
      case 'mark_delivered':
        updateData.status = 'delivered'
        break
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

    const result = await messagesCollection.updateOne(
      { _id: new ObjectId(messageId) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        message: `Message ${action.replace('_', ' ')} successfully`
      }
    })

  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update message' 
      },
      { status: 500 }
    )
  }
}
