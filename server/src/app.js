import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";
import morgan from "morgan";

import routes from "./routes.js";
import errorMiddleware from "./shared/middlewares/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: ["https://student-record-management-frontend.vercel.app"],
    credentials: true,
  }),
);
// app.use(cors());
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
