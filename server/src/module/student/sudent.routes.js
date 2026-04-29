import express from "express";
import asyncHandler from "../../shared/utils/asyncHandler.js";
import {
  createStudent,
  getStudents,
  updateStudent,
  deleteStudent,
} from "./sudent.controller.js";

const router = express.Router();

router.post("/", asyncHandler(createStudent));
router.get("/", asyncHandler(getStudents));
router.put("/:id", asyncHandler(updateStudent));
router.delete("/:id", asyncHandler(deleteStudent));

export default router;
