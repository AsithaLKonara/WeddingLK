import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing email or password' },
        { status: 400 }
      )
    }

    // For development, allow any credentials
    // In production, this would verify against the database
    return NextResponse.json(
      { 
        success: true, 
        user: { email, name: 'Demo User', role: 'user' },
        message: 'Login successful (development mode)'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
