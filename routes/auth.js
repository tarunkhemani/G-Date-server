// // server/routes/auth.js
// const router = require('express').Router();
// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// // REGISTER
// router.post('/register', async (req, res) => {
//     try {
//         // Generate a "salted" and hashed password to securely store it
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(req.body.password, salt);

//         // Create a new user object using our User model
//         const newUser = new User({
//             name: req.body.name,
//             email: req.body.email,
//             password: hashedPassword,
//             course: req.body.course,
//             year: req.body.year,
//             gender: req.body.gender,
//             bio: req.body.bio,
//             profilePic: req.body.profilePic,
//         });

//         // Save the new user to the database
//         const user = await newUser.save();

//         // Send a success response (don't send the password back!)
//         const { password, ...otherDetails } = user._doc;
//         res.status(201).json(otherDetails);

//     } catch (err) {
//         // --- CHANGE ---: Added detailed error logging
//         console.error("❌ REGISTRATION ERROR:", err); // This will show the full error in the server terminal
//         res.status(500).json({ message: "An error occurred during registration.", error: err.message });
//     }
// });
// server/routes/auth.js
// server/routes/auth.js
const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// --- FIX ---: We now import the pre-configured 'upload' middleware
const { upload } = require('../cloudinary'); 

// REGISTER with profile picture upload
// The 'upload.single('profilePic')' part is the middleware that handles the file
router.post('/register', upload.single('profilePic'), async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            course: req.body.course,
            year: req.body.year,
            gender: req.body.gender,
            bio: req.body.bio,
            profilePic: req.file ? req.file.path : '',
        });

        const user = await newUser.save();
        const { password, ...otherDetails } = user._doc;
        res.status(201).json(otherDetails);

    } catch (err) {
        console.error("❌ REGISTRATION ERROR:", err);
        res.status(500).json({ message: "An error occurred during registration.", error: err.message });
    }
});

// LOGIN (No changes here)
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json("Wrong credentials!");
        }

        const validated = await bcrypt.compare(req.body.password, user.password);
        if (!validated) {
            return res.status(401).json("Wrong credentials!");
        }

        const accessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '3d' }
        );

        const { password, ...otherDetails } = user._doc;
        res.status(200).json({ ...otherDetails, accessToken });

    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
// const router = require('express').Router();
// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const multer = require('multer');
// const { upload } = require('../cloudinary'); // Change this line
// // const { storage } = require('../cloudinary'); // Import storage config
// const upload = multer({ storage }); // Initialize multer

// // REGISTER with profile picture upload
// router.post('/register', upload.single('profilePic'), async (req, res) => {
//     try {
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(req.body.password, salt);

//         const newUser = new User({
//             name: req.body.name,
//             email: req.body.email,
//             password: hashedPassword,
//             course: req.body.course,
//             year: req.body.year,
//             gender: req.body.gender,
//             bio: req.body.bio,
//             // If a file was uploaded, req.file will exist. Use its path.
//             profilePic: req.file ? req.file.path : '',
//         });

//         const user = await newUser.save();
//         const { password, ...otherDetails } = user._doc;
//         res.status(201).json(otherDetails);

//     } catch (err) {
//         console.error("❌ REGISTRATION ERROR:", err);
//         res.status(500).json({ message: "An error occurred during registration.", error: err.message });
//     }
// });

// // LOGIN
// router.post('/login', async (req, res) => {
//     try {
//         // Find user by email
//         const user = await User.findOne({ email: req.body.email });
//         if (!user) {
//             return res.status(401).json("Wrong credentials!");
//         }

//         // Compare submitted password with the one in the database
//         const validated = await bcrypt.compare(req.body.password, user.password);
//         if (!validated) {
//             return res.status(401).json("Wrong credentials!");
//         }

//         // Create and assign a JWT
//         const accessToken = jwt.sign(
//             { id: user._id },
//             process.env.JWT_SECRET,
//             { expiresIn: '3d' }
//         );

//         // Send user details and token back (but not the password!)
//         const { password, ...otherDetails } = user._doc;
//         res.status(200).json({ ...otherDetails, accessToken });

//     } catch (err) {
//         // --- CHANGE ---: Added detailed error logging
//         console.error("❌ LOGIN ERROR:", err); // This will show the full error in the server terminal
//         res.status(500).json({ message: "An error occurred during login.", error: err.message });
//     }
// });

// module.exports = router;

// // server/routes/auth.js
// const router = require('express').Router();
// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken'); 

// // REGISTER
// router.post('/register', async (req, res) => {
//     try {
//         // 1. Generate a "salted" and hashed password to securely store it
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(req.body.password, salt);

//         // 2. Create a new user object using our User model
//         const newUser = new User({
//             name: req.body.name,
//             email: req.body.email,
//             password: hashedPassword,
//             course: req.body.course,
//             year: req.body.year,
//             gender: req.body.gender,
//             bio: req.body.bio,
//             profilePic: req.body.profilePic,
//         });

//         // 3. Save the new user to the database
//         const user = await newUser.save();

//         // 4. Send a success response (don't send the password back!)
//         const { password, ...otherDetails } = user._doc;
//         res.status(201).json(otherDetails);

//     } catch (err) {
//         // If anything goes wrong, send an error response
//         res.status(500).json(err);
//     }
// });
// // LOGIN  -- ADD THIS ENTIRE BLOCK
// router.post('/login', async (req, res) => {
//     try {
//         // 1. Find user by email
//         const user = await User.findOne({ email: req.body.email });
//         if (!user) {
//             return res.status(401).json("Wrong credentials!");
//         }

//         // 2. Compare submitted password with the one in the database
//         const validated = await bcrypt.compare(req.body.password, user.password);
//         if (!validated) {
//             return res.status(401).json("Wrong credentials!");
//         }

//         // 3. Create and assign a JWT
//         const accessToken = jwt.sign(
//             { id: user._id }, // Payload: contains user's unique ID
//             process.env.JWT_SECRET, // Secret key from .env file
//             { expiresIn: '3d' } // Token expires in 3 days
//         );

//         // 4. Send user details and token back (but not the password!)
//         const { password, ...otherDetails } = user._doc;
//         res.status(200).json({ ...otherDetails, accessToken });

//     } catch (err) {
//         res.status(500).json(err);
//     }
// });


// module.exports = router;