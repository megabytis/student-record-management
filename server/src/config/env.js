import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

const env = {
  NODE_ENV: process.env.NODE_ENV || "developement",
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/studentDB",
  // FRONTEND_URL: process.env.FRONTEND_URL,
};

export default env;
