import path from 'path';
import { fileTypeFromStream } from 'file-type';
import fs from 'fs';
import { NextFunction, Request, Response } from 'express';
import { removeFiles } from '../utils/fileManager';

export const documentValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    res.send('Invalid file');
    return;
  }

  const allowedExtensions = ['.docx', '.xlsx', '.pptx'];
  const uploadFileName = req.file.filename;
  const fileExtension = path.extname(uploadFileName).toLowerCase();
  const stream = fs.createReadStream(req.file.path);

  const fileInfo = await fileTypeFromStream(stream);
  if (!allowedExtensions.includes(fileExtension) || !fileInfo) {
    res
      .status(400)
      .send(`Unsupported file type. Only ${allowedExtensions} are allowed`);
    removeFiles(uploadFileName);
    return;
  }
  next();
};
