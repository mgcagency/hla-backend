import mongoose, { Schema } from 'mongoose';
import validator from "validator"

export interface IUser extends Document {
    name: string;
    email: string;
    photo: string;
    role: "student" | "teacher" | "parent" | "admin" ;
    phoneNo: string;
    password: string;
    registeredChildren?: string[];
    isOnline: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Name"]
    },
    email: {
        type: String,
        unique: [true, "Email already exists"],
        required: [true, "Please Enter Email"],
        validate: validator.default.isEmail
    },
    photo: {
        type: String,
        required: [true, "Please Add Photo"]
    },
    role:{
        type: String, 
        enum: ["admin","student", "teacher", "parent"],
        default: "student",
    },
    phoneNo: {
        type: String,
        // required: [true,"Please Enter Phone No"]
    },
    isOnline:{
        type: Boolean,
        default: false,
    },
    password: {
        type:String,
        required:[true, "Please enter Password"],
    },
    teacher:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    registeredChildren: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: function(this: any) { return this.role === 'parent'; }
    }]

},
{
    timestamps: true,
}
);


export const User = mongoose.model<IUser>("User", UserSchema)