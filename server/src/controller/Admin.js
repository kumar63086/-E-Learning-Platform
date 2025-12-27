import { Courses } from "../model/Coures.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createCourse = asyncHandler(async (req, res) => {
  const { title, description, price, duration, category, createdBy } = req.body;
  const image = req.file;

  //  Validation
  if (!title || !description || !price || !duration || !category || !createdBy) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (!image) {
    return res.status(400).json({
      success: false,
      message: "Course image is required",
    });
  }

  //  Create course
  const course = await Courses.create({
    title,
    description,
    price,
    duration,
    category,
    createdBy,
    image: image.path, // or image.filename depending on setup
  });

  //  Response
  res.status(201).json({
    success: true,
    message: "Course created successfully",
    data: course,
  });
});
