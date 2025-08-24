// server/routes/messages.js
const router = require('express').Router();
const Message = require('../models/Message');
const Conversation = require('../models/Conversation'); // <-- ADD THIS

// Add a message
router.post('/', async (req, res) => {
    const newMessage = new Message(req.body);
    try {
        const savedMessage = await newMessage.save();
        // --- NEW ---: Update the conversation's timestamp
        await Conversation.findByIdAndUpdate(req.body.conversationId, { updatedAt: new Date() });
        res.status(200).json(savedMessage);
    } catch (err) {
        res.status(500).json(err);
    }
});
// // Add a message
// router.post('/', async (req, res) => {
//     const newMessage = new Message(req.body);
//     try {
//         const savedMessage = await newMessage.save();
//         res.status(200).json(savedMessage);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// Get messages for a conversation
router.get('/:conversationId', async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;