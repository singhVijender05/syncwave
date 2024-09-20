import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
        },
        profilePicture: {
            type: String, // URL to the avatar image
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        googleId: {
            type: String,
        },
        uuid: { // UUID field with default value
            type: String,
            default: uuidv4, // Automatically generates UUID on document creation
            unique: true,
        },
        rooms: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Room',
            }
        ]
    },
    {
        timestamps: true,
    });


userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

// Method to compare input password with hashed password
userSchema.methods.comparePassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
    console.log(
        process.env.ACCESS_TOKEN_SECRET,
        process.env.ACCESS_TOKEN_EXPIRY
    );
    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: (process.env.ACCESS_TOKEN_EXPIRY).toString() }
    );
};
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: (process.env.REFRESH_TOKEN_EXPIRY).toString() }
    );
};
const User = mongoose.model('User', userSchema);
export default User;
