import mongoose from "mongoose";

const ResetingPassword = new mongoose.Schema(
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
  
    export default mongoose.model("resetingPassword", ResetingPassword);