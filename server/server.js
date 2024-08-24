import express from 'express';
import cookieParser from 'cookie-parser';
import {connect} from './database/connect.js';
import passport from './utils/passport.js';
import User from './models/user.models.js';
import cors from 'cors';
import http from 'http';
import {Server} from 'socket.io';
import {router as userRoute} from './routes/user.route.js';
import roomRoute from './routes/room.route.js';
const app = express();


const server = http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:"*"
    },
    pingTimeout:60000
});


app.use(cors(
    {
        origin:"http://localhost:5173",
        credentials:true
    }
))

connect();

//use cookie parser
app.use(cookieParser());
app.use(express.json({limit:"16kb"})) //configure for json
app.use(express.urlencoded({extended:true,limit:"16kb"})) //configure for form data
app.use(passport.initialize());
app.use('/api/user', userRoute);
app.use('/api/room', roomRoute(io));



app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { session: false }), async(req, res) => {
    
    console.log('callback', req);
    const googleUser=await User.findOne({email:req.user.email});
    const accessToken = googleUser.generateAccessToken();
    const refreshToken = googleUser.generateRefreshToken();
    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true })
    res.redirect('http://localhost:5173/oauth/callback?accessToken=' + accessToken + '&refreshToken=' + refreshToken);
});


io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('join-room', (data) => {
        console.log('join-room', data);
        socket.join(data.roomId);
    });
    socket.on('leave-room', (data) => {
        console.log('leave-room', data);
        socket.leave(data.roomId);
    });
    socket.on('create-room', (data) => {
        console.log('create-room', data);
        socket.join(data.roomId);
    });
    //handling time stamps for video
    socket.on('video-timestamp', (data) => {
        console.log('video-timestamp', data);
        //emit to all users in the room
        io.emit('video-timestamp', data);

    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(process.env.PORT || 5000, () => {
    console.log('Server is running on port 5000');
});
