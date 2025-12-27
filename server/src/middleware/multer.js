import multer from "multer";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";

const uploadPath = path.join(process.cwd(), "uploads");

// auto-create uploads folder
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${uuid()}${ext}`);
  },
});

export const uploadFiles = multer({ storage }).single("file");
