import dotenv from "dotenv"; 
dotenv.config();
import express from "express"
import cors from "cors"
import router from "./Routes/userRoutes.js";
import { globalErrorHandler } from "./middleware/ErrorHanlere.js";
import { swaggerSpec, swaggerUiMiddleware } from "./config/swagger.js";
import { AppError } from "./utils/AppError.js";
import CouresRouter from "./Routes/AdminRouter.js"
const app= express()

app.use(express.json({ limit: "4gb" }));
app.use(express.urlencoded({ limit: "4gb", extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true
}));
app.use('/uploads', express.static('uploads'));

app.use("/api-docs", swaggerUiMiddleware.serve, swaggerUiMiddleware.setup(swaggerSpec));
app.use('/api/v1/user',router)
app.use("/api/v1/coures",CouresRouter)
// 404
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
 
// ERROR HANDLER
app.use(globalErrorHandler);

export default app
