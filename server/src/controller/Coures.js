import { asyncHandler } from "../utils/asyncHandler.js";
import { Courses } from "../model/Coures.js";
import { Lecture } from "../model/Lecture.js";
import { User } from "../model/User.js";
import { razorpayInstance } from "../app.js";
import { Payment } from "../model/Payment.js";

/**
 * GET ALL COURSES
 */
export const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Courses.find();

  res.status(200).json({
    success: true,
    message: "All courses fetched successfully",
    data: courses,
  });
});

/**
 * GET SINGLE COURSE
 */
export const getSingleCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const course = await Courses.findById(id);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found",
    });
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});
export const fetchLectures=asyncHandler(async(req,res)=>{
    const lectures = await Lecture.find({ course: req.params.id });

  const user = await User.findById(req.user._id);

  if (user.role === "admin") {
    return res.json({ lectures });
  }

  if (!user.subscription.includes(req.params.id))
    return res.status(400).json({
      message: "You have not subscribed to this course",
    });

  res.json({ lectures });
})

export const fetchLecture = asyncHandler(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  const user = await User.findById(req.user._id);

  if (user.role === "admin") {
    return res.json({ lecture });
  }

  if (!user.subscription.includes(lecture.course))
    return res.status(400).json({
      message: "You have not subscribed to this course",
    });

  res.json({ lecture });
});

export const getMyCourses = asyncHandler(async (req, res) => {
  const courses = await Courses.find({ _id: req.user.subscription });

  res.json({
    courses,
  });
});
export const checkout =asyncHandler(async(req,res)=>{
  const user = await User.findById(req.user._id);
  
  const course = await Courses.findById(req.params.id);

  if (user.subscription.includes(course._id)) {
    return res.status(400).json({
      message: "You already have this course",
    });
  }

  const options = {
    amount: Number(course.price * 100),
    currency: "INR",
  };

  const order = await razorpayInstance.orders.create(options);

  res.status(201).json({
    order,
    course,
  });
})
export const paymentVerification = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    const user = await User.findById(req.user._id);

    const course = await Courses.findById(req.params.id);

    user.subscription.push(course._id);

    await Progress.create({
      course: course._id,
      completedLectures: [],
      user: req.user._id,
    });

    await user.save();

    res.status(200).json({
      message: "Course Purchased Successfully",
    });
  } else {
    return res.status(400).json({
      message: "Payment Failed",
    });
  }
});