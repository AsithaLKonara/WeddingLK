import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, role } = body

    // Basic validation
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // For development, just return success
    // In production, this would create a user in the database
    return NextResponse.json(
      { 
        success: true, 
        user: { email, name, role },
        message: 'User registered successfully (development mode)'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to check registration status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }
    
    // For development, just return success
    // In production, this would check if a user with the email exists
    return NextResponse.json({
      exists: true,
      message: 'User exists (development mode)'
    });
    
  } catch (error) {
    console.error('Registration status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check registration status' },
      { status: 500 }
    );
  }
}
