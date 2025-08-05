import mongoose, { Schema, Document } from 'mongoose'

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId
  bookingId?: mongoose.Types.ObjectId
  type: 'booking' | 'subscription' | 'commission' | 'refund'
  amount: number
  currency: string
  method: 'card' | 'payhere' | 'ezcash' | 'mcash' | 'bank_transfer'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  description: string
  transactionId?: string
  gatewayResponse?: any
  createdAt: Date
  updatedAt: Date
}

const PaymentSchema = new Schema<IPayment>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking'
  },
  type: {
    type: String,
    enum: ['booking', 'subscription', 'commission', 'refund'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'LKR'
  },
  method: {
    type: String,
    enum: ['card', 'payhere', 'ezcash', 'mcash', 'bank_transfer'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  description: {
    type: String,
    required: true
  },
  transactionId: {
    type: String
  },
  gatewayResponse: {
    type: Schema.Types.Mixed
  }
}, {
  timestamps: true
})

// Indexes
PaymentSchema.index({ userId: 1 })
PaymentSchema.index({ bookingId: 1 })
PaymentSchema.index({ type: 1 })
PaymentSchema.index({ status: 1 })
PaymentSchema.index({ createdAt: 1 })

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema) 