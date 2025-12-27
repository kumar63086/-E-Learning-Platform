import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";
import { registerSchema } from "../validators/user.validators.js";
import { User } from "../model/User.js";
import jwt from "jsonwebtoken";
import { sendOtpMail } from "../utils/sendMail.js";
import { AppError } from "../utils/AppError.js";

export const register = asyncHandler(async (req, res) => {
  //  Validate request body
  const { name, email, password } = registerSchema.parse(req.body);

  if (!name || !email || !password) {
    throw new AppError("name and email,password are required", 400);
  }

  //  Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email is already registered", 409);
  }

  //  Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const userPayload = {
    name,
    email,
    password: hashedPassword,
  };

  //  Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  //  Create activation token (JWT)
  const activationToken = jwt.sign(
    {
      user: userPayload,
      otp,
    },
    process.env.ACTIVATION_SECRET,
    {
      expiresIn: process.env.ACTIVATION_EXPIRES_IN || "10m",
    }
  );

  //  Send OTP email
  try {
    await sendOtpMail({
      email,
      name,
      otp,
    });
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    throw new AppError("Could not send OTP email, please try again", 500);
  }

  //  Response
  res.status(201).json({
    success: true,
    message: "OTP sent to your email",
    activationToken,
  });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { otp, activationToken } = req.body;

  if (!otp || !activationToken) {
    throw new AppError("OTP and activation token are required", 400);
  }

  let decoded;
  try {
    decoded = jwt.verify(
      activationToken,
      process.env.ACTIVATION_SECRET
    );
  } catch (error) {
    throw new AppError("Invalid or expired activation token", 401);
  }

  // OTP match
  if (String(decoded.otp) !== String(otp)) {
    throw new AppError("Wrong OTP", 400);
  }

  // Prevent duplicate users
  const existingUser = await User.findOne({
    email: decoded.user.email,
  });

  if (existingUser) {
    throw new AppError("User already verified", 409);
  }

  // Create user
  await User.create({
    name: decoded.user.name,
    email: decoded.user.email,
    password: decoded.user.password,
  });

  res.status(201).json({
    success: true,
    message: "Account verified successfully",
  });
});


export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("No user with this email", 400);
  }

  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    throw new AppError("Wrong password", 400);
  }

  const token = jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "15d" }
  );

  res.status(200).json({
    success: true,
    message: `Welcome back ${user.name}`,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

export const myprofile= asyncHandler(async(req,res)=>{
  const user = await User.findById(req.user._id);

  res.json({ user });
})