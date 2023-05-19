import mongoose from "mongoose";

const Follow = new mongoose.Schema(
  {
    followerId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    followedId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("follow", Follow);