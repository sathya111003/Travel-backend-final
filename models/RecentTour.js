const mongoose = require('mongoose');

const recentTourSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        packageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Package',
            required: false,
        },
        image: {
            type: String,
            required: true,
        },
        images: {
            type: [String],
            default: [],
        },
        days: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        videoUrl: {
            type: String,
            required: false,
        },
        videoUrls: {
            type: [String],
            default: [],
        },
        audioUrl: {
            type: String,
            required: false,
        }
    },
    {
        timestamps: true,
    }
);

const RecentTour = mongoose.model('RecentTour', recentTourSchema);
module.exports = RecentTour;
