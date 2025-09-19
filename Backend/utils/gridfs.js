// utils/gridfs.js
import mongoose from "mongoose";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";

let gridfsBucket;
let upload;

export const initGridFs = async () => {
  const conn = mongoose.connection;

  return new Promise((resolve, reject) => {
    conn.once("open", () => {
      gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "uploads",
      });
      console.log("✅ GridFS initialized");

      const storage = new GridFsStorage({
        db: conn,
        file: (req, file) => {
          return {
            filename: `${Date.now()}-${file.originalname}`,
            bucketName: file.mimetype?.startsWith("image/") ? "profile_photos" : "resumes",
          };
        },
      });

      upload = multer({ storage });
      resolve();
    });

    conn.on("error", (err) => reject(err));
  });
};

export const getUpload = () => {
  if (!upload) throw new Error("Multer upload not initialized");
  return upload;
};

export const getGridFsBucket = () => {
  if (!gridfsBucket) throw new Error("GridFSBucket not initialized");
  return gridfsBucket;
};
