import passport from 'passport';
import User from '../models/user.model';
import { Router } from 'express';
const router = Router();

router.get('/auth/google', (req, res, next) => {
    const redirectUrl = req.query.redirect || '/dashboard';
    const state = Buffer.from(JSON.stringify({ redirectUrl })).toString('base64');
    const authenticator = passport.authenticate('google', { scope: ['profile', 'email'], state })
    authenticator(req, res, next);
});

router.get('/auth/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/sign-in' }), (req, res) => {

    // Generate tokens
    const accessToken = req.user.generateAccessToken();
    const refreshToken = req.user.generateRefreshToken();

    // Store tokens in HTTP-only cookies to prevent exposure in JavaScript or URLs
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'Lax' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Lax' });

    const { state } = req.query;
    const { redirectUrl } = JSON.parse(Buffer.from(state, 'base64').toString());
    if (typeof redirectUrl === 'string' && redirectUrl.startsWith('/')) {
        return res.redirect(redirectUrl);
    }
    res.redirect('/dashboard');
});

export const googleRoute = router;
