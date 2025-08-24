// server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    course: { type: String, required: true },
    year: { type: String, required: true },
    gender: { type: String, required: true },
    bio: { type: String, required: true, maxLength: 150 },
    profilePic: { type: String, default: '' },
}, { timestamps: true }); // timestamps adds 'createdAt' and 'updatedAt' fields

module.exports = mongoose.model('User', UserSchema);