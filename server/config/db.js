import mongoose, { mongo } from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongoose connected");
  } catch (error) {
    console.log("error connecting db", error.message);
    process.exit(1);
  }
};

export default connectDB;
