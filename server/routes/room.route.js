import { Router } from "express";
import Room from "../models/room.models.js";
import User from "../models/user.models.js";
import Message from "../models/message.models.js";
import { verifyToken } from "../middlewares/verify.js";
import { activeRooms, connectedUsers } from "../server.js";

const router = Router();

export default function roomRoute(io) {
    // Create a new room
    router.post('/create', verifyToken, async (req, res) => {
        const { name } = req.body;
        try {
            const room = new Room({ name, creator: req.user._id, admins: req.user._id, members: req.user._id }); // Use user ID, not user object
            //save room id in user
            const user = await User.findById(req.user._id);
            user.rooms.push(room._id);
            await user.save();
            await room.save();
            res.status(201).json({ message: 'Room created successfully', room });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    //update room name
    router.post('/update/:id', verifyToken, async (req, res) => {
        const { id } = req.params;
        const { newname } = req.body;
        try {
            const room = await Room.findById(id);
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }
            if (room.creator.toString() !== req.user._id.toString()) { // Check user ID for authorization
                return res.status(403).json({ error: 'You are not authorized to update this room' });
            }
            room.name = newname;
            await room.save();
            io.to(id).emit('room-name-changed', { room }); // Emit new room
            res.status(200).json({ message: 'Room name updated successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });


    // Join a room
    router.post('/join/:id', verifyToken, async (req, res) => {
        const { id } = req.params;
        try {
            const room = await Room.findById(id);
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }
            // Initialize room's connected users list if not exists
            if (!connectedUsers[id]) {
                connectedUsers[id] = [];
            }

            // Add the user to the connected users list if not already present
            if (!connectedUsers[id].includes(req.user._id)) {
                connectedUsers[id].push(req.user._id);
            }
            if (room.members.includes(req.user._id)) { // Check user ID in members
                io.to(id).emit('new-member', { memberName: req.user.name, connectedUsers: connectedUsers[id] });
                return res.status(200).json({ message: 'You are already a member of this room' });
            }
            room.members.push(req.user._id);
            await room.save();
            //save room id in user
            const user = await User.findById(req.user._id);
            user.rooms.push(room._id);
            await user.save();
            io.to(id).emit('new-member', { memberName: req.user.name, connectedUsers: connectedUsers[id] });
            res.status(200).json({ message: 'You have joined the room' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    // Leave a room
    router.post('/leave/:id', verifyToken, async (req, res) => {
        const { id } = req.params;
        try {
            const room = await Room.findById(id);
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }
            if (!room.members.includes(req.user._id)) { // Check user ID in members
                return res.status(400).json({ error: 'You are not a member of this room' });
            }
            room.members = room.members.filter(member => member.toString() !== req.user._id.toString());
            await room.save();
            //remove room id from user
            const user = await User.findById(req.user._id);
            user.rooms = user.rooms.filter(roomid => roomid.toString() !== id.toString());
            await user.save();
            res.status(200).json({ message: 'You have left the room' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    // Close a room
    router.post('/close/:id', verifyToken, async (req, res) => {
        const { id } = req.params;
        try {
            const room = await Room.findById(id);
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }
            if (room.creator.toString() !== req.user._id.toString()) { // Check user ID for authorization
                return res.status(403).json({ error: 'You are not authorized to close this room' });
            }
            room.isActive = false;
            await room.save();
            res.status(200).json({ message: 'Room closed successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    // Get rooms of a user
    router.get('/getRooms', verifyToken, async (req, res) => {
        try {
            // Created rooms where the user is the creator and also populate members and admin
            const createdRooms = await Room.find({ creator: req.user._id }).populate('members', 'name _id profilePicture').populate('admins', 'name _id profilePicture');

            // Joined rooms, excluding rooms where the user is the creator
            const joinedRooms = await Room.find({ members: req.user._id, creator: { $ne: req.user._id } }).populate('members', 'name _id profilePicture').populate('admins', 'name _id profilePicture');

            res.status(200).json({ createdRooms, joinedRooms });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    // Delete a room
    router.post('/delete/:id', verifyToken, async (req, res) => {
        const { id } = req.params;
        try {
            const room = await Room.findById(id);
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }
            if (room.creator.toString() !== req.user._id.toString()) { // Check user ID for authorization
                return res.status(403).json({ error: 'You are not authorized to delete this room' });
            }
            await Message.deleteMany({ roomId: id }); // Delete all messages in the room
            await Room.findByIdAndDelete(id); // Use findByIdAndDelete to delete the room
            //remove room id from user
            const user = await User.findById(req.user._id);
            user.rooms = user.rooms.filter(roomid => roomid.toString() !== id.toString());
            await user.save();
            res.status(200).json({ message: 'Room deleted successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });


    // Send a message to a room
    router.post('/sendmessage/:id', verifyToken, async (req, res) => {
        const { id } = req.params;
        const { message } = req.body;
        try {
            const room = await Room.findById(id);
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }
            if (!room.members.includes(req.user._id)) { // Check user ID in members
                return res.status(400).json({ error: 'You are not a member of this room' });
            }
            //create new message
            const newmessage = await Message.create({ roomId: id, content: message, sender: req.user._id });
            await newmessage.save();
            room.messages.push(newmessage); // Use user ID for sender
            await room.save();
            const user = await User.findById(req.user._id);
            io.to(id).emit('message', {
                content: message,
                sender: req.user.name,
                profilePicture: user.profilePicture,
                userId: req.user._id,
                time: new Date().toLocaleTimeString()
            }); // Emit message to room
            res.status(200).json({ message: 'Message sent successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    // Get messages of a room
    router.get('/getmessages/:id', verifyToken, async (req, res) => {
        const { id } = req.params;
        try {
            // Find the room by ID and populate messages (and also populate sender details in each message)
            const room = await Room.findById(id).populate({
                path: 'messages',  // Populate the messages array
                populate: {
                    path: 'sender',  // Populate the sender field inside each message
                    select: 'name profilePicture _id',  // Only select the name field from the User model
                },
            });

            // Check if room exists
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }

            // Ensure the user is a member of the room
            if (!room.members.includes(req.user._id)) {
                return res.status(400).json({ error: 'You are not a member of this room' });
            }

            // Map over the messages to format the response
            const messages = room.messages.map(message => ({
                content: message.content,
                sender: message.sender.name,  // Access sender's name
                profilePicture: message.sender.profilePicture,  // Access sender's profile picture
                userId: message.sender._id,  // Access sender's ID
                time: message.createdAt.toLocaleTimeString(),
            }));

            // Send the messages as a response
            res.status(200).json({ messages });
        } catch (error) {
            console.error('Error fetching messages:', error);
            res.status(500).json({ error: error.message });
        }
    });


    // Set video URL for a room
    router.post('/video/:id', verifyToken, async (req, res) => {
        const { id } = req.params;
        const { videoUrl } = req.body;

        try {
            const room = await Room.findById(id);
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }

            // Check user ID for authorization
            if (room.creator.toString() !== req.user._id.toString()) {
                return res.status(403).json({ error: 'You are not authorized to set video URL' });
            }

            activeRooms[id] = { playing: false, timestamp: 0, lastUpdateTime: Date.now() }; // Initialize the room in ActiveRooms

            // Remove any previous occurrence of the same videoUrl in videoHistory
            room.videoHistory = room.videoHistory.filter(video => video.videoUrl !== videoUrl);

            // Add new video URL to the history
            room.videoUrl = videoUrl;
            room.videoHistory.push({ videoUrl, watchedAt: Date.now() });

            await room.save();

            // Emit the new video URL to all room members
            io.to(id).emit('video-url', { videoUrl, room });

            res.status(200).json({ message: 'Video URL set successfully' });

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });


    // get room details
    router.get('/:id', verifyToken, async (req, res) => {
        const { id } = req.params;
        try {
            const room = await Room.findById(id);
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }
            if (!room.members.includes(req.user._id)) { // Check user ID in members
                return res.status(400).json({ error: 'You are not a member of this room' });
            }
            res.status(200).json({ room });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    // Get room members' name, _id, profilePicture by room id
    router.get('/members/:id', verifyToken, async (req, res) => {
        const { id } = req.params;

        try {
            // Find the room by its ID
            const room = await Room.findById(id).populate('members', 'name _id profilePicture'); // Assuming 'members' is an array of user IDs

            // If the room is not found
            if (!room) {
                return res.status(404).json({ message: 'Room not found' });
            }

            // Get the members' details
            const members = room.members.map(member => ({
                _id: member._id,
                name: member.name,
                profilePicture: member.profilePicture
            }));

            // Return the members' details
            res.status(200).json({ members });
        } catch (error) {
            console.error('Error fetching room members:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    return router;
}
