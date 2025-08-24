// server/cloudinary.js
// server/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer'); // --- ADD THIS

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'GChat-Profiles',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

// --- ADD THIS ---
const upload = multer({ storage });

module.exports = {
    cloudinary,
    storage,
    upload // --- AND THIS ---
};
// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

// const storage = new CloudinaryStorage({
//     cloudinary,
//     params: {
//         folder: 'GChat-Profiles',
//         allowedFormats: ['jpeg', 'png', 'jpg']
//     }
// });

// module.exports = {
//     cloudinary,
//     storage
// };