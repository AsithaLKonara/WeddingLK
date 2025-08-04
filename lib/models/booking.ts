import mongoose from "mongoose"

const BookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: true,
      index: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    guestCount: {
      type: Number,
      required: true,
      min: 1,
    },
    eventType: {
      type: String,
      enum: ["wedding", "engagement", "reception", "ceremony", "other"],
      default: "wedding",
    },
    requirements: {
      type: String,
      maxlength: 1000,
    },
    budget: {
      amount: { type: Number },
      currency: { type: String, default: "LKR" },
    },
    contactInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed", "refunded"],
      default: "pending",
      index: true,
    },
    price: {
      amount: { type: Number },
      currency: { type: String, default: "LKR" },
      breakdown: [
        {
          item: { type: String },
          amount: { type: Number },
          description: { type: String },
        },
      ],
    },
    payment: {
      status: {
        type: String,
        enum: ["pending", "partial", "completed", "failed", "refunded"],
        default: "pending",
      },
      method: {
        type: String,
        enum: ["stripe", "bank_transfer", "cash", "other"],
      },
      transactionId: { type: String },
      amountPaid: { type: Number, default: 0 },
      paidAt: { type: Date },
      dueDate: { type: Date },
      installments: [
        {
          amount: { type: Number },
          dueDate: { type: Date },
          status: {
            type: String,
            enum: ["pending", "paid", "overdue"],
            default: "pending",
          },
          paidAt: { type: Date },
        },
      ],
    },
    notes: {
      client: { type: String },
      venue: { type: String },
      vendor: { type: String },
      admin: { type: String },
    },
    timeline: {
      setupTime: { type: Date },
      startTime: { type: Date },
      endTime: { type: Date },
      cleanupTime: { type: Date },
    },
    services: [
      {
        serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
        name: { type: String },
        description: { type: String },
        price: { type: Number },
        quantity: { type: Number, default: 1 },
      },
    ],
    addons: [
      {
        name: { type: String },
        description: { type: String },
        price: { type: Number },
        quantity: { type: Number, default: 1 },
      },
    ],
    documents: [
      {
        name: { type: String },
        url: { type: String },
        type: { type: String },
        uploadedAt: { type: Date, default: Date.now },
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    cancellation: {
      reason: { type: String },
      cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      cancelledAt: { type: Date },
      refundAmount: { type: Number },
      refundStatus: {
        type: String,
        enum: ["pending", "processed", "completed", "failed"],
      },
    },
    metadata: {
      source: { type: String, enum: ["website", "phone", "email", "walk_in"], default: "website" },
      campaign: { type: String },
      referrer: { type: String },
      userAgent: { type: String },
      ipAddress: { type: String },
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
BookingSchema.index({ clientId: 1, date: -1 })
BookingSchema.index({ venueId: 1, date: 1 })
BookingSchema.index({ vendorId: 1, date: -1 })
BookingSchema.index({ status: 1, date: 1 })
BookingSchema.index({ "payment.status": 1, "payment.dueDate": 1 })

// Virtual for total amount
BookingSchema.virtual("totalAmount").get(function () {
  let total = this.price?.amount || 0
  
  // Add service costs
  if (this.services) {
    total += this.services.reduce((sum: number, service: any) => 
      sum + (service.price * service.quantity), 0)
  }
  
  // Add addon costs
  if (this.addons) {
    total += this.addons.reduce((sum: number, addon: any) => 
      sum + (addon.price * addon.quantity), 0)
  }
  
  return total
})

// Virtual for remaining amount
BookingSchema.virtual("remainingAmount").get(function () {
  const total = this.price?.amount || 0
  const paid = this.payment?.amountPaid || 0
  return Math.max(0, total - paid)
})

// Virtual for payment percentage
BookingSchema.virtual("paymentPercentage").get(function () {
  const total = this.price?.amount || 0
  if (total === 0) return 0
  const paid = this.payment?.amountPaid || 0
  return Math.round((paid / total) * 100)
})

// Pre-save middleware
BookingSchema.pre("save", function (next) {
  // Generate booking number if not provided
  if (!this.bookingNumber) {
    this.bookingNumber = `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`
  }
  
  // Update payment status based on amount paid
  if (this.payment?.amountPaid && this.price?.amount) {
    if (this.payment.amountPaid >= this.price.amount) {
      this.payment.status = "completed"
    } else if (this.payment.amountPaid > 0) {
      this.payment.status = "partial"
    }
  }
  
  next()
})

// Static method to get booking statistics
BookingSchema.statics.getStats = async function (userId: string, role: string) {
  const query: any = {}
  
  if (role === "couple") {
    query.clientId = userId
  } else if (role === "vendor") {
    query.vendorId = userId
  } else if (role === "admin") {
    // Admins can see all stats
  }
  
  const stats = await this.aggregate([
    { $match: query },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalRevenue: { $sum: "$payment.amountPaid" },
      },
    },
  ])
  
  return stats
}

// Static method to get upcoming bookings
BookingSchema.statics.getUpcomingBookings = async function (userId: string, role: string, days = 30) {
  const query: any = {
    date: { $gte: new Date(), $lte: new Date(Date.now() + days * 24 * 60 * 60 * 1000) },
    status: { $in: ["confirmed", "pending"] },
  }
  
  if (role === "couple") {
    query.clientId = userId
  } else if (role === "vendor") {
    query.vendorId = userId
  }
  
  return this.find(query)
    .populate("clientId", "firstName lastName email phone")
    .populate("venueId", "name location")
    .populate("vendorId", "businessName contact")
    .sort({ date: 1 })
}

// Static method to get booking analytics
BookingSchema.statics.getAnalytics = async function (userId: string, role: string, period = "month") {
  const query: any = {}
  
  if (role === "couple") {
    query.clientId = userId
  } else if (role === "vendor") {
    query.vendorId = userId
  }
  
  const startDate = new Date()
  if (period === "week") {
    startDate.setDate(startDate.getDate() - 7)
  } else if (period === "month") {
    startDate.setMonth(startDate.getMonth() - 1)
  } else if (period === "year") {
    startDate.setFullYear(startDate.getFullYear() - 1)
  }
  
  query.createdAt = { $gte: startDate }
  
  const analytics = await this.aggregate([
    { $match: query },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        bookings: { $sum: 1 },
        revenue: { $sum: "$payment.amountPaid" },
        avgBookingValue: { $avg: "$payment.amountPaid" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
  ])
  
  return analytics
}

// Instance method to add payment
BookingSchema.methods.addPayment = function (amount: number, method: string, transactionId?: string) {
  if (!this.payment) {
    this.payment = {
      status: "pending",
      amountPaid: 0,
      installments: [],
    }
  }
  
  this.payment.amountPaid += amount
  this.payment.method = method
  if (transactionId) this.payment.transactionId = transactionId
  this.payment.paidAt = new Date()
  
  // Update payment status
  if (this.payment.amountPaid >= this.totalAmount) {
    this.payment.status = "completed"
  } else if (this.payment.amountPaid > 0) {
    this.payment.status = "partial"
  }
  
  return this.save()
}

// Instance method to cancel booking
BookingSchema.methods.cancelBooking = function (reason: string, cancelledBy: string, refundAmount?: number) {
  this.status = "cancelled"
  this.cancellation = {
    reason,
    cancelledBy,
    cancelledAt: new Date(),
    refundAmount: refundAmount || this.payment?.amountPaid || 0,
    refundStatus: refundAmount ? "pending" : "completed",
  }
  
  return this.save()
}

// Instance method to add review
BookingSchema.methods.addReview = function (userId: string, rating: number, comment: string) {
  if (!this.reviews) {
    this.reviews = []
  }
  
  // Check if user already reviewed
  const existingReview = this.reviews.find((r: any) => r.user.toString() === userId)
  if (existingReview) {
    existingReview.rating = rating
    existingReview.comment = comment
  } else {
    this.reviews.push({
      user: userId,
      rating,
      comment,
      createdAt: new Date(),
    })
  }
  
  return this.save()
}

// Instance method to add service
BookingSchema.methods.addService = function (serviceData: any) {
  if (!this.services) {
    this.services = []
  }
  
  this.services.push(serviceData)
  return this.save()
}

// Instance method to add addon
BookingSchema.methods.addAddon = function (addonData: any) {
  if (!this.addons) {
    this.addons = []
  }
  
  this.addons.push(addonData)
  return this.save()
}

export const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema) 