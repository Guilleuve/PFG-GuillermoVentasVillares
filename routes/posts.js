import express from "express";
import { Router } from "express";
import { verifyToken, optionallyVerifyToken } from "../middleware/auth.js";
import {getPosts, createPost, getPost, updatePost, deletePost, joinPost, unjoinPost, likePost, unlikePost, getUserLikedPosts, getUsersJoinedPost, informPost} from "../controllers/postControllers.js";

const router = express.Router();

router.get("/", optionallyVerifyToken, getPosts);
router.post("/", verifyToken, createPost);

router.get("/:id", optionallyVerifyToken, getPost);
router.patch("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);

router.post("/inform", informPost);

router.post("/join/:id", verifyToken, joinPost);
router.delete("/join/:id", verifyToken, unjoinPost);
router.get(
  "/joined/:id",
  optionallyVerifyToken,
  getUsersJoinedPost
);

router.post("/like/:id", verifyToken, likePost);
router.delete("/like/:id", verifyToken, unlikePost);
router.get(
  "/liked/:id",
  optionallyVerifyToken,
  getUserLikedPosts
);

export default router;