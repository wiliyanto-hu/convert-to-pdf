import express, { Request, Response } from 'express';
import { getUser } from './test.controller';
import { pdfUpload } from './pdf-upload';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
const serverPort = process.env.SERVER_PORT ?? 5000;
const app = express();

app.get('/', getUser);
app.post('/convert-to-pdf', pdfUpload.single('file'), async (req, res) => {
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
});

const execCommand = async (
  command: string
): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stdin) => {
      if (error) {
        console.log(error);
        reject({ success: false, message: error.message });
      }
      resolve({ success: true, message: stdout });
    });
  });
};

const removeFiles = async (
  uploadFileName: string,
  pdfFileName: string
): Promise<void> => {
  const UPLOAD_PATH = './uploads';
  const PDF_PATH = `${UPLOAD_PATH}/converted`;
  console.log('CLEANING FILES');
  fs.unlink(`${UPLOAD_PATH}/${uploadFileName}`, (err) => {
    if (err) console.log(err);
  });
  if (pdfFileName) {
    fs.unlink(`${PDF_PATH}/${pdfFileName}`, (err) => {
      if (err) console.log(err);
    });
  }
};
// TODO: 1. Check fake file (ex .exe uploaded as .docx)

app.listen(serverPort, () => {
  console.log(`Listening on porte ${serverPort}`);
});
