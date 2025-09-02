import mongoose, { Document, Schema } from 'mongoose';

export interface IWellbeing extends Document {
    link:string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

const WellbeingSchema = new mongoose.Schema({
    title:{
        type:String,
        required: [true, "Please enter the title"]
    },
    link: {
        type: String
    },
    content:{
        type:String,
        required: [true, "Please enter some content"]
    },
},
{
    timestamps: true,
}
)

export const Wellbeing = mongoose.model<IWellbeing>("Wellbeing", WellbeingSchema)