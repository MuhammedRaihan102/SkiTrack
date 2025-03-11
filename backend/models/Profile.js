const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bio: {
        type: String,
        default: ''
    },
    profilePicture: {
        type: String,
        default: ''
    },
    socialLinks: {
        github: String,
        linkedin: String,
        portfolio: String
    },
    experience: [{
        title: String,
        company: String,
        years: Number,
        description: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);