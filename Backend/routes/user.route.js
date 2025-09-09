import express from "express";
import { login, register, updateProfile, logout } from "../controllers/user.controllers.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

// Register with file upload middleware
router.route("/register").post(singleUpload, register);

// Login route
router.route("/login").post(login);

// Logout route
router.route("/logout").get(logout);

// Profile update route with auth and file upload middlewares
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);

export default router;
