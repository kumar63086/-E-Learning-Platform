import { z } from "zod";
import mongoose from "mongoose";

export const createLectureSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Lecture title must be at least 3 characters")
    .max(100, "Lecture title must not exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Lecture description must be at least 10 characters")
    .max(1000, "Lecture description must not exceed 1000 characters"),

  video: z
    .string()
    .url("Invalid video URL"),

  course: z
    .string()
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: "Invalid course ID",
    }),
});
