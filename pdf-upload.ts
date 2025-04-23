import { Request } from 'express';
import fs from 'fs';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req: Request, file, cb) {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads/');
  },
  filename: function (req: Request, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

export const pdfUpload = multer({ storage });
