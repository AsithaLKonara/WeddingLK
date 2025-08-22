import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/lib/models/user"
import { sendEmail } from "@/lib/email"

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }
    const otp = generateOTP()
    // Store OTP and expiry (5 min)
    user.twoFactorTemp = JSON.stringify({ code: otp, expires: Date.now() + 5 * 60 * 1000 })
    await user.save()
    
    // Send email with OTP
    // const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Two-Factor Authentication</h1>
        <p>Hi ${user.name || 'there'},</p>
        <p>Your verification code is:</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <h2 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h2>
        </div>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
        <p>Best regards,<br>The WeddingLK Team</p>
      </div>
    `

    await sendEmail(
      user.email,
      'Two-Factor Authentication Code',
      `Your 2FA code is: ${otp}. This code will expire in 10 minutes.`
    );

    return NextResponse.json({ success: true, message: "Verification code sent to your email." })
  } catch (error) {
    console.error("2FA send error:", error)
    return NextResponse.json({ success: false, error: "Failed to send verification code" }, { status: 500 })
  }
} 