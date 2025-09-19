// utils/girdfsStorage.js
import mongoose from "mongoose";
import multer from "multer";
import { GridFSBucket } from "mongodb";

// Initialize GridFSBucket reference
let gridfsBucket;
let isInitialized = false;

export const initGridFs = () => {
  const conn = mongoose.connection;
  
  const setupGridFS = () => {
    try {
      if (conn.db) {
        gridfsBucket = new GridFSBucket(conn.db, {
          bucketName: "uploads",
        });
        isInitialized = true;
        console.log("✅ GridFS initialized successfully");
      } else {
        console.error("Database connection not ready");
        isInitialized = false;
      }
    } catch (error) {
      console.error("GridFS initialization error:", error);
      isInitialized = false;
    }
  };

  if (conn.readyState === 1) {
    setupGridFS();
  } else {
    conn.once("open", setupGridFS);
  }

  conn.on("error", (err) => {
    console.error("MongoDB connection error:", err);
    isInitialized = false;
  });
};

// Custom storage engine for GridFS
const gridfsStorage = {
  _handleFile: (req, file, cb) => {
    if (!gridfsBucket || !isInitialized) {
      return cb(new Error("GridFS not initialized"));
    }

    const filename = `${Date.now()}-${file.originalname}`;
    
    try {
      const uploadStream = gridfsBucket.openUploadStream(filename, {
        metadata: {
          originalName: file.originalname,
          mimetype: file.mimetype,
          uploadedAt: new Date(),
          fileType: file.mimetype?.startsWith("image/") ? "image" : "document",
          uploadedBy: req.id || req.userId || "unknown"
        }
      });

      file.stream.pipe(uploadStream);

      uploadStream.on("error", (error) => {
        console.error("GridFS upload error:", error);
        cb(error);
      });

      uploadStream.on("finish", () => {
        console.log("File uploaded successfully:", {
          id: uploadStream.id,
          filename: filename,
          originalname: file.originalname
        });
        
        cb(null, {
          id: uploadStream.id,
          _id: uploadStream.id,
          filename: filename,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: uploadStream.length
        });
      });
    } catch (error) {
      console.error("GridFS upload stream error:", error);
      cb(error);
    }
  },

  _removeFile: (req, file, cb) => {
    if (gridfsBucket && file.id) {
      gridfsBucket.delete(file.id, (err) => {
        if (err) {
          console.error("Error removing file:", err);
        }
        cb(err);
      });
    } else {
      cb(null);
    }
  }
};

// Multer configuration with custom storage
export const upload = multer({
  storage: gridfsStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and PDF files
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'application/pdf'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, PNG, GIF) and PDF files are allowed'), false);
    }
  }
});

// Accessor for GridFSBucket
export const getGridFsBucket = () => {
  if (!gridfsBucket || !isInitialized) {
    throw new Error("GridFSBucket not initialized. Call initGridFs() after mongoose.connect().");
  }
  return gridfsBucket;
};

// Check if GridFS is ready
export const isGridFSReady = () => {
  return gridfsBucket && isInitialized;
};

// Helper function to delete file by ID
export const deleteFileById = async (fileId) => {
  try {
    if (!gridfsBucket) {
      throw new Error("GridFS not initialized");
    }
    await gridfsBucket.delete(new mongoose.Types.ObjectId(fileId));
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
};

// Helper function to check if file exists
export const fileExists = async (fileId) => {
  try {
    if (!gridfsBucket) {
      return false;
    }
    const files = await gridfsBucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
    return files.length > 0;
  } catch (error) {
    console.error("Error checking file existence:", error);
    return false;
  }
};