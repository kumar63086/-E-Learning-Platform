import express from "express"
import { isAdmin, isAuth } from "../middleware/isAuth.js"
import { addLectures, createCourse } from "../controller/Admin.js"
import { uploadFiles } from "../middleware/multer.js"

const router= express.Router()

router.post('/createcourse',isAuth,isAdmin,uploadFiles,createCourse)
router.post("/:id", isAuth,isAdmin,uploadFiles,addLectures )

export default router