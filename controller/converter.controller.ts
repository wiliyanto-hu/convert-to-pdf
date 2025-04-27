import { Request, Response } from 'express';
import { execCommand } from '../utils/executeCommand';
import { removeFiles } from '../utils/fileManager';
import path from 'path';

export const convertToPdf = async (req: Request, res: Response) => {
  if (!req.file) {
    res.send('Invalid file');
    return;
  }
  const uploadFileName = req.file.filename;
  const fileNameWithoutExt = path.parse(req.file.filename).name;

  const allowedExtensions = ['.docx', '.xlsx', '.pptx'];
  const fileExtension = path.extname(uploadFileName).toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    res
      .status(400)
      .send(`Unsupported file type. Only ${allowedExtensions} are allowed`);
    return;
  }

  const pdfFileName = fileNameWithoutExt + '.pdf';
  try {
    // why ./workspace?, its a directory mount to docker
    const command = `docker exec libreoffice libreoffice --headless --convert-to pdf "./workspace/${uploadFileName}" --outdir "./workspace/converted"`;
    const result = await execCommand(command);
    if (!result.success) {
      res.send('Failed to convert file');
      return;
    }

    res.type('application/pdf');
    res.header('Content-Disposition', `attachment; filename=${pdfFileName}`);
    res.download(`./uploads/converted/${pdfFileName}`, pdfFileName, (err) => {
      if (err) {
        console.log(err);
        res.send('Failed to convert file');
        removeFiles(uploadFileName, pdfFileName);

        return;
      }
    });

    res.on('finish', () => {
      removeFiles(uploadFileName, pdfFileName);
    });
  } catch (err) {
    console.log(err);
    removeFiles(uploadFileName, pdfFileName);
    res.send('Failed to convert file');
  }
};
