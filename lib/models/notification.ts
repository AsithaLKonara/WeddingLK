import mongoose from "mongoose"

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: [
        "booking_request",
        "booking_confirmed",
        "booking_cancelled",
        "booking_updated",
        "payment_received",
        "payment_failed",
        "new_review",
        "review_reply",
        "new_message",
        "message_reply",
        "service_updated",
        "venue_available",
        "vendor_available",
        "reminder",
        "system_announcement",
        "welcome",
        "verification",
        "password_reset",
        "subscription_expired",
        "subscription_renewed",
      ],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    message: {
      type: String,
      required: true,
      maxlength: 500,
    },
    data: {
      bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
      venueId: { type: mongoose.Schema.Types.ObjectId, ref: "Venue" },
      vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
      messageId: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
      conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
      reviewId: { type: mongoose.Schema.Types.ObjectId, ref: "Review" },
      paymentId: { type: String },
      amount: { type: Number },
      currency: { type: String },
      actionUrl: { type: String },
      actionText: { type: String },
      imageUrl: { type: String },
      priority: { type: String, enum: ["low", "normal", "high", "urgent"], default: "normal" },
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    deliveryChannels: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: false },
    },
    deliveryStatus: {
      inApp: { type: Boolean, default: false },
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: false },
    },
    scheduledFor: {
      type: Date,
      index: true,
    },
    expiresAt: {
      type: Date,
      index: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    archivedAt: {
      type: Date,
    },
    metadata: {
      userAgent: { type: String },
      ipAddress: { type: String },
      deviceType: { type: String },
      appVersion: { type: String },
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
NotificationSchema.index({ recipient: 1, createdAt: -1 })
NotificationSchema.index({ recipient: 1, isRead: 1 })
NotificationSchema.index({ recipient: 1, type: 1 })
NotificationSchema.index({ scheduledFor: 1, isDelivered: false })

// Virtual for notification status
NotificationSchema.virtual("status").get(function () {
  if (this.expiresAt && this.expiresAt < new Date()) return "expired"
  if (this.isRead) return "read"
  if (this.isDelivered) return "delivered"
  if (this.scheduledFor && this.scheduledFor > new Date()) return "scheduled"
  return "pending"
})

// Pre-save middleware
NotificationSchema.pre("save", function (next) {
  if (this.isModified("isRead") && this.isRead && !this.readAt) {
    this.readAt = new Date()
  }
  if (this.isModified("isDelivered") && this.isDelivered && !this.deliveredAt) {
    this.deliveredAt = new Date()
  }
  next()
})

// Static method to get unread count
NotificationSchema.statics.getUnreadCount = async function (userId: string) {
  return this.countDocuments({
    recipient: userId,
    isRead: false,
    isArchived: false,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } },
    ],
  })
}

// Static method to mark notifications as read
NotificationSchema.statics.markAsRead = async function (notificationIds: string[], userId: string) {
  return this.updateMany(
    {
      _id: { $in: notificationIds },
      recipient: userId,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
      },
    }
  )
}

// Static method to mark all notifications as read
NotificationSchema.statics.markAllAsRead = async function (userId: string) {
  return this.updateMany(
    {
      recipient: userId,
      isRead: false,
      isArchived: false,
    },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
      },
    }
  )
}

// Static method to create notification
NotificationSchema.statics.createNotification = async function (data: any) {
  const notification = new this(data)
  return notification.save()
}

// Static method to create multiple notifications
NotificationSchema.statics.createMultipleNotifications = async function (notifications: any[]) {
  return this.insertMany(notifications)
}

// Static method to get user notifications
NotificationSchema.statics.getUserNotifications = async function (userId: string, options: any = {}) {
  const { limit = 20, offset = 0, type, isRead, includeArchived = false } = options
  
  const query: any = {
    recipient: userId,
  }
  
  if (type) query.type = type
  if (isRead !== undefined) query.isRead = isRead
  if (!includeArchived) query.isArchived = false
  
  // Don't show expired notifications
  query.$or = [
    { expiresAt: { $exists: false } },
    { expiresAt: { $gt: new Date() } },
  ]
  
  return this.find(query)
    .populate("sender", "firstName lastName email profileImage")
    .populate("data.bookingId", "bookingNumber date")
    .populate("data.venueId", "name")
    .populate("data.vendorId", "businessName")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(offset)
}

// Instance method to mark as delivered
NotificationSchema.methods.markAsDelivered = function (channel: string) {
  this.isDelivered = true
  this.deliveredAt = new Date()
  this.deliveryStatus[channel] = true
  return this.save()
}

// Instance method to archive notification
NotificationSchema.methods.archive = function () {
  this.isArchived = true
  this.archivedAt = new Date()
  return this.save()
}

// Instance method to reschedule notification
NotificationSchema.methods.reschedule = function (newDate: Date) {
  this.scheduledFor = newDate
  this.isDelivered = false
  this.deliveredAt = undefined
  return this.save()
}

export const Notification = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema) 