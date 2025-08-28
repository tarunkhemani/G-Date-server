// server/routes/confessions.js
const router = require('express').Router();
const Confession = require('../models/Confession');
const { verifyToken } = require('../verifyToken');

// CREATE a new confession
// We use verifyToken to ensure only logged-in users can post, preventing spam.
router.post('/', verifyToken, async (req, res) => {
    try {
        const newConfession = new Confession({
            text: req.body.text,
        });
        const savedConfession = await newConfession.save();
        res.status(201).json(savedConfession);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET all confessions
router.get('/', verifyToken, async (req, res) => {
    try {
        // Find all confessions and sort by the newest first
        const confessions = await Confession.find().sort({ createdAt: -1 });
        res.status(200).json(confessions);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;