import mongoose from "mongoose";

interface Submission {
  user: mongoose.Schema.Types.ObjectId;
  submitted: boolean;
  submittedAt: Date;
  isLate: boolean;
}

interface FormDocument extends Document {
  formLink: string;
  submissions: Submission[];
  month:string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new mongoose.Schema(
  {
    formLink: {
      type: String,
    },
    month: String,
    submissions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        submitted: Boolean,
        submittedAt: { type: Date, default: Date.now },
        isLate: Boolean,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Wellness = mongoose.model<FormDocument>("Wellness", schema);
