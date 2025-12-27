import express from "express"
import { fetchLectures, getAllCourses, getSingleCourse ,fetchLecture } from "../controller/Coures.js";
import { isAuth } from "../middleware/isAuth.js";

const router= express.Router()
router.get("/course/all", getAllCourses);
router.get("/course/:id", getSingleCourse);
router.get("/lectures/:id", isAuth, fetchLectures);
router.get("/lecture/:id", isAuth, fetchLecture);
export default router