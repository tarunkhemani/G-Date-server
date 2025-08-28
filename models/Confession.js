// server/models/Confession.js
const mongoose = require('mongoose');

const ConfessionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        maxLength: 500 // Let's add a character limit
    },
}, { timestamps: true });

module.exports = mongoose.model('Confession', ConfessionSchema);