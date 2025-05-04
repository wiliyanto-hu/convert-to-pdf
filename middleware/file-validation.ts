import path from 'path';
import { fileTypeFromStream } from 'file-type';
import fs from 'fs';
import { NextFunction, Request, Response } from 'express';
import { removeFiles } from '../utils/fileManager';
import {
  ALLOWED_EXTENSION,
  ALLOWED_MIMETYPE,
} from '../constant/allowedExtensions';

export const documentValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    res.send('Invalid file');
    return;
  }

  const uploadFileName = req.file.filename;
  const fileExtension = path.extname(uploadFileName).toLowerCase();
  const stream = fs.createReadStream(req.file.path);
  const fileInfo = await fileTypeFromStream(stream);
  console.log(fileInfo);
  if (
    !ALLOWED_EXTENSION.includes(fileExtension) ||
    !fileInfo ||
    !ALLOWED_MIMETYPE.includes(fileInfo.mime)
  ) {
    res
      .status(400)
      .send(`Unsupported file type. Only ${ALLOWED_EXTENSION} are allowed`);
    removeFiles(uploadFileName);
    return;
  }

  next();
};
