// server/routes/users.js
// server/routes/users.js
// server/routes/users.js
// server/routes/users.js
const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { verifyToken } = require('../verifytoken');
const { upload } = require('../cloudinary');

// GET ALL USERS (No change here)
router.get('/', verifyToken, async (req, res) => {
    try {
        const users = await User.find();
        const usersWithoutPasswords = users.map(user => {
            const { password, ...otherDetails } = user._doc;
            return otherDetails;
        });
        res.status(200).json(usersWithoutPasswords);
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE USER PROFILE
router.put('/:id', verifyToken, upload.single('profilePic'), async (req, res) => {
    // Security check: Make sure the user is updating their own profile
    if (req.user.id !== req.params.id) {
        return res.status(403).json("You can only update your own account!");
    }

    try {
        const updateData = req.body;

        // If a new password is provided in the form, hash it.
        if (req.body.password && req.body.password !== '') {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(req.body.password, salt);
        } else {
            // --- FIX ---: If password is empty or not provided, remove it from the update object
            // to prevent accidentally erasing the user's existing password.
            delete updateData.password;
        }

        // If a new profile picture was uploaded, add its URL to the update data
        if (req.file) {
            updateData.profilePic = req.file.path;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true } // This option returns the updated document
        );

        const { password, ...otherDetails } = updatedUser._doc;
        res.status(200).json(otherDetails);

    } catch (err) {
        console.error("UPDATE ERROR:", err);
        res.status(500).json(err);
    }
});

module.exports = router;
// const router = require('express').Router();
// const User = require('../models/User');
// const { verifyToken } = require('../verifytoken');
// const { upload } = require('../cloudinary');

// // GET ALL USERS (This is the logic that was incomplete before)
// router.get('/', verifyToken, async (req, res) => {
//     try {
//         const users = await User.find();
//         // We don't want to send back passwords
//         const usersWithoutPasswords = users.map(user => {
//             const { password, ...otherDetails } = user._doc;
//             return otherDetails;
//         });
//         res.status(200).json(usersWithoutPasswords);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// // UPDATE USER PROFILE
// router.put('/:id', verifyToken, upload.single('profilePic'), async (req, res) => {
//     // Security check: Make sure the user is updating their own profile
//     if (req.user.id !== req.params.id) {
//         return res.status(403).json("You can only update your own account!");
//     }

//     try {
//         const updateData = {
//             ...req.body,
//         };

//         // If a new profile picture was uploaded, add it to the update data
//         if (req.file) {
//             updateData.profilePic = req.file.path;
//         }

//         const updatedUser = await User.findByIdAndUpdate(
//             req.params.id,
//             { $set: updateData },
//             { new: true } // This option returns the updated document
//         );

//         const { password, ...otherDetails } = updatedUser._doc;
//         res.status(200).json(otherDetails);

//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// module.exports = router;
// const router = require('express').Router();
// const User = require('../models/User');
// const { verifyToken } = require('../verifytoken');
// const { upload } = require('../cloudinary'); // Import upload middleware

// // GET ALL USERS (No change here)
// router.get('/', verifyToken, async (req, res) => {
//     // ... your existing code
// });

// // --- NEW ---: UPDATE USER PROFILE
// router.put('/:id', verifyToken, upload.single('profilePic'), async (req, res) => {
//     // Security check: Make sure the user is updating their own profile
//     if (req.user.id !== req.params.id) {
//         return res.status(403).json("You can only update your own account!");
//     }

//     try {
//         const updateData = {
//             ...req.body,
//         };

//         // If a new profile picture was uploaded, add it to the update data
//         if (req.file) {
//             updateData.profilePic = req.file.path;
//         }

//         const updatedUser = await User.findByIdAndUpdate(
//             req.params.id,
//             { $set: updateData },
//             { new: true } // This option returns the updated document
//         );

//         const { password, ...otherDetails } = updatedUser._doc;
//         res.status(200).json(otherDetails);

//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// module.exports = router;
// const router = require('express').Router();
// const User = require('../models/User');
// const { verifyToken } = require('../verifyToken');

// // GET ALL USERS
// router.get('/', verifyToken, async (req, res) => {
//     try {
//         const users = await User.find();
//         // We don't want to send back passwords
//         const usersWithoutPasswords = users.map(user => {
//             const { password, ...otherDetails } = user._doc;
//             return otherDetails;
//         });
//         res.status(200).json(usersWithoutPasswords);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// module.exports = router;