import dotenv from "dotenv";
dotenv.config(); 

import app from "./app.js";
import { connectDb } from "./config/db.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📘 Swagger Docs → http://localhost:${PORT}/api-docs`);
  await connectDb();
});
