// // server/routes/connections.js
// server/routes/connections.js
// server/routes/connections.js
// server/routes/connections.js
const router = require('express').Router();
const User = require('../models/User');
const { verifyToken } = require('../verifyToken');

// --- NEW ---: GET all pending and sent requests for the current user
router.get('/requests', verifyToken, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id)
            .populate('connectionRequests', '-password') // Populate details for incoming requests
            .exec();

        // Find users to whom the current user has sent a request
        const sentRequests = await User.find({
            connectionRequests: req.user.id
        }).select('-password');

        res.status(200).json({ 
            pendingRequests: currentUser.connectionRequests, 
            sentRequests: sentRequests 
        });
    } catch (err) {
        res.status(500).json(err);
    }
});


// SEND a connection request (or ACCEPT an existing one)
router.post('/request', verifyToken, async (req, res) => {
    const { receiverId } = req.body;
    const senderId = req.user.id;
    try {
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);
        if (!receiver) return res.status(404).json("User not found.");

        if (sender.connectionRequests.includes(receiverId)) {
            await sender.updateOne({ $addToSet: { connections: receiverId } });
            await receiver.updateOne({ $addToSet: { connections: senderId } });
            await sender.updateOne({ $pull: { connectionRequests: receiverId } });
            return res.status(200).json({ message: "Connection accepted.", status: "connected" });
        } else {
            await receiver.updateOne({ $addToSet: { connectionRequests: senderId } });
            return res.status(200).json({ message: "Connection request sent.", status: "pending" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// ACCEPT a connection request
router.post('/accept', verifyToken, async (req, res) => {
    const { senderId } = req.body;
    const receiverId = req.user.id;
    try {
        await User.findByIdAndUpdate(receiverId, { $addToSet: { connections: senderId } });
        await User.findByIdAndUpdate(senderId, { $addToSet: { connections: receiverId } });
        await User.findByIdAndUpdate(receiverId, { $pull: { connectionRequests: senderId } });
        res.status(200).json({ message: "Connection accepted." });
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET a user's full profile, including connection status
router.get('/profile/:profileId', verifyToken, async (req, res) => {
    try {
        const profileUser = await User.findById(req.params.profileId).select('-password');
        const currentUser = await User.findById(req.user.id);
        if (!profileUser) return res.status(404).json("User not found");

        let status = 'none';
        if (currentUser.connections.includes(profileUser._id)) {
            status = 'connected';
        } else if (profileUser.connectionRequests.includes(currentUser._id)) {
            status = 'pending';
        } else if (currentUser.connectionRequests.includes(profileUser._id)) {
            status = 'awaiting-acceptance'; 
        }
        res.status(200).json({ profile: profileUser, status });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
// const router = require('express').Router();
// const User = require('../models/User');
// const { verifyToken } = require('../verifyToken');

// // SEND a connection request (or ACCEPT an existing one)
// router.post('/request', verifyToken, async (req, res) => {
//     const { receiverId } = req.body;
//     const senderId = req.user.id;

//     try {
//         const sender = await User.findById(senderId);
//         const receiver = await User.findById(receiverId);

//         if (!receiver) {
//             return res.status(404).json("User not found.");
//         }

//         // --- NEW LOGIC ---
//         // Check if the sender has a pending request from the receiver
//         if (sender.connectionRequests.includes(receiverId)) {
//             // This is an ACCEPT action.
//             // 1. Add each other to connections lists.
//             await sender.updateOne({ $addToSet: { connections: receiverId } });
//             await receiver.updateOne({ $addToSet: { connections: senderId } });
//             // 2. Remove the request from the sender's list.
//             await sender.updateOne({ $pull: { connectionRequests: receiverId } });

//             return res.status(200).json({ message: "Connection accepted.", status: "connected" });
//         } else {
//             // This is a new, one-way request.
//             // Add sender to receiver's request list, if not already there.
//             await receiver.updateOne({ $addToSet: { connectionRequests: senderId } });
//             return res.status(200).json({ message: "Connection request sent.", status: "pending" });
//         }
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// // ACCEPT a connection request (This route remains for a potential "Notifications" page)
// router.post('/accept', verifyToken, async (req, res) => {
//     const { senderId } = req.body;
//     const receiverId = req.user.id;
//     try {
//         await User.findByIdAndUpdate(receiverId, { $addToSet: { connections: senderId } });
//         await User.findByIdAndUpdate(senderId, { $addToSet: { connections: receiverId } });
//         await User.findByIdAndUpdate(receiverId, { $pull: { connectionRequests: senderId } });
//         res.status(200).json({ message: "Connection accepted." });
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// // GET a user's full profile, including connection status
// router.get('/profile/:profileId', verifyToken, async (req, res) => {
//     try {
//         const profileUser = await User.findById(req.params.profileId).select('-password');
//         const currentUser = await User.findById(req.user.id);

//         if (!profileUser) return res.status(404).json("User not found");

//         let status = 'none';
//         if (currentUser.connections.includes(profileUser._id)) {
//             status = 'connected';
//         } else if (profileUser.connectionRequests.includes(currentUser._id)) {
//             status = 'pending';
//         } else if (currentUser.connectionRequests.includes(profileUser._id)) {
//             // --- NEW ---: Check if the other user has sent you a request
//             status = 'awaiting-acceptance'; 
//         }

//         res.status(200).json({ profile: profileUser, status });
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// module.exports = router;
// const router = require('express').Router();
// const User = require('../models/User');
// const { verifyToken } = require('../verifyToken');

// // SEND a connection request (or ACCEPT an existing one)
// router.post('/request', verifyToken, async (req, res) => {
//     const { receiverId } = req.body;
//     const senderId = req.user.id;

//     try {
//         const sender = await User.findById(senderId);
//         const receiver = await User.findById(receiverId);

//         if (!receiver) {
//             return res.status(404).json("User not found.");
//         }

//         // --- NEW LOGIC ---
//         // Check if the sender has a pending request from the receiver
//         if (sender.connectionRequests.includes(receiverId)) {
//             // This is an ACCEPT action.
//             // 1. Add each other to connections lists.
//             await sender.updateOne({ $addToSet: { connections: receiverId } });
//             await receiver.updateOne({ $addToSet: { connections: senderId } });
//             // 2. Remove the request from the sender's list.
//             await sender.updateOne({ $pull: { connectionRequests: receiverId } });

//             return res.status(200).json({ message: "Connection accepted.", status: "connected" });
//         } else {
//             // This is a new, one-way request.
//             // Add sender to receiver's request list, if not already there.
//             await receiver.updateOne({ $addToSet: { connectionRequests: senderId } });
//             return res.status(200).json({ message: "Connection request sent.", status: "pending" });
//         }
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// // ACCEPT a connection request (This route remains for a potential "Notifications" page)
// router.post('/accept', verifyToken, async (req, res) => {
//     const { senderId } = req.body;
//     const receiverId = req.user.id;
//     try {
//         await User.findByIdAndUpdate(receiverId, { $addToSet: { connections: senderId } });
//         await User.findByIdAndUpdate(senderId, { $addToSet: { connections: receiverId } });
//         await User.findByIdAndUpdate(receiverId, { $pull: { connectionRequests: senderId } });
//         res.status(200).json({ message: "Connection accepted." });
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// // GET a user's full profile, including connection status
// router.get('/profile/:profileId', verifyToken, async (req, res) => {
//     try {
//         const profileUser = await User.findById(req.params.profileId).select('-password');
//         const currentUser = await User.findById(req.user.id);

//         if (!profileUser) return res.status(404).json("User not found");

//         let status = 'none';
//         if (currentUser.connections.includes(profileUser._id)) {
//             status = 'connected';
//         } else if (profileUser.connectionRequests.includes(currentUser._id)) {
//             status = 'pending';
//         } else if (currentUser.connectionRequests.includes(profileUser._id)) {
//             // --- NEW ---: Check if the other user has sent you a request
//             status = 'awaiting-acceptance'; 
//         }

//         res.status(200).json({ profile: profileUser, status });
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// module.exports = router;
// const router = require('express').Router();
// const User = require('../models/User');
// const { verifyToken } = require('../verifyToken');

// // SEND a connection request
// router.post('/request', verifyToken, async (req, res) => {
//     const { receiverId } = req.body;
//     const senderId = req.user.id;
//     try {
//         // Add sender to receiver's request list
//         await User.findByIdAndUpdate(receiverId, { $addToSet: { connectionRequests: senderId } });
//         res.status(200).json({ message: "Connection request sent." });
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// // ACCEPT a connection request
// router.post('/accept', verifyToken, async (req, res) => {
//     const { senderId } = req.body;
//     const receiverId = req.user.id;
//     try {
//         // Add each other to connections list
//         await User.findByIdAndUpdate(receiverId, { $addToSet: { connections: senderId } });
//         await User.findByIdAndUpdate(senderId, { $addToSet: { connections: receiverId } });
//         // Remove the request from the list
//         await User.findByIdAndUpdate(receiverId, { $pull: { connectionRequests: senderId } });
//         res.status(200).json({ message: "Connection accepted." });
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// // GET a user's full profile, including connection status
// router.get('/profile/:profileId', verifyToken, async (req, res) => {
//     try {
//         const profileUser = await User.findById(req.params.profileId).select('-password');
//         const currentUser = await User.findById(req.user.id);

//         if (!profileUser) return res.status(404).json("User not found");

//         // Determine the connection status
//         let status = 'none';
//         if (currentUser.connections.includes(profileUser._id)) {
//             status = 'connected';
//         } else if (profileUser.connectionRequests.includes(currentUser._id)) {
//             status = 'pending';
//         }

//         res.status(200).json({ profile: profileUser, status });
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });


// module.exports = router;