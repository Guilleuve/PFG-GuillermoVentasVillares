import mongoose from "mongoose";

const PostInform = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Types.ObjectId,
      ref: "post",
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    motivo: {
      type: String,
      required: true,
    },
    comentario: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("postInform", PostInform);