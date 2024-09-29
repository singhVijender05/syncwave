import express from 'express';
import cookieParser from 'cookie-parser';
import { connect } from './database/connect.js';
import passport from './utils/passport.js';
import User from './models/user.models.js';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { router as userRoute } from './routes/user.route.js';
import roomRoute from './routes/room.route.js';
const app = express();


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    },
    pingTimeout: 60000
});


app.use(cors(
    {
        origin: ["http://localhost:5173", "http://192.168.0.105:5173"],
        credentials: true
    }
))

connect();

//use cookie parser
app.use(cookieParser());
app.use(express.json({ limit: "16kb" })) //configure for json
app.use(express.urlencoded({ extended: true, limit: "16kb" })) //configure for form data
app.use(passport.initialize());
app.use('/api/user', userRoute);
app.use('/api/room', roomRoute(io));



app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { session: false }), async (req, res) => {

    console.log('callback', req);
    const googleUser = await User.findOne({ email: req.user.email });
    const accessToken = googleUser.generateAccessToken();
    const refreshToken = googleUser.generateRefreshToken();
    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true })
    res.redirect('http://localhost:5173/oauth/callback?accessToken=' + accessToken + '&refreshToken=' + refreshToken);
});

const rooms = {};
export const connectedUsers = {};

// Function to calculate the correct current timestamp
const getCurrentTimestamp = (roomId) => {
    const room = rooms[roomId];
    if (!room) return 0;

    const { timestamp, playing, lastUpdateTime } = room;
    if (playing) {
        // Calculate the current timestamp based on when the video was last played
        const currentTime = (Date.now() - lastUpdateTime) / 1000; // Convert ms to seconds
        return timestamp + currentTime;
    } else {
        // If the video is paused, return the stored timestamp
        return timestamp;
    }
};

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('join-room', ({ roomId, userId }) => {
        socket.join(roomId);  // Join the room

        // Add user to connected users list for the room
        if (!connectedUsers[roomId]) {
            connectedUsers[roomId] = [];
        }

        // Prevent duplicates
        if (!connectedUsers[roomId].includes(userId)) {
            connectedUsers[roomId].push(userId);
        }

        // Emit the updated list of connected users to everyone in the room
        io.to(roomId).emit('room_members_update', connectedUsers[roomId]);

        // Store the room ID and user ID in the socket object to access on disconnect
        socket.roomId = roomId;
        socket.userId = userId;
    });
    socket.on('request-sync', ({ roomId }) => {
        if (rooms[roomId]) {
            const currentTimestamp = getCurrentTimestamp(roomId);
            const { playing } = rooms[roomId];
            socket.emit('sync-video-state', { timestamp: currentTimestamp, playing });
        } else {
            rooms[roomId] = { playing: false, timestamp: 0, lastUpdateTime: Date.now() };
        }
    });
    socket.on('leave-room', (data) => {
        console.log('leave-room', data);
        socket.leave(data.roomId);
    });
    socket.on('create-room', (data) => {
        console.log('create-room', data);
        socket.join(data.roomId);
    });
    // Listen to video state changes (play/pause)
    socket.on('video-state-change', ({ roomId, playing, timestamp }) => {
        if (!rooms[roomId]) rooms[roomId] = {};

        const room = rooms[roomId];
        room.playing = playing;
        room.timestamp = timestamp;

        // Store the last update time when the video state changes
        room.lastUpdateTime = Date.now();

        // Broadcast the play/pause state change to everyone in the room
        socket.to(roomId).emit('video-state-update', { playing });
        console.log(rooms);
    });

    // Listen to video seek
    socket.on('video-seek', ({ roomId, timestamp }) => {
        if (!rooms[roomId]) rooms[roomId] = {};

        const room = rooms[roomId];
        room.timestamp = timestamp;
        room.lastUpdateTime = Date.now(); // Record the time when seek occurred

        // Broadcast the new timestamp to everyone in the room
        socket.to(roomId).emit('video-state-update', { timestamp });
        console.log(rooms);
    });
    socket.on('disconnect', () => {
        const { roomId, userId } = socket;

        if (roomId && userId) {
            // Remove the user from the connected users list for the room
            connectedUsers[roomId] = connectedUsers[roomId].filter((id) => id !== userId);

            // Emit the updated connected users list to the room
            io.to(roomId).emit('room_members_update', connectedUsers[roomId]);

            console.log(`User ${userId} disconnected from room ${roomId}`);
        }
    });
});

server.listen(process.env.PORT || 5000, '0.0.0.0', () => {
    console.log('Server is running on port 5000');
});
