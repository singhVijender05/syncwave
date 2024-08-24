import passport from 'passport';
import User from '../models/user.model';
import { Router } from 'express';
const router = Router();

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
    
    const accessToken = req.user.generateAccessToken();
    const refreshToken = req.user.generateRefreshToken();
    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.redirect('/'); // Redirect to your frontend after successful login
});

export const googleRoute = router;