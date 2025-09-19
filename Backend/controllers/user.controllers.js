import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { getGridFsBucket } from "../utils/girdfsStorage.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    if (!fullname || !email || !phoneNumber || !password || !role)
      return res.status(400).json({ message: "All fields are required", success: false });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists with this email", success: false });

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {},
    };

    // File upload handling
    if (req.file && req.file.id) {
      const fileId = req.file.id.toString();
      const isImage = req.file.mimetype && req.file.mimetype.startsWith("image/");
      
      if (isImage) {
        userData.profile.profilePhotoId = fileId;
        userData.profile.profilePhotoFilename = req.file.filename;
      } else {
        userData.profile.resumeId = fileId;
        userData.profile.resumeFilename = req.file.filename;
        userData.profile.resumeOriginalName = req.file.originalname;
      }
    }

    const createdUser = await User.create(userData);

    // Remove password from response
    const userResponse = createdUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: "Account created successfully.",
      success: true,
      user: userResponse,
    });
  } catch (err) {
    console.error("register error:", err);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role)
      return res.status(400).json({ message: "All fields are required", success: false });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Incorrect email or password", success: false });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) return res.status(401).json({ message: "Incorrect email or password", success: false });

    if (role !== user.role)
      return res.status(400).json({ message: "Account doesn't exist with current role", success: false });

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

    // Remove password from response
    const userData = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict" })
      .json({ message: `Welcome back ${user.fullname}`, user: userData, success: true });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (err) {
    console.error("logout error:", err);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// VIEW FILE
export const viewFile = async (req, res) => {
  try {
    const bucket = getGridFsBucket();
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: "File id required" });
    }

    let fileId;
    try {
      fileId = new mongoose.Types.ObjectId(id);
    } catch (error) {
      return res.status(400).json({ message: "Invalid file ID format" });
    }

    // Find the file in GridFS
    const files = await bucket.find({ _id: fileId }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    const file = files[0];
    
    // Set appropriate headers
    res.set("Content-Type", file.contentType || "application/octet-stream");
    res.set("Content-Length", file.length);

    // Set Content-Disposition to inline for viewing in browser
    const filename = file.metadata?.originalName || file.filename || "download";
    
    if (file.contentType && file.contentType === "application/pdf") {
      // For PDFs, set inline to open in browser
      res.set("Content-Disposition", `inline; filename="${filename}"`);
    } else if (file.contentType && file.contentType.startsWith("image/")) {
      // For images, set inline
      res.set("Content-Disposition", `inline; filename="${filename}"`);
    } else {
      // For other file types, you can choose inline or attachment
      // Use 'inline' to view in browser, 'attachment' to force download
      res.set("Content-Disposition", `inline; filename="${filename}"`);
    }

    // Create download stream
    const downloadStream = bucket.openDownloadStream(fileId);
    
    downloadStream.on("error", (err) => {
      console.error("downloadStream error:", err);
      if (!res.headersSent) {
        res.status(500).json({ message: "Error streaming file" });
      }
    });

    downloadStream.pipe(res);
  } catch (err) {
    console.error("viewFile error:", err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Server error" });
    }
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const userId = req.id || req.userId || (req.user && req.user.id);
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Initialize profile object if it doesn't exist
    if (!user.profile) {
      user.profile = {};
    }

    // Handle uploaded file
    if (req.file && req.file.id) {
      console.log("File uploaded:", req.file);
      const fileId = req.file.id.toString();
      const isImage = req.file.mimetype && req.file.mimetype.startsWith("image/");
      
      if (isImage) {
        // Delete old profile photo if exists
        if (user.profile.profilePhotoId) {
          try {
            const bucket = getGridFsBucket();
            await bucket.delete(new mongoose.Types.ObjectId(user.profile.profilePhotoId));
          } catch (deleteError) {
            console.log("Error deleting old profile photo:", deleteError.message);
          }
        }
        
        user.profile.profilePhotoId = fileId;
        user.profile.profilePhotoFilename = req.file.filename;
      } else {
        // Delete old resume if exists
        if (user.profile.resumeId) {
          try {
            const bucket = getGridFsBucket();
            await bucket.delete(new mongoose.Types.ObjectId(user.profile.resumeId));
          } catch (deleteError) {
            console.log("Error deleting old resume:", deleteError.message);
          }
        }
        
        user.profile.resumeId = fileId;
        user.profile.resumeFilename = req.file.filename;
        user.profile.resumeOriginalName = req.file.originalname;
      }
    }

    // Update other fields
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    
    if (fullname && fullname.trim()) user.fullname = fullname.trim();
    
    if (email && email.trim()) {
      // Check if email already exists with another user
      const existingUser = await User.findOne({ 
        email: email.trim(), 
        _id: { $ne: userId } 
      });
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: "Email already exists with another account" 
        });
      }
      user.email = email.trim();
    }
    
    if (phoneNumber && phoneNumber.trim()) user.phoneNumber = phoneNumber.trim();
    if (bio !== undefined) user.profile.bio = bio.trim();
    
    if (skills !== undefined) {
      if (Array.isArray(skills)) {
        user.profile.skills = skills.filter(skill => skill && skill.trim()).map(skill => skill.trim());
      } else if (typeof skills === 'string') {
        user.profile.skills = skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    // Save the user
    await user.save();

    console.log("User saved successfully:", {
      resumeId: user.profile.resumeId,
      resumeOriginalName: user.profile.resumeOriginalName,
      profilePhotoId: user.profile.profilePhotoId
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({ 
      success: true, 
      message: "Profile updated successfully", 
      user: userResponse 
    });
  } catch (err) {
    console.error("updateProfile error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error occurred while updating profile" 
    });
  }
};