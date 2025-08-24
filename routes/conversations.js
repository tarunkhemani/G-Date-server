// server/routes/conversations.js
// server/routes/conversations.js
// server/routes/conversations.js
// server/routes/conversations.js
// server/routes/conversations.js
// server/routes/conversations.js
const router = require('express').Router();
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// GET all conversations for a user, with details of the other user
router.get('/:userId', async (req, res) => {
    try {
        const conversations = await Conversation.find({
            members: { $in: [req.params.userId] },
        }).sort({ updatedAt: -1 });

        const chatPartnerData = await Promise.all(
            conversations.map(async (conversation) => {
                const otherMemberId = conversation.members.find(
                    (member) => member !== req.params.userId
                );
                if (otherMemberId) {
                    const user = await User.findById(otherMemberId);
                    if (user) {
                        const { password, ...otherDetails } = user._doc;
                        return { ...otherDetails, conversationId: conversation._id };
                    }
                }
                return null;
            })
        );
        
        // Safety net to filter out any potential nulls or duplicates before sending
        const uniqueChatPartners = Array.from(new Map(chatPartnerData.filter(p => p).map(p => [p.conversationId, p])).values());
        res.status(200).json(uniqueChatPartners);

    } catch (err) {
        res.status(500).json(err);
    }
});

// POST a new conversation
router.post('/', async (req, res) => {
    const sortedMembers = [req.body.senderId, req.body.receiverId].sort();
    try {
        // This is an atomic "find one and if it doesn't exist, create it" operation.
        // It's much safer than a separate find() and then save().
        const conversation = await Conversation.findOneAndUpdate(
            { members: sortedMembers }, // Find a doc with these members
            { $setOnInsert: { members: sortedMembers } }, // If it doesn't exist, create it
            { new: true, upsert: true } // `upsert: true` is the key. `new: true` returns the doc.
        );
        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
// const router = require('express').Router();
// const Conversation = require('../models/Conversation');
// const User = require('../models/User');

// // GET all conversations for a user, with details of the other user
// router.get('/:userId', async (req, res) => {
//     try {
//         const conversations = await Conversation.find({
//             members: { $in: [req.params.userId] },
//         }).sort({ updatedAt: -1 });

//         const chatPartnerData = await Promise.all(
//             conversations.map(async (conversation) => {
//                 const otherMemberId = conversation.members.find(
//                     (member) => member !== req.params.userId
//                 );
//                 if (otherMemberId) {
//                     const user = await User.findById(otherMemberId);
//                     if (user) {
//                         const { password, ...otherDetails } = user._doc;
//                         return { ...otherDetails, conversationId: conversation._id };
//                     }
//                 }
//                 return null;
//             })
//         );

//         // --- FIX ---: Add a final "safety net" to remove any duplicates before sending.
//         // This creates a unique list of partners based on their user ID.
//         const uniqueChatPartners = Array.from(new Map(chatPartnerData.filter(p => p).map(p => [p._id, p])).values());

//         res.status(200).json(uniqueChatPartners);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// // POST a new conversation (with sorting to support the unique index)
// router.post('/', async (req, res) => {
//     const sortedMembers = [req.body.senderId, req.body.receiverId].sort();

//     try {
//         let conversation = await Conversation.findOne({
//             members: sortedMembers,
//         });

//         if (conversation) {
//             return res.status(200).json(conversation);
//         }
        
//         const newConversation = new Conversation({
//             members: sortedMembers,
//         });
//         const savedConversation = await newConversation.save();
//         res.status(200).json(savedConversation);

//     } catch (err) {
//         // Handle potential duplicate key error from the new index
//         if (err.code === 11000) {
//             // This can happen in a race condition. Find the existing doc and return it.
//             const existingConversation = await Conversation.findOne({ members: sortedMembers });
//             return res.status(200).json(existingConversation);
//         }
//         res.status(500).json(err);
//     }
// });

// module.exports = router;
// const router = require('express').Router();
// const Conversation = require('../models/Conversation');
// const User = require('../models/User');

// // GET all conversations for a user, with details of the other user
// router.get('/:userId', async (req, res) => {
//     try {
//         const conversations = await Conversation.find({
//             members: { $in: [req.params.userId] },
//         }).sort({ updatedAt: -1 });

//         const chatPartners = await Promise.all(
//             conversations.map(async (conversation) => {
//                 const otherMemberId = conversation.members.find(
//                     (member) => member !== req.params.userId
//                 );
//                 if (otherMemberId) {
//                     const user = await User.findById(otherMemberId);
//                     if (user) {
//                         const { password, ...otherDetails } = user._doc;
//                         return { ...otherDetails, conversationId: conversation._id };
//                     }
//                 }
//                 return null;
//             })
//         );
//         res.status(200).json(chatPartners.filter(p => p));
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// // POST a new conversation
// router.post('/', async (req, res) => {
//     // --- FIX ---: Sort the members array to ensure uniqueness
//     const sortedMembers = [req.body.senderId, req.body.receiverId].sort();

//     try {
//         let conversation = await Conversation.findOne({
//             members: { $all: sortedMembers },
//         });

//         if (conversation) {
//             return res.status(200).json(conversation);
//         }
        
//         const newConversation = new Conversation({
//             members: sortedMembers,
//         });
//         const savedConversation = await newConversation.save();
//         res.status(200).json(savedConversation);

//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// module.exports = router;
// const router = require('express').Router();
// const Conversation = require('../models/Conversation');
// const User = require('../models/User');

// // GET all conversations for a user, with details of the other user
// router.get('/:userId', async (req, res) => {
//     try {
//         // Find all conversations the user is a part of
//         const conversations = await Conversation.find({
//             members: { $in: [req.params.userId] },
//         }).sort({ updatedAt: -1 }); // Sort by most recently updated

//         // For each conversation, get the details of the OTHER user
//         const chatPartners = await Promise.all(
//             conversations.map(async (conversation) => {
//                 const otherMemberId = conversation.members.find(
//                     (member) => member !== req.params.userId
//                 );
//                 // If there's another member, fetch their details
//                 if (otherMemberId) {
//                     const user = await User.findById(otherMemberId);
//                     if (user) {
//                         const { password, ...otherDetails } = user._doc;
//                         return { ...otherDetails, conversationId: conversation._id };
//                     }
//                 }
//                 return null;
//             })
//         );

//         // Filter out any null results (e.g., deleted users)
//         res.status(200).json(chatPartners.filter(p => p));
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });


// // POST a new conversation (no change to this logic)
// router.post('/', async (req, res) => {
//     try {
//         let conversation = await Conversation.findOne({
//             members: { $all: [req.body.senderId, req.body.receiverId] },
//         });
//         if (conversation) {
//             return res.status(200).json(conversation);
//         }
//         const newConversation = new Conversation({
//             members: [req.body.senderId, req.body.receiverId],
//         });
//         const savedConversation = await newConversation.save();
//         res.status(200).json(savedConversation);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });


// module.exports = router;
// const router = require('express').Router();
// const Conversation = require('../models/Conversation');

// // Start a new conversation
// router.post('/', async (req, res) => {
//     // Check if a conversation between these two users already exists
//     try {
//         let conversation = await Conversation.findOne({
//             members: { $all: [req.body.senderId, req.body.receiverId] },
//         });

//         if (conversation) {
//             // If it exists, return the existing conversation
//             return res.status(200).json(conversation);
//         }

//         // If it doesn't exist, create a new one
//         const newConversation = new Conversation({
//             members: [req.body.senderId, req.body.receiverId],
//         });
//         const savedConversation = await newConversation.save();
//         res.status(200).json(savedConversation);

//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// module.exports = router;