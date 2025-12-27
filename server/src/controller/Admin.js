import { asyncHandler } from "../utils/asyncHandler.js";
import {Courses} from "../model/Coures.js"
import { Lecture } from "../model/Lecture.js";
import { rm } from "fs";
import { promisify } from "util";
import fs from "fs";
import { User } from "../model/User.js";
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

export const deleteLecture = asyncHandler(async (req, res) => {
    console.log(req.params.id);
  const lecture = await Lecture.findById(req.params.id);

  rm(lecture.video, () => {
    console.log("Video deleted");
  });

  await lecture.deleteOne();

  res.json({ message: "Lecture Deleted" });
});
const unlinkAsync = promisify(fs.unlink);
export const deleteCourse = asyncHandler(async (req, res) => {
  // Try to find the course by ID
  const course = await Courses.findById(req.params.id);
  console.log("COURSE ID 👉", req.params.id);

  // Check if the course exists
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  // If course exists, find lectures
  const lectures = await Lecture.find({ course: course._id });

  // Delete videos related to the course
  await Promise.all(
    lectures.map(async (lecture) => {
      await unlinkAsync(lecture.video);
      console.log("video deleted");
    })
  );

  // Delete the course image
  rm(course.image, () => {
    console.log("image deleted");
  });

  // Delete lectures associated with the course
  await Lecture.find({ course: req.params.id }).deleteMany();

  // Delete the course itself
  await course.deleteOne();

  // Remove course from all user subscriptions
  await User.updateMany({}, { $pull: { subscription: req.params.id } });

  // Respond with a success message
  res.json({
    message: "Course Deleted",
  });
});

export const getAllStats = asyncHandler(async (req, res) => {
  const totalCoures = (await Courses.find()).length;
  const totalLectures = (await Lecture.find()).length;
  const totalUsers = (await User.find()).length;

  const stats = {
    totalCoures,
    totalLectures,
    totalUsers,
  };

  res.json({
    stats,
  });
});

export const getAllUser = asyncHandler(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select(
    "-password"
  );

  res.json({ users });
});