import { z } from "zod";

/* =========================
   Common Fields
========================= */

const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters");

const emailSchema = z
  .string()
  .email("Invalid email address");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[@$!%*?&]/, "Password must contain at least one special character");

/* =========================
   Register Validation
========================= */

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

/* =========================
   Login Validation
========================= */

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

/* =========================
   Role Update (Admin Only)
========================= */

export const roleSchema = z.object({
  role: z.enum(["user", "admin"]),
  mainrole: z.enum(["user", "admin"]),
});

/* =========================
   Reset Password
========================= */

export const resetPasswordSchema = z.object({
  password: passwordSchema,
});

/* =========================
   Forgot Password (Email)
========================= */

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});
