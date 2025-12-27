import express from "express"
import { fetchLectures, getAllCourses, getSingleCourse } from "../controller/Coures.js";
import { isAuth } from "../middleware/isAuth.js";

const router= express.Router()
router.get("/course/all", getAllCourses);
router.get("/course/:id", getSingleCourse);
router.get("/lectures/:id", isAuth, fetchLectures);
export default router