import { Request } from 'express';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req: Request, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req: Request, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

export const pdfUpload = multer({ storage });
