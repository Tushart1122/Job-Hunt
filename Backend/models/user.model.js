import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "recruiter"],
      required: true,
    },
    profile: {
      bio: { type: String },
      skills: [{ type: String }],
      // Resume fields for GridFS
      resumeId: { type: String }, // GridFS file ID
      resumeFilename: { type: String }, // Generated filename
      resumeOriginalName: { type: String }, // Original uploaded filename
      // Profile photo fields for GridFS
      profilePhotoId: { type: String }, // GridFS file ID
      profilePhotoFilename: { type: String }, // Generated filename
      // Company reference
      company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
      // Legacy fields (keep for backward compatibility)
      resume: { type: String },
      profilePhoto: { type: String },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;