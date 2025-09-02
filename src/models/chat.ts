import { timeStamp } from 'console';
import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document{
    members: mongoose.Schema.Types.ObjectId[];
    messages: {
        sender: mongoose.Schema.Types.ObjectId;
        content: string;
        mediaType: "file" | "image" | "video" | "audio" | "text"; 
        timestamp: any;
    }[];
}

const chatSchema = new mongoose.Schema({
    members : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    }],
    messages: [{
        sender: mongoose.Schema.Types.ObjectId,
        content: String,
        mediaType: {
            type: String,
            enum: ["file", "image", "video", "audio", "text"],
            default: "text"
        },
        timestamp: {type: Date, default: Date.now}
    }]
},
{
    timestamps: true,
}
)

export const Chats = mongoose.model<IChat>("Chats", chatSchema)
