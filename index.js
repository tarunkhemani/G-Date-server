// server/index.js
// server/index.js
// server/index.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
dotenv.config();


const server = http.createServer(app); 
const allowedOrigins = [
    "http://localhost:3000", // For your local testing
    process.env.FRONTEND_URL  // For your live website
];
// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"]
//     }
// });
const io = new Server(server, {
    cors: {
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        methods: ["GET", "POST"]
    }
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, })
.then(() => console.log("✅ MongoDB connection successful!"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Middleware & Routes
app.use(cors());
app.use(express.json());
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const conversationRoute = require('./routes/conversations'); // <-- ADD THIS
const messageRoute = require('./routes/messages');       // <-- ADD THIS
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/conversations', conversationRoute); // <-- ADD THIS
app.use('/api/messages', messageRoute);           // <-- ADD THIS

// --- UPDATED SOCKET.IO LOGIC WITH DEBUGGING ---
let onlineUsers = [];

const addUser = (userId, socketId) => {
    if (!onlineUsers.some((user) => user.userId === userId)) {
        onlineUsers.push({ userId, socketId });
    }
};

const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return onlineUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
    console.log(`📡 New client connected: ${socket.id}`);

    // Listen for a new user connecting
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        console.log(`📥 User ${userId} added. Online users:`, onlineUsers);
        io.emit("getUsers", onlineUsers);
    });

    // Listen for a new message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        console.log(`📤 Message from ${senderId} to ${receiverId}: "${text}"`);
        const user = getUser(receiverId);
        if (user) {
            console.log(`✅ Found recipient ${receiverId} at socket ${user.socketId}. Sending message...`);
            io.to(user.socketId).emit("getMessage", {
                senderId,
                text,
            });
        } else {
            console.log(`❌ Could not find recipient ${receiverId}. User is offline or not in the list.`);
        }
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
        removeUser(socket.id);
        console.log("🔌 Online users after disconnect:", onlineUsers);
        io.emit("getUsers", onlineUsers);
    });
});
// --- End of Socket.IO logic ---

app.get("/", (req, res) => {
    res.send("Welcome to the GChat API!");
});

app.get("/api/wakeup", (req, res) => {
    res.status(200).json({ message: "Server is awake." });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Backend server is running on port ${PORT}`);
});
// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const cors = require('cors');

// const app = express();
// dotenv.config();

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => console.log("✅ MongoDB connection successful!"))
// .catch((err) => console.error("❌ MongoDB connection error:", err));


// // Middleware
// app.use(cors());
// app.use(express.json());

// // --- FIX IS HERE ---
// // Import Route Files
// const authRoute = require('./routes/auth');
// const userRoute = require('./routes/users'); // <-- MAKE SURE THIS LINE EXISTS

// // Tell the app to use the routes
// app.use('/api/auth', authRoute);
// app.use('/api/users', userRoute); // <-- AND MAKE SURE THIS LINE EXISTS


// app.get("/", (req, res) => {
//     res.send("Welcome to the GChat API!");
// });


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`🚀 Backend server is running on port ${PORT}`);
// });

// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const cors = require('cors');

// const app = express();
// dotenv.config(); // This loads the variables from .env

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => console.log("✅ MongoDB connection successful!"))
// .catch((err) => console.error("❌ MongoDB connection error:", err));


// // Basic server setup
// app.use(cors());
// app.use(express.json());

// // Import and use the auth route
// const authRoute = require('./routes/auth');
// app.use('/api/auth', authRoute); // This means all routes in auth.js will be prefixed with /api/auth


// app.get("/", (req, res) => {
//     res.send("Welcome to the GChat API!");
// });


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`🚀 Backend server is running on port ${PORT}`);
// });