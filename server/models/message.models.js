import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Message', messageSchema);
