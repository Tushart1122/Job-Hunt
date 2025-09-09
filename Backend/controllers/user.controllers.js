import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

// ---------------- Register ----------------
export const register = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing", success: false });
    }
    const { fullname, email, phoneNumber, password, role } = req.body;
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({ message: "Please fill all the fields", success: false });
    }
    const file = req.file;
    let profilePhotoUrl;
    if (file) {
      const fileUri = getDataUri(file);
      // Profile photo must be uploaded as IMAGE
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: "image",
        folder: "profile_photos",
      });
      profilePhotoUrl = cloudResponse.secure_url;
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: profilePhotoUrl || undefined,
      },
    });
    return res.status(201).json({ message: "User registered successfully", success: true });
  } catch (error) {
    console.error("Server error:", error.message);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// ---------------- Login ----------------
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Please fill all the fields", success: false });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found", success: false });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials", success: false });
    }
    if (user.role !== role) {
      return res.status(400).json({ message: "Role mismatch", success: false });
    }
    const tokenData = { userId: user._id };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({ message: `Welcome back ${user.fullname}`, success: true, user });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// ---------------- Logout ----------------
export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { maxAge: 0 })
      .json({ message: "Logged out successfully", success: true });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// ---------------- Update Profile ----------------
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;
    let cloudResponse;

    if (file) {
      const fileUri = getDataUri(file);

      // Upload resume with auto detection (PDF, DOCX, etc.)
  cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
    resource_type: "raw",
    folder: "resumes",
    use_filename: true,
    unique_filename: false,
  });
}


    let skillsArray;
    if (skills) {
      try {
        skillsArray = JSON.parse(skills);
      } catch {
        skillsArray = skills.split(",").map(skill => skill.trim()).filter(Boolean);
      }
    }

    const userId = req.id;
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;
    if (cloudResponse) {
      // Store resume URL and original file name
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = file.originalname;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error.message);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};
