import { Router } from "express";
import multer from 'multer';
import User from "../models/user.models.js";
import { verifyToken } from "../middlewares/verify.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
const router = Router();

// Configure multer for file upload handling
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

router.post('/signup', async (req, res) => {
    console.log(req.body);
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Account not found, Please create one' });
        }
        const isPasswordValid = await user.comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Set cookies with SameSite=None and Secure for cross-origin
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: 'None', // Allow cross-origin
            secure: true,     // Required for SameSite=None on HTTPS
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'None', // Allow cross-origin
            secure: true,     // Required for SameSite=None on HTTPS
        });

        res.json({
            message: 'Login successful',
            user: {
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
                _id: user._id,
            },
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/logout', verifyToken, (req, res) => {
    // Clear the cookies with the same attributes used while setting them
    res.clearCookie('accessToken', {
        httpOnly: true,
        sameSite: 'None', // Same as when you set the cookie
        secure: true,     // Same as when you set the cookie
    });

    res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'None', // Same as when you set the cookie
        secure: true,     // Same as when you set the cookie
    });

    res.json({ message: 'Logout successful' });
});


//update name of user
router.put('/update', verifyToken, async (req, res) => {
    const { name } = req.body;
    try {
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        user.name = name;
        await user.save();
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//delete account
router.delete('/delete', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        await user.remove();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//change profile picture
router.put('/update/profilePicture', verifyToken, upload.single('profilePicture'), async (req, res) => {
    const file = req.file; // Multer processes the file
    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    try {
        const url = await uploadOnCloudinary(file);
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        user.profilePicture = url;
        await user.save();
        res.json({ message: 'Profile picture updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});

//verify token and return user
router.get('/user-details', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.json({
            user: {
                name: user.name, email: user.email, profilePicture: user.profilePicture, createdAt: user.createdAt, rooms: user.rooms.length, _id: user._id
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})


export { router };