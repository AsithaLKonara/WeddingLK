import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import User from "@/lib/models/user"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    
    // Get user's messages
    const user = await User.findById(session.user.id).populate('messages')
    
    return NextResponse.json({
      success: true,
      messages: user.messages || []
    })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { recipientId, recipientType, subject, message } = await request.json()
    
    if (!recipientId || !recipientType || !subject || !message) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 })
    }

    await connectDB()
    
    const sender = await User.findById(session.user.id)
    if (!sender) {
      return NextResponse.json({ success: false, error: "Sender not found" }, { status: 404 })
    }

    const recipient = await User.findById(recipientId)
    if (!recipient) {
      return NextResponse.json({ success: false, error: "Recipient not found" }, { status: 404 })
    }

    // Create message object
    const messageObj = {
      senderId: session.user.id,
      recipientId,
      recipientType,
      subject,
      message,
      timestamp: new Date(),
      read: false
    }

    // Add message to sender's messages
    if (!sender.messages) {
      sender.messages = []
    }
    sender.messages.push(messageObj)
    await sender.save()

    // Add message to recipient's messages
    if (!recipient.messages) {
      recipient.messages = []
    }
    recipient.messages.push(messageObj)
    await recipient.save()

    return NextResponse.json({ success: true, message: "Message sent successfully" })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { messageId, action } = await request.json()
    
    if (!messageId || !action) {
      return NextResponse.json({ success: false, error: "Message ID and action are required" }, { status: 400 })
    }

    await connectDB()
    
    const user = await User.findById(session.user.id)
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Find and update the message
    if (user.messages) {
      const messageIndex = user.messages.findIndex((msg: any) => msg._id.toString() === messageId)
      if (messageIndex !== -1) {
        if (action === 'mark_read') {
          user.messages[messageIndex].read = true
        } else if (action === 'delete') {
          user.messages.splice(messageIndex, 1)
        }
        await user.save()
      }
    }

    return NextResponse.json({ success: true, message: "Message updated successfully" })
  } catch (error) {
    console.error("Error updating message:", error)
    return NextResponse.json({ success: false, error: "Failed to update message" }, { status: 500 })
  }
} 