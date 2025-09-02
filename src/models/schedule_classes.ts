import mongoose, { Schema, Document } from 'mongoose';

export interface IScheduleClass extends Document {
    teacher_id: mongoose.Schema.Types.ObjectId;
    student_id: mongoose.Schema.Types.ObjectId;
    review_id?: mongoose.Schema.Types.ObjectId;
    title: string;
    startTime: string;
    endTime: string;
    status: "Completed" | "Upcoming" | "On Going";
    repeat: boolean;
    weekDays: ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday")[];
    location: {
        name: string;
        offsiteAddress: string;
        url?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const classSchema = new mongoose.Schema({
    teacher_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    review_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    },
    title: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Completed", "Upcoming", "On Going"]
    },
    repeat: {
        type: Boolean,
        required: true
    },
    weekDays: {
        type: [String],
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        required: true
    },
    location: {
        name: {
            type: String,
            enum: ["Student's Home", "Face to Face", "Off-site", "Virtual", "Learning Pack", "Online Course"],
            required: true
        },
        // coordinates: {
        //     longitude: {
        //         type: Number,
        //         required: function(this: any) {
        //             return this.location.name === 'Off-site';
        //         }
        //     },
        //     latitude: {
        //         type: Number,
        //         required: function(this: any) {
        //             return this.location.name === 'Off-site';
        //         }
        //     }
        // },
        offsiteAddress: {
            type: String,
            required: [true, "Address for offsite location is required"]
        },
        url: {
            type: String,
            required: function(this: any) {
                return ['Virtual', 'Learning Pack', 'Online Course'].includes(this.location.name);
            }
        }
    }
}, {
    timestamps: true,
});

export const ScheduleClass = mongoose.model<IScheduleClass>("ScheduleClass", classSchema);
