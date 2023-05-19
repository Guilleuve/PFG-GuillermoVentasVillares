import mongoose from "mongoose";
import filter from "../util/filter.js";
import PostLike from "./PostLike.js";
import PostJoin from "./PostJoin.js";

const Post = new mongoose.Schema(
  {
    poster: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxLength: [50, "Máximo 50 caracteres"],
    },
    content: {
      type: String,
      required: true,
      maxLength: [5000, "Máximo 5000 caracteres"],
    },
    location: String,
    actividad: String,
    date: Date,
    picturePath: String,
    joinCount: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    edited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

Post.pre("save", function (next) {
  if (this.title.length > 0) {
    this.title = filter.clean(this.title);
  }

  if (this.content.length > 0) {
    this.content = filter.clean(this.content);
  }

  next();
});

Post.pre("remove", async function (next) {
  console.log(this._id);
  await PostLike.deleteMany({ postId: this._id });
  await PostJoin.deleteMany({ postId: this._id });
  next();
});

export default mongoose.model("post", Post);