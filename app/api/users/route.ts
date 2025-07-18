import { type NextRequest, NextResponse } from "next/server"

// Mock user data
const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "couple",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "vendor",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      data: users,
      count: users.length,
    })

    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch users",
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
    if (!body.name || !body.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          required: ["name", "email"],
        },
        { status: 400 },
      )
    }

    // Check if email already exists
    const existingUser = users.find((user) => user.email === body.email)
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Email already exists",
        },
        { status: 409 },
      )
    }

    const newUser = {
      id: Math.max(...users.map((u) => u.id), 0) + 1,
      name: body.name,
      email: body.email,
      role: body.role || "couple",
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)

    const response = NextResponse.json(
      {
        success: true,
        data: newUser,
        message: "User created successfully",
      },
      { status: 201 },
    )

    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create user",
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
