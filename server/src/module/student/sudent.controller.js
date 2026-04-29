import { createError } from "../../shared/utils/error.js";
import * as studentService from "./sudent.service.js";

export const createStudent = async (req, res, next) => {
  try {
    const { student_name, student_id, phone } = req.body;

    if (!student_name || !student_id || !phone) {
      throw createError("All fields are required", 400);
    }

    const student = await studentService.createStudent({
      student_name: student_name.trim(),
      student_id: student_id.trim(),
      phone: phone.trim(),
    });
    return res.status(200).json(student);
  } catch (err) {
    next(err);
  }
};

export const getStudents = async (req, res, next) => {
  try {
    const students = await studentService.getAllStudents();
    return res.status(200).json(students);
  } catch (err) {
    next(err);
  }
};

export const updateStudent = async (req, res, next) => {
  try {
    const { student_name, student_id, phone } = req.body;

    const updated = await studentService.updateStudent(req.params.id, {
      ...(student_name && { student_name: student_name.trim() }),
      ...(student_id && { student_id: student_id.trim() }),
      ...(phone && { phone: phone.trim() }),
    });

    return res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    await studentService.deleteStudent(req.params.id);
    return res.status(200).json({
      message: "Student deleted Successfully",
    });
  } catch (err) {
    next(err);
  }
};
