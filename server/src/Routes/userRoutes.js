import express from "express"
import { login, myprofile, register, verifyOtp } from "../controller/user.js"
import { isAuth } from "../middleware/isAuth.js";
const router= express.Router()

router.post('/register',register)
router.post("/verify-otp", verifyOtp);
router.post('/login',login)
router.get("/me",isAuth,myprofile)
export default router