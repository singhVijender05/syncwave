import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

//verify token
dotenv.config();
const verifyToken = (req, res, next) => {
    const token = req.header('auth-token') || req.cookies.accessToken;
    if (!token) return res.status(401).send('Access Denied');
    try {
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
}
export { verifyToken };