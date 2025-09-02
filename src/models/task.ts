import mongoose from 'mongoose';

export interface ITask extends Document {
    title: string;
    content: string;
    teacher: mongoose.Schema.Types.ObjectId;
    assignedBy: mongoose.Schema.Types.ObjectId;
    status: "completed" | "pending";
    deadline: Date;
    updatedAt: Date;
    createdAt: Date;
}

const schema = new mongoose.Schema({
    title: {
        type: String,
    },
    content: {
        type: String,
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    teacher:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    deadline: {
        type:Date
    },
    status: {
        type: String,
        enum: ["completed", "pending"],
        default:"pending"
    }
},
{
    timestamps: true,
}
);


export const Task = mongoose.model<ITask>("Task", schema);
