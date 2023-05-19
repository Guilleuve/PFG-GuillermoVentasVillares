import express from "express";
import { Router } from "express";
import {updateComment, createComment, deleteComment, getPostComments, getUserComments} from "../controllers/commentControllers.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.patch("/:id", verifyToken, updateComment);
router.post("/:id", verifyToken, createComment);
router.delete("/:id", verifyToken, deleteComment);
router.get("/post/:id", getPostComments);
router.get("/user/:id", getUserComments);

export default router;