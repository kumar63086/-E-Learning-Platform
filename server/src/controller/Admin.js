import { asyncHandler } from "../utils/asyncHandler.js";
import {Courses} from "../model/Coures.js"
import { Lecture } from "../model/Lecture.js";

export const createCourse = asyncHandler(async (req, res) => {
  console.log("BODY 👉", req.body);
  console.log("FILE 👉", req.file);
  console.log("USER 👉", req.user);

  const { title, description, price, duration, category,createdBy } = req.body;
  const image = req.file;

  if (!title || !description || !price || !duration || !category) {
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

  const course = await Courses.create({
    title,
    description,
    category,
    price,
    duration,
    image: image.path,
    createdBy,
  });

  res.status(201).json({
    success: true,
    message: "Course created successfully",
    data: course,
  });
});

export const addLectures = asyncHandler(async (req, res) => {
  const course = await Courses.findById(req.params.id);
console.log(req.file?.originalname, req.file?.size);

  if (!course)
    return res.status(404).json({
      message: "No Course with this id",
    });

  const { title, description } = req.body;

  const file = req.file;

  const lecture = await Lecture.create({
    title,
    description,
    video: file?.path,
    course: course._id,
  });

  res.status(201).json({
    message: "Lecture Added",
    lecture,
  });
});

