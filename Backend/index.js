import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.routes.js";
import jobRoute from "./routes/job.routes.js";
import applicationRoute from "./routes/application.routes.js";
import { initGridFs } from "./utils/girdfsStorage.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

// Initialize database and GridFS
const startServer = async () => {
  try {
    console.log("🚀 Starting server initialization...");
    
    // Wait for database connection
    await connectDB();
    console.log("✅ Database connected successfully");
    
    // Wait for GridFS initialization
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("GridFS initialization timeout"));
      }, 10000); // 10 second timeout

      const checkGridFS = () => {
        try {
          if (mongoose.connection.readyState === 1) {
            initGridFs();
            
            // Give GridFS some time to initialize
            setTimeout(() => {
              clearTimeout(timeout);
              console.log("✅ GridFS initialization completed");
              resolve();
            }, 1000);
          } else {
            // If connection is not ready, wait for it
            mongoose.connection.once('open', () => {
              initGridFs();
              setTimeout(() => {
                clearTimeout(timeout);
                console.log("✅ GridFS initialization completed");
                resolve();
              }, 1000);
            });
          }
        } catch (error) {
          clearTimeout(timeout);
          reject(error);
        }
      };
      
      checkGridFS();
    });

    // Setup routes with error handling - one by one to identify problematic route
    try {
      console.log("📍 Setting up user routes...");
      app.use("/api/v1/user", userRoute);
      console.log("✅ User routes setup completed");
      
      console.log("📍 Setting up company routes...");
      app.use("/api/v1/company", companyRoute);
      console.log("✅ Company routes setup completed");
      
      console.log("📍 Setting up job routes...");
      app.use("/api/v1/job", jobRoute);
      console.log("✅ Job routes setup completed");
      
      console.log("📍 Setting up application routes...");
      app.use("/api/v1/application", applicationRoute);
      console.log("✅ Application routes setup completed");
      
    } catch (routeError) {
      console.error("❌ Error setting up routes:", routeError);
      throw routeError;
    }

    // Error handling middleware
    app.use((error, req, res, next) => {
      console.error("Server error:", error);
      
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
          message: "File too large. Maximum size is 10MB", 
          success: false 
        });
      }
      
      if (error.message.includes('Only images') || error.message.includes('PDF files')) {
        return res.status(400).json({ 
          message: error.message, 
          success: false 
        });
      }
      
      res.status(500).json({ 
        message: "Internal server error", 
        success: false 
      });
    });

    // 404 handler
    // 404 handler
// 404 handler
app.use((req, res) => {  // ← No '*' here
  res.status(404).json({ 
    message: "Route not found", 
    success: false 
  });
});

    app.listen(PORT, () => {
      console.log(`🚀 Server running at port ${PORT}`);
      console.log(`📝 API Base URL: http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  try {
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();