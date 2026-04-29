import app from "../server/src/app.js";
import connectDB from "../server/src/config/db.js";

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (error) {
    console.error("Database connection failed", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }

  return app(req, res);
}
