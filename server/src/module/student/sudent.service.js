import { createError } from "../../shared/utils/error.js";
import { Student } from "./student.model.js";

export const createStudent = async (data) => {
  try {
    const student = await Student.create(data);
    return student;
  } catch (err) {
    if ((err.code = 11000)) {
      throw createError("Student ID must be unique", 400);
    }
    throw createError("Failed to create student", 500);
  }
};

export const getAllStudents = async () => {
  return await Student.find().sort({ createdAt: -1 });
};

export const updateStudent = async (id, data) => {
  try {
    const updated = await Student.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      throw createError("Student not found", 404);
    }

    return updated;
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Student ID must be Unique" });
    }
  }
};

export const deleteStudent = async (id) => {
  const deleted = await Student.findByIdAndDelete(id);

  if (!deleted) {
    throw createError("Student not found", 404);
  }

  return deleted;
};
