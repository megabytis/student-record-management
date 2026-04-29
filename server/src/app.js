import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";
import morgan from "morgan";

import routes from "./routes.js";
import errorMiddleware from "./shared/middlewares/error.middleware.js";
import env from "./config/env.js";

const app = express();

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       const allowedOrigins = ["http://localhost:8080", env.FRONTEND_URL];
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
//     optionsSuccessStatus: 200,
//   }),
// );
app.use(express.json());
app.use(cookieparser());

// logs
if (process.env.NODE_ENV === "developement") {
  app.use(morgan("dev"));
}

// health
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api", routes);

app.use(errorMiddleware);

export default app;
