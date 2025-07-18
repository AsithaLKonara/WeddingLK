import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Client } from "@/lib/models/client"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const clients = await Client.find({ plannerId: session.user.id }).sort({ createdAt: -1 })
    return NextResponse.json({ clients })
  } catch (error) {
    console.error("Get clients error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { name, email, phone, weddingDate } = await request.json()

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newClient = await Client.create({ plannerId: session.user.id, name, email, phone, weddingDate })
    return NextResponse.json({ client: newClient })
  } catch (error) {
    console.error("Create client error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { id, ...update } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Client ID required" }, { status: 400 })
    }

    const client = await Client.findOneAndUpdate({ _id: id, plannerId: session.user.id }, update, { new: true })
    
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    return NextResponse.json({ client })
  } catch (error) {
    console.error("Update client error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Client ID required" }, { status: 400 })
    }

    const result = await Client.deleteOne({ _id: id, plannerId: session.user.id })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete client error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
