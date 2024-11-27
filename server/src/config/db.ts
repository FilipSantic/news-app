import mongoose from "mongoose";
import "colors";

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI || "";
    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB".magenta);
  } catch (error) {
    console.error("Error connecting to MongoDB:".red, error);
    process.exit(1);
  }
};

export default connectDB;
