const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        package: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Package',
        },
        travelDate: {
            type: Date,
            required: true,
        },
        bookingDate: {
            type: Date,
            default: Date.now,
        },
        persons: {
            type: Number,
            required: true,
            default: 1
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'booked', 'cancelled'],
            default: 'pending',
        },
        payment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Payment'
        }
    },
    {
        timestamps: true,
    }
);

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
