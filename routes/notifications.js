// server/routes/notifications.js
const router = require('express').Router();
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const { verifyToken } = require('../verifyToken');

// GET total unread message count for a user
router.get('/unread-count', verifyToken, async (req, res) => {
    try {
        const conversations = await Conversation.find({ members: { $in: [req.user.id] } });
        const conversationIds = conversations.map(c => c._id);

        const count = await Message.countDocuments({
            conversationId: { $in: conversationIds },
            senderId: { $ne: req.user.id }, // Count messages not sent by the current user
            isRead: false
        });
        res.status(200).json({ count });
    } catch (err) {
        res.status(500).json(err);
    }
});

// MARK messages in a conversation as read
router.put('/read/:conversationId', verifyToken, async (req, res) => {
    try {
        await Message.updateMany(
            { conversationId: req.params.conversationId, senderId: { $ne: req.user.id } },
            { $set: { isRead: true } }
        );
        res.status(200).json("Messages marked as read.");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;