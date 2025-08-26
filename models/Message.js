// server/models/Message.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    conversationId: {
        type: String,
    },
    senderId: {
        type: String,
    },
    text: {
        type: String,
    },
    isRead: { type: Boolean, default: false }, // <-- ADD THIS
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);