const mongoose = require('mongoose');

const destinationSchema = mongoose.Schema({
    region: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['domestic', 'international'],
        required: true
    },
    cities: [{
        name: { type: String, required: true },
        image: { type: String, required: true },
        description: { type: String }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Destination', destinationSchema);
