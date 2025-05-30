const mongoose = require('mongoose')

const paymentInfoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'users',
    },
    serviceId: {
      type: mongoose.Types.ObjectId,
      ref: 'servicesAdmin',
    },
    amount: {
      type: Number,
    },
    transactionId: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
)

const paymentInfo = mongoose.model('paymentInfo', paymentInfoSchema)
module.exports = paymentInfo
