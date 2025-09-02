import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
    // teacher_id: mongoose.Schema.Types.ObjectId;
    class_id: mongoose.Schema.Types.ObjectId;
    question: {
        q: string;
        a: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const reviewSchema = new mongoose.Schema({
    question: [{
        q: {
            type: String,
            required: true
        },
        a: {
            type: String,
            required: true
        }
    }],
    // teacher_id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    class_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
},{
    timestamps: true,
})

export const Review = mongoose.model<IReview>("Review", reviewSchema)
