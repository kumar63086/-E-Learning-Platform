import express from "express"
import { isAdmin, isAuth } from "../middleware/isAuth.js"
import { addLectures, createCourse, deleteCourse, deleteLecture, getAllStats, getAllUser, } from "../controller/Admin.js"
import { uploadFiles } from "../middleware/multer.js"

const router= express.Router()

router.post('/createcourse',isAuth,isAdmin,uploadFiles,createCourse)
router.post("/:id", isAuth,isAdmin,uploadFiles,addLectures )
router.delete("/:id", isAuth, isAdmin, deleteCourse);
router.delete("/letcture/:id",isAuth,isAdmin,deleteLecture)
router.get("/stats", isAuth, isAdmin, getAllStats);
router.get("/users", isAuth, isAdmin, getAllUser);
export default router