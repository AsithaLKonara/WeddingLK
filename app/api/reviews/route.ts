import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Review } from "@/lib/models/review"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { venueId, rating, comment, title } = await request.json()

    if (!venueId || !rating || !comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already reviewed this venue
    const existingReview = await Review.findOne({ venueId, userId: session.user.id })
    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this venue" }, { status: 400 })
    }

    const review = await Review.create({
      venueId,
      userId: session.user.id,
      rating: Number.parseInt(rating),
      comment,
      title,
      createdAt: new Date(),
    })

    return NextResponse.json({ review })
  } catch (error) {
    console.error("Create review error:", error)
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
    const { id, rating, comment, title } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Review ID required" }, { status: 400 })
    }

    const review = await Review.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { rating: Number.parseInt(rating), comment, title },
      { new: true }
    )

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    return NextResponse.json({ review })
  } catch (error) {
    console.error("Update review error:", error)
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
      return NextResponse.json({ error: "Review ID required" }, { status: 400 })
    }

    const result = await Review.deleteOne({ _id: id, userId: session.user.id })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete review error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
