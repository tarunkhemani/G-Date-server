// server/models/Conversation.js
// server/models/Conversation.js
// server/models/Conversation.js
const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    members: {
        type: Array,
        required: true,
    },
}, { timestamps: true });

// --- FIX ---: This tells MongoDB to enforce a rule that the 'members' array
// must be unique across all documents in this collection.
// This is the strongest possible defense against duplicates.
ConversationSchema.index({ members: 1 }, { unique: true });

module.exports = mongoose.model('Conversation', ConversationSchema);
// const mongoose = require('mongoose');

// const ConversationSchema = new mongoose.Schema({
//     // --- FIX ---: The 'unique: true' index makes it impossible for the database
//     // to store two documents with the exact same pair of members.
//     members: {
//         type: Array,
//         required: true,
//     },
// }, { timestamps: true });

// // This ensures that the combination of members is unique
// ConversationSchema.index({ members: 1 }, { unique: true });

// module.exports = mongoose.model('Conversation', ConversationSchema);
// const mongoose = require('mongoose');

// const ConversationSchema = new mongoose.Schema({
//     members: {
//         type: Array,
//     },
// }, { timestamps: true });

// module.exports = mongoose.model('Conversation', ConversationSchema);