import mongoose from "mongoose";

const EmailVerification = new mongoose.Schema(
    {
      userId: {
        type: String,
        required: true,
      },
      token: {
        type: String,
        required: true,
      },
      expiresAt: {
        type: Date,
        required: true,
      },
    });
  
    export default mongoose.model("emailVerification", EmailVerification);