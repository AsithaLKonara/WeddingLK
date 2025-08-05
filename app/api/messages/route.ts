import { NextRequest, NextResponse } from 'next/server'

// Mock messages data storage
const messages = [
  {
    id: 'msg_1',
    conversationId: 'conv_1',
    senderId: 'user_123',
    recipientId: 'vendor_1',
    content: 'Hi! I\'m interested in your photography package for my wedding.',
    type: 'text',
    status: 'read',
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'msg_2',
    conversationId: 'conv_1',
    senderId: 'vendor_1',
    recipientId: 'user_123',
    content: 'Hello! Thank you for your interest. I\'d be happy to discuss your wedding photography needs.',
    type: 'text',
    status: 'read',
    timestamp: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 'msg_3',
    conversationId: 'conv_1',
    senderId: 'user_123',
    recipientId: 'vendor_1',
    content: 'Great! What packages do you offer and what are your rates?',
    type: 'text',
    status: 'delivered',
    timestamp: new Date(Date.now() - 900000).toISOString()
  }
]

const conversations = [
  {
    id: 'conv_1',
    participants: ['user_123', 'vendor_1'],
    lastMessage: 'Great! What packages do you offer and what are your rates?',
    lastMessageTime: new Date(Date.now() - 900000).toISOString(),
    unreadCount: 0
  },
  {
    id: 'conv_2',
    participants: ['user_123', 'venue_1'],
    lastMessage: 'Your venue tour is confirmed for tomorrow at 2 PM.',
    lastMessageTime: new Date(Date.now() - 86400000).toISOString(),
    unreadCount: 1
  }
]

// POST /api/messages - Send message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { conversationId, recipientId, content, type } = body

    if (!recipientId || !content) {
      return NextResponse.json({
        error: 'Recipient ID and content are required'
      }, { status: 400 })
    }

    // Create new message
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const newMessage = {
      id: messageId,
      conversationId: conversationId || `conv_${Date.now()}`,
      senderId: 'user_123',
      recipientId,
      content,
      type: type || 'text',
      status: 'sent',
      timestamp: new Date().toISOString()
    }

    // Add to messages array
    messages.push(newMessage)

    // Update conversation
    const conversation = conversations.find(c => c.id === newMessage.conversationId)
    if (conversation) {
      conversation.lastMessage = content
      conversation.lastMessageTime = newMessage.timestamp
    } else {
      conversations.push({
        id: newMessage.conversationId,
        participants: ['user_123', recipientId],
        lastMessage: content,
        lastMessageTime: newMessage.timestamp,
        unreadCount: 0
      })
    }

    return NextResponse.json({
      success: true,
      data: newMessage,
      message: 'Message sent successfully'
    })

  } catch (error) {
    console.error('Message send error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send message',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// GET /api/messages - Get messages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!conversationId) {
      // Return conversations list
      return NextResponse.json({
        success: true,
        data: conversations,
        total: conversations.length
      })
    }

    // Return messages for specific conversation
    const conversationMessages = messages
      .filter(message => message.conversationId === conversationId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    return NextResponse.json({
      success: true,
      data: conversationMessages.slice(-limit),
      total: conversationMessages.length
    })

  } catch (error) {
    console.error('Messages fetch error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch messages',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
} 