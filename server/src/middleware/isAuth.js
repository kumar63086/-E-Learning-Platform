import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { User } from "../model/User.js";

export const isAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Expect: Authorization: Bearer <token>
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Access token is missing or invalid", 401);
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new AppError("Invalid or expired token", 401);
  }

  const user = await User.findById(decoded._id).select("-password");

  if (!user) {
    throw new AppError("User no longer exists", 401);
  }

  req.user = user;
  next();
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin") {
    throw new AppError("You are not authorized as admin", 403);
  }

  next();
});

