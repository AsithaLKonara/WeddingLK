import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/user"
import { Vendor } from "@/lib/models/vendor"
import { Venue } from "@/lib/models/venue"
import { Booking } from "@/lib/models/booking"
import { Review } from "@/lib/models/review"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Get total counts using proper models
    const totalUsers = await User.countDocuments({ role: 'user' })
    const totalVendors = await Vendor.countDocuments({ isVerified: true, isActive: true })
    const totalVenues = await Venue.countDocuments({ isActive: true })
    const totalBookings = await Booking.countDocuments({ status: 'completed' })
    const totalReviews = await Review.countDocuments({ isVerified: true, isActive: true })

    // Calculate average rating
    const reviews = await Review.find({ isVerified: true, isActive: true }).lean()
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0

    // Get success rate (completed vs total bookings)
    const totalBookingsCount = await Booking.countDocuments()
    const successRate = totalBookingsCount > 0 
      ? Math.round((totalBookings / totalBookingsCount) * 100) 
      : 0

    // Get top categories
    const vendorCategories = await Vendor.aggregate([
      { $match: { isVerified: true, isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ])

    // Get recent testimonials
    const recentTestimonials = await Review.find({ 
      isVerified: true, 
      isActive: true,
      rating: { $gte: 4 }
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean()

    const stats = {
      overview: {
        totalUsers,
        totalVendors,
        totalVenues,
        totalBookings,
        totalReviews
      },
      performance: {
        averageRating: Math.round(averageRating * 10) / 10,
        successRate,
        totalBookingsCount
      },
      categories: vendorCategories,
      testimonials: recentTestimonials
    }

    return NextResponse.json({ stats })

  } catch (error) {
    console.error("Error fetching home stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch home stats" },
      { status: 500 }
    )
  }
} 