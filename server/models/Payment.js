const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Booking',
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: 'INR',
        },
        method: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            default: 'pending',
        },
        razorpay_order_id: {
            type: String,
        },
        razorpay_payment_id: {
            type: String,
        },
        paidAt: {
            type: Date,
        }
    },
    {
        timestamps: true,
    }
);

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
