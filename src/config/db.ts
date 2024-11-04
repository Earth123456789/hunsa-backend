import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    const mongoUrl = "mongodb+srv://user:password123456789@cluster0.48qjqvm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Get the URL from the environment variable

    // Check if the mongoUrl is defined
    if (!mongoUrl) {
      console.error("MongoDB URL is not defined. Please set the MONGO_URL environment variable.");
      process.exit(1);
    }

    console.log("Connecting to MongoDB at:", mongoUrl); // Log the URL
    await mongoose.connect(mongoUrl);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  }
};