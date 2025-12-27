import { asyncHandler } from "../utils/asyncHandler.js";
import {Courses} from "../model/Coures.js"

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

export const get = asyncHandler(async(req,res)=>{
res.send("admin")
})
