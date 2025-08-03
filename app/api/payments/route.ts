import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Initialize Stripe
let stripe: any = null
async function getStripe() {
  if (!stripe) {
    const Stripe = await import('stripe')
    stripe = new Stripe.default(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
    })
  }
  return stripe
}

// POST /api/payments - Process payments
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, amount, currency, paymentMethod, metadata } = body

    await connectDB()

    // Process different payment types
    let response
    switch (type) {
      case "subscription":
        response = await processSubscriptionPayment(body)
        break
      case "commission":
        response = await processCommissionPayment(body)
        break
      case "booking":
        response = await processBookingPayment(body)
        break
      case "premium":
        response = await processPremiumPayment(body)
        break
      default:
        throw new Error("Invalid payment type")
    }

    return NextResponse.json({
      success: true,
      data: response,
      message: "Payment processed successfully",
    })
  } catch (error) {
    console.error("Payment processing error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Payment processing failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Process subscription payment
async function processSubscriptionPayment(data: any) {
  const { plan, vendorId, paymentMethod } = data

  // Dynamically import models
  const { User } = await import('@/lib/models/user')
  const { Vendor } = await import('@/lib/models/vendor')

  const stripe = await getStripe()

  // Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: plan.price * 100, // Convert to cents
    currency: 'lkr',
    payment_method_types: ['card'],
    metadata: {
      type: 'subscription',
      plan: plan.name,
      vendorId,
      description: `Wedding.lk ${plan.name} Subscription`,
    },
  })

  // Update vendor subscription
  if (vendorId) {
    await Vendor.findByIdAndUpdate(vendorId, {
      subscription: {
        plan: plan.name,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    })
  }

  return {
    paymentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
    status: paymentIntent.status,
    subscriptionId: `sub_${Date.now()}`,
    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  }
}

// Process commission payment
async function processCommissionPayment(data: any) {
  const { bookingId, vendorId, amount, location } = data

  // Dynamically import models
  const { Booking } = await import('@/lib/models/booking')
  const { Vendor } = await import('@/lib/models/vendor')

  // Location-based commission rates
  const commissionRates = {
    Colombo: 0.18,
    Gampaha: 0.16,
    Kandy: 0.15,
    Galle: 0.15,
    default: 0.12,
  }

  const rate = commissionRates[location as keyof typeof commissionRates] || commissionRates.default
  const commissionAmount = amount * rate

  // Update booking with commission
  await Booking.findByIdAndUpdate(bookingId, {
    'payment.commission': {
      amount: commissionAmount,
      rate,
      vendorAmount: amount - commissionAmount,
      status: 'pending_vendor_payout',
    },
  })

  // Update vendor earnings
  await Vendor.findByIdAndUpdate(vendorId, {
    $inc: { 'earnings.total': amount - commissionAmount },
  })

  return {
    commissionAmount,
    rate,
    vendorAmount: amount - commissionAmount,
    status: "pending_vendor_payout",
  }
}

// Process booking payment
async function processBookingPayment(data: any) {
  const { venueId, packageId, amount, installments, paymentMethodId } = data

  // Dynamically import models
  const { Booking } = await import('@/lib/models/booking')
  const { Venue } = await import('@/lib/models/venue')

  const stripe = await getStripe()

  if (installments && installments > 1) {
    // Process installment payment
    const installmentAmount = amount / installments

    // Create payment intent for first installment
    const paymentIntent = await stripe.paymentIntents.create({
      amount: installmentAmount * 100, // Convert to cents
      currency: 'lkr',
      payment_method_types: ['card'],
      metadata: {
        type: 'booking_installment',
        venueId,
        packageId,
        installmentNumber: 1,
        totalInstallments: installments,
      },
    })

    return {
      type: "installment",
      paymentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      totalAmount: amount,
      installmentAmount,
      installmentsRemaining: installments - 1,
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }
  } else {
    // Process full payment
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'lkr',
      payment_method_types: ['card'],
      metadata: {
        type: 'booking_full',
        venueId,
        packageId,
      },
    })

    return {
      type: "full_payment",
      paymentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      amount,
      status: "pending_confirmation",
      bookingConfirmed: false,
    }
  }
}

// Process premium payment
async function processPremiumPayment(data: any) {
  const { userId, plan, duration } = data

  // Dynamically import models
  const { User } = await import('@/lib/models/user')

  const stripe = await getStripe()

  // Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: plan.price * 100, // Convert to cents
    currency: 'lkr',
    payment_method_types: ['card'],
    metadata: {
      type: 'premium_upgrade',
      userId,
      plan: plan.name,
      duration,
    },
  })

  // Update user subscription
  await User.findByIdAndUpdate(userId, {
    subscription: {
      plan: plan.name,
      expiresAt: new Date(Date.now() + duration * 30 * 24 * 60 * 60 * 1000),
    },
  })

  return {
    paymentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
    premiumUntil: new Date(Date.now() + duration * 30 * 24 * 60 * 60 * 1000),
    features: plan.features,
    status: "pending_confirmation",
  }
}

// GET /api/payments - Get payment status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get('paymentId')

    if (!paymentId) {
      return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 })
    }

    const stripe = await getStripe()
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId)

    return NextResponse.json({
      success: true,
      payment: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata,
      },
    })
  } catch (error) {
    console.error('Error fetching payment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment' },
      { status: 500 }
    )
  }
}

// PUT /api/payments - Confirm payment
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { paymentId, bookingId } = body

    if (!paymentId) {
      return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 })
    }

    await connectDB()

    const stripe = await getStripe()
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId)

    if (paymentIntent.status === 'succeeded') {
      // Update booking status
      if (bookingId) {
        const { Booking } = await import('@/lib/models/booking')
        await Booking.findByIdAndUpdate(bookingId, {
          'payment.status': 'completed',
          'payment.transactionId': paymentId,
          'payment.paidAt': new Date(),
        })
      }

      return NextResponse.json({
        success: true,
        message: 'Payment confirmed successfully',
        status: 'completed',
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Payment not completed',
        status: paymentIntent.status,
      })
    }
  } catch (error) {
    console.error('Error confirming payment:', error)
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    )
  }
}
