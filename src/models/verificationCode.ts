import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        code: String,
        email: String,
    },
    {
        timestamps: true
    }
);

const VerficationCode = mongoose.model("VerificationCode", schema);

export default VerficationCode;
