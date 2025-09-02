import mongoose from 'mongoose';

interface Submission{
    user: mongoose.Schema.Types.ObjectId;
    submitted: boolean;
    isLate: boolean;
    fileUrl: string;
    submittedAt: Date;
}

export interface PlanDoc extends Document {
    docLink: string;
    submissoins: Submission[];
    month: string;
    createdAt: Date;
    updatedAt: Date;
}

const schema = new mongoose.Schema(
    {
      docLink: {
        type: String,
      },
      month:String,
      submissions: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          submitted: Boolean,
          submittedAt: { type: Date, default: Date.now },
          isLate: Boolean,
          fileUrl: String
        },
      ],
    },
    {
      timestamps: true,
    }
  );


export const MonthlyPlan = mongoose.model<PlanDoc>("monthly-plan", schema);
