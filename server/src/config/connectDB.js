import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB at:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongoose connected...");
  } catch (error) {
    console.log("error connecting db", error.message);
    process.exit(1);
  }
};

export default connectDB;
