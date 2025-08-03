import mongoose from "mongoose"

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file", "booking_request", "booking_update", "payment_notification", "review_notification"],
      default: "text",
    },
    attachments: [
      {
        type: {
          type: String,
          enum: ["image", "document", "video"],
          required: true,
        },
        url: { type: String, required: true },
        filename: { type: String },
        size: { type: Number },
        mimeType: { type: String },
      },
    ],
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      index: true,
    },
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      index: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      index: true,
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
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
    originalContent: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    reactions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        emoji: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    metadata: {
      userAgent: { type: String },
      ipAddress: { type: String },
      deviceType: { type: String },
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
MessageSchema.index({ conversationId: 1, createdAt: -1 })
MessageSchema.index({ sender: 1, createdAt: -1 })
MessageSchema.index({ recipient: 1, isRead: 1 })
MessageSchema.index({ bookingId: 1, createdAt: -1 })

// Virtual for message status
MessageSchema.virtual("status").get(function () {
  if (this.isDeleted) return "deleted"
  if (this.isRead) return "read"
  if (this.isDelivered) return "delivered"
  return "sent"
})

// Pre-save middleware
MessageSchema.pre("save", function (next) {
  if (this.isModified("isRead") && this.isRead && !this.readAt) {
    this.readAt = new Date()
  }
  if (this.isModified("isDelivered") && this.isDelivered && !this.deliveredAt) {
    this.deliveredAt = new Date()
  }
  if (this.isModified("content") && this.isEdited && !this.editedAt) {
    this.editedAt = new Date()
  }
  next()
})

// Static method to get unread count
MessageSchema.statics.getUnreadCount = async function (userId: string) {
  return this.countDocuments({
    recipient: userId,
    isRead: false,
    isDeleted: false,
  })
}

// Static method to mark messages as read
MessageSchema.statics.markAsRead = async function (messageIds: string[], userId: string) {
  return this.updateMany(
    {
      _id: { $in: messageIds },
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

// Instance method to soft delete message
MessageSchema.methods.softDelete = function (userId: string) {
  this.isDeleted = true
  this.deletedAt = new Date()
  this.deletedBy = userId
  return this.save()
}

// Instance method to edit message
MessageSchema.methods.edit = function (newContent: string) {
  if (!this.originalContent) {
    this.originalContent = this.content
  }
  this.content = newContent
  this.isEdited = true
  this.editedAt = new Date()
  return this.save()
}

export const Message = mongoose.models.Message || mongoose.model("Message", MessageSchema) 