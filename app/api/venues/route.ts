import { type NextRequest, NextResponse } from "next/server"

// Mock venue data
const venues = [
  {
    id: 1,
    name: "Grand Ballroom Hotel",
    location: "Colombo",
    capacity: 300,
    price: 150000,
    rating: 4.8,
    images: ["/placeholder.svg?height=300&width=400"],
    amenities: ["Parking", "Catering", "Decoration", "Sound System"],
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    name: "Garden Paradise Resort",
    location: "Kandy",
    capacity: 200,
    price: 120000,
    rating: 4.6,
    images: ["/placeholder.svg?height=300&width=400"],
    amenities: ["Garden", "Pool", "Accommodation", "Photography"],
    createdAt: "2024-01-01T00:00:00.000Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    // Add CORS headers
    const response = NextResponse.json({
      success: true,
      data: venues,
      count: venues.length,
    })

    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  } catch (error) {
    console.error("Error fetching venues:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch venues",
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
    if (!body.name || !body.location || !body.capacity || !body.price) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          required: ["name", "location", "capacity", "price"],
        },
        { status: 400 },
      )
    }

    const newVenue = {
      id: Math.max(...venues.map((v) => v.id), 0) + 1,
      name: body.name,
      location: body.location,
      capacity: Number(body.capacity),
      price: Number(body.price),
      rating: body.rating || 0,
      images: body.images || ["/placeholder.svg?height=300&width=400"],
      amenities: body.amenities || [],
      createdAt: new Date().toISOString(),
    }

    venues.push(newVenue)

    const response = NextResponse.json(
      {
        success: true,
        data: newVenue,
        message: "Venue created successfully",
      },
      { status: 201 },
    )

    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  } catch (error) {
    console.error("Error creating venue:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create venue",
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
