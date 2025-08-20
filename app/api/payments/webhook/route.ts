import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Booking } from "@/lib/models/booking"
import { sendEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { paymentId, status, amount, bookingId, customerEmail, customerName } = body

    console.log("Payment webhook received:", { paymentId, status, amount, bookingId })

    // Process payment status update
    if (status === "completed") {
      console.log(`Payment ${paymentId} completed for booking ${bookingId}`)

      // Update booking status to confirmed
      const updatedBooking = await Booking.findByIdAndUpdate(bookingId, {
        status: "confirmed",
        paymentStatus: "paid",
        paymentId,
        paidAt: new Date()
      }, { new: true })

      if (updatedBooking) {
        console.log(`Booking ${bookingId} status updated to confirmed`)

      // Send confirmation email
        try {
          await sendEmail({
            to: customerEmail,
            subject: "Payment Confirmed - Your Booking is Confirmed! 🎉",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4F46E5;">Payment Confirmed! 🎉</h2>
                <p>Dear ${customerName},</p>
                <p>Great news! Your payment has been successfully processed and your booking is now confirmed.</p>
                
                <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0;">Booking Details:</h3>
                  <p><strong>Booking ID:</strong> ${bookingId}</p>
                  <p><strong>Amount Paid:</strong> LKR ${amount}</p>
                  <p><strong>Payment ID:</strong> ${paymentId}</p>
                  <p><strong>Status:</strong> Confirmed</p>
                </div>
                
                <p>You will receive further details about your booking shortly. If you have any questions, please don't hesitate to contact our support team.</p>
                
                <p>Thank you for choosing WeddingLK!</p>
                <p>Best regards,<br>The WeddingLK Team</p>
              </div>
            `
          })
          console.log("Payment confirmation email sent successfully")
        } catch (emailError) {
          console.error("Failed to send confirmation email:", emailError)
        }
      }
    } else if (status === "failed") {
      console.log(`Payment ${paymentId} failed for booking ${bookingId}`)
      
      // Update booking status to payment failed
      await Booking.findByIdAndUpdate(bookingId, {
        status: "pending",
        paymentStatus: "failed",
        paymentId
      })

      // Send failure notification email
      try {
        await sendEmail({
          to: customerEmail,
          subject: "Payment Failed - Action Required",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #DC2626;">Payment Failed</h2>
              <p>Dear ${customerName},</p>
              <p>We're sorry, but your payment could not be processed. Please try again or contact our support team for assistance.</p>
              
              <div style="background: #FEF2F2; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Booking Details:</h3>
                <p><strong>Booking ID:</strong> ${bookingId}</p>
                <p><strong>Amount:</strong> LKR ${amount}</p>
                <p><strong>Status:</strong> Payment Failed</p>
              </div>
              
              <p>Please visit your dashboard to retry the payment or contact us if you need help.</p>
              
              <p>Best regards,<br>The WeddingLK Team</p>
            </div>
          `
        })
      } catch (emailError) {
        console.error("Failed to send failure email:", emailError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Payment webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
