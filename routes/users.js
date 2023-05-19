import express from "express";
import { Router } from "express";
import {register, login, getRandomUsers, getUser, updateUser, follow, unfollow, getFollowers, getFollowing, isFollowing} from "../controllers/userControllers.js";
import { check } from "express-validator";
import { verifyToken } from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/random", getRandomUsers);

router.get("/:username", getUser);
router.patch("/:id", verifyToken, updateUser);

router.post("/follow/:id", follow);
router.delete("/unfollow/:id", unfollow);

router.get("/followers/:id", getFollowers);
router.get("/following/:id", getFollowing);
router.get("/isfollowing", isFollowing);

export default router;