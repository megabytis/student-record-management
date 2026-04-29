import expree from "express";

import userRoutes from "./module/student/sudent.routes.js";

const router = expree.Router();

router.use("/students", userRoutes);

export default router;
