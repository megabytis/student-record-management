import mongoose from "mongoose";
import env from "./env.js";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  
  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      autoIndex: env.NODE_ENV === "developement",
    });

    console.log(
      `MongoDB connected: ${conn.connection.host}/${conn.connection.name}`,
    );
  } catch (err) {
    console.log("MongoDB connecton failed:", err.message);
    throw err;
  }
};

export default connectDB;
