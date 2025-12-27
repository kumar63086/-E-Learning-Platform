import { asyncHandler } from "../utils/asyncHandler.js";
import { Courses } from "../model/Coures.js";

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
