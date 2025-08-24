// server/verifyToken.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1]; // The token is usually sent as "Bearer TOKEN"
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json("Token is not valid!");
            req.user = user;
            next(); // This passes control to the next function (our API route)
        });
    } else {
        return res.status(401).json("You are not authenticated!");
    }
};

module.exports = { verifyToken };