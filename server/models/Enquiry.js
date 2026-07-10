const mongoose = require('mongoose');

const enquirySchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String },
    city: { type: String },
    destination: { type: String },
    subject: { type: String },
    message: { type: String },
    package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
    status: { type: String, enum: ['pending', 'contacted', 'booked'], default: 'pending' }
}, {
    timestamps: true
});

module.exports = mongoose.model('Enquiry', enquirySchema);
