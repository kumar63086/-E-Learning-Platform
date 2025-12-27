import express from "express"
import { isAdmin, isAuth } from "../middleware/isAuth.js"
import { createCourse } from "../controller/Admin.js"
import { uploadFiles } from "../middleware/multer.js"

const router= express.Router()

router.post('/new/coures',isAuth,isAdmin,uploadFiles,createCourse)
export default router