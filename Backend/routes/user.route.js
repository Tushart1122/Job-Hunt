import express from "express";
import { login, register, updateProfile, logout, viewFile } from "../controllers/user.controllers.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { upload } from "../utils/girdfsStorage.js";

const router = express.Router();

// Register with optional file upload
router.post("/register", upload.single('file'), register);

// Login
router.post("/login", login);

// Logout
router.get("/logout", logout);

// View file - using :id to match controller expectation
router.get("/files/:id", viewFile);

// Profile update with file upload
router.post("/profile/update", isAuthenticated, upload.single('file'), updateProfile);

export default router;