import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Vendor } from "@/lib/models/vendor"

// Mock vendor data
const vendors = [
  {
    id: 1,
    name: "Perfect Moments Photography",
    category: "Photography",
    location: "Colombo",
    rating: 4.9,
    price: 75000,
    portfolio: ["/placeholder.svg?height=300&width=400"],
    contact: {
      phone: "+94771234567",
      email: "info@perfectmoments.lk",
    },
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    name: "Delicious Catering Co.",
    category: "Catering",
    location: "Galle",
    rating: 4.7,
    price: 2500,
    portfolio: ["/placeholder.svg?height=300&width=400"],
    contact: {
      phone: "+94771234568",
      email: "orders@deliciouscatering.lk",
    },
    createdAt: "2024-01-01T00:00:00.000Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get("vendorId")
    if (vendorId) {
      const vendor = await Vendor.findById(vendorId)
      if (!vendor) {
        return NextResponse.json({ success: false, error: "Vendor not found" }, { status: 404 })
      }
      return NextResponse.json({ success: true, vendor })
    }
    const category = searchParams.get("category")
    const location = searchParams.get("location")

    let filteredVendors = vendors

    if (category) {
      filteredVendors = filteredVendors.filter((vendor) =>
        vendor.category.toLowerCase().includes(category.toLowerCase()),
      )
    }

    if (location) {
      filteredVendors = filteredVendors.filter((vendor) =>
        vendor.location.toLowerCase().includes(location.toLowerCase()),
      )
    }

    const response = NextResponse.json({
      success: true,
      data: filteredVendors,
      count: filteredVendors.length,
      filters: { category, location },
    })

    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  } catch (error) {
    console.error("Error fetching vendors:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch vendors",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.category || !body.location) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          required: ["name", "category", "location"],
        },
        { status: 400 },
      )
    }

    const newVendor = {
      id: Math.max(...vendors.map((v) => v.id), 0) + 1,
      name: body.name,
      category: body.category,
      location: body.location,
      rating: body.rating || 0,
      price: Number(body.price) || 0,
      portfolio: body.portfolio || ["/placeholder.svg?height=300&width=400"],
      contact: {
        phone: body.contact?.phone || "",
        email: body.contact?.email || "",
      },
      createdAt: new Date().toISOString(),
    }

    vendors.push(newVendor)

    const response = NextResponse.json(
      {
        success: true,
        data: newVendor,
        message: "Vendor created successfully",
      },
      { status: 201 },
    )

    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  } catch (error) {
    console.error("Error creating vendor:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create vendor",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const { vendorId, services, portfolio, packages, availability, onboardingComplete } = body
    if (!vendorId) {
      return NextResponse.json({ success: false, error: "Missing vendorId" }, { status: 400 })
    }
    const update: any = {}
    if (services) update.services = services
    if (portfolio) update.portfolio = portfolio
    if (packages) update["pricing.packages"] = packages
    if (availability) update.availability = availability
    if (typeof onboardingComplete === 'boolean') update.onboardingComplete = onboardingComplete
    const vendor = await Vendor.findByIdAndUpdate(vendorId, { $set: update }, { new: true })
    if (!vendor) {
      return NextResponse.json({ success: false, error: "Vendor not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, vendor })
  } catch (error) {
    console.error("Error updating vendor onboarding:", error)
    return NextResponse.json({ success: false, error: "Failed to update vendor onboarding", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
