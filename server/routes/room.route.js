import { Router } from "express";
import Room from "../models/room.models.js";
import User from "../models/user.models.js";
import Message from "../models/message.models.js";
import { verifyToken } from "../middlewares/verify.js";

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
            if (room.members.includes(req.user._id)) { // Check user ID in members
                return res.status(200).json({ message: 'You are already a member of this room' });
            }
            room.members.push(req.user._id);
            await room.save();
            //save room id in user
            const user = await User.findById(req.user._id);
            user.rooms.push(room._id);
            await user.save();
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
            const rooms = await Room.find({ members: req.user._id }); // Filter by user ID
            res.status(200).json({ rooms });
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
            const newmessage = await Message.create({ content: message, sender: req.user._id });
            await newmessage.save();
            room.messages.push(newmessage); // Use user ID for sender
            await room.save();
            io.to(id).emit('message', { message, sender: req.user.name }); // Emit message to room
            res.status(200).json({ message: 'Message sent successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    // Get messages of a room
    router.get('/getmessages/:id', verifyToken, async (req, res) => {
        const { id } = req.params;
        try {
            const room = await Room.findById(id)
                .populate({
                    path: 'messages',
                    populate: {
                        path: 'sender',
                        select: 'name uuid' // Select only the username and uuid fields
                    }
                });// Populate sender username
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }
            if (!room.members.includes(req.user._id)) { // Check user ID in members
                return res.status(400).json({ error: 'You are not a member of this room' });
            }

            res.status(200).json({ messages: room.messages });
        } catch (error) {
            res.status(400).json({ error: error.message });
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
            if (room.creator.toString() !== req.user._id.toString()) { // Check user ID for authorization
                return res.status(403).json({ error: 'You are not authorized to set video URL' });
            }
            room.videoUrl = videoUrl;
            room.videoHistory.push({ videoUrl, watchedAt: Date.now() });
            await room.save();
            io.to(id).emit('video-url', { videoUrl }); // Emit video URL to room
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

    return router;
}
