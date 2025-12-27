import { z } from "zod";

export const createCourseSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),

  image: z
    .string()
    .url("Image must be a valid URL"),

  price: z
    .number()
    .positive("Price must be greater than 0"),

  duration: z
    .number()
    .positive("Duration must be greater than 0"),

  category: z
    .string()
    .min(3, "Category is required"),

  createdBy: z
    .string()
    .min(3, "Creator is required"),
});
