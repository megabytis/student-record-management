import mongoose from "mongoose";

const { Schema } = mongoose;

const studentSchema = new Schema(
  {
    student_name: {
      type: String,
      required: true,
      trim: true,
    },
    student_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const Student = mongoose.model("Student", studentSchema);
