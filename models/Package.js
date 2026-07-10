const mongoose = require('mongoose');

const itinerarySchema = mongoose.Schema({
    day: { type: Number, required: true },
    title: { type: String, required: true },
    activities: [{
        time: String,
        description: String
    }],
    places: [String],
    food: {
        breakfast: { name: String, included: Boolean },
        lunch: { name: String, included: Boolean },
        dinner: { name: String, included: Boolean }
    },
    travel: String
});

const packageSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        duration: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['domestic', 'international'],
            default: 'domestic'
        },
        location: {
            city: { type: String, required: true },
            country: { type: String, required: true },
            lat: { type: Number },
            lng: { type: Number }
        },
        images: [String],
        hotel: {
            name: String,
            rating: Number,
            image: String,
            amenities: [String],
            description: String
        },
        highlights: [String],
        exclusions: [String],
        rates: [{
            pax: String,
            price: Number
        }],
        tourOverview: String,
        itinerary: [itinerarySchema]
    },
    {
        timestamps: true,
    }
);

const Package = mongoose.model('Package', packageSchema);
module.exports = Package;
