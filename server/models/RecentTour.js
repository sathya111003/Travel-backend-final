const mongoose = require('mongoose');

const recentTourSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
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
