// server/routes/subscriptions.js
const router = require('express').Router();
const User = require('../models/User');

router.post('/', async (req, res) => {
    const { subscription, userId } = req.body;
    try {
        await User.findByIdAndUpdate(userId, {
            $set: { pushSubscription: subscription }
        });
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;