import { Router } from "express";
import User  from "../models/user.models.js";
import { verifyToken } from "../middlewares/verify.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
const router = Router();

router.post('/signup', async (req, res) => {
    console.log(req.body);
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const user = new User({ name, email, password});
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
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await user.comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        res.cookie('accessToken', accessToken, { httpOnly: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true });
        res.json({ message: 'Login successful' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//logout
router.get('/logout',verifyToken, (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ message: 'Logout successful' });
});

//update name of user
router.put('/update',verifyToken, async (req, res) => {
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
router.delete('/delete',verifyToken, async (req, res) => {
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
router.put('/update/profilePicture',verifyToken, async (req, res) => {
    const { profilePicture } = req.body;
    //upload on cloudinary
    try {
        const url=await uploadOnCloudinary(profilePicture);
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        user.profilePicture = url;
        await user.save();
        res.json({ message: 'Profile picture updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});




    
export {router};