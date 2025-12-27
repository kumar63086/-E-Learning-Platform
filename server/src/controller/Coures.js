import { asyncHandler } from "../utils/asyncHandler.js";
import { Courses } from "../model/Coures.js";
import { Lecture } from "../model/Lecture.js";
import { User } from "../model/User.js";

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