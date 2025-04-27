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
  const UPLOAD_PATH = './uploads';
  const PDF_PATH = `${UPLOAD_PATH}/converted`;
  const fileNameWithoutExt = path.parse(req.file.filename).name;

  const pdfFileName = fileNameWithoutExt + '.pdf';
  try {
    // why ./workspace?, its a directory mount to docker
    const command = `docker exec libreoffice libreoffice --headless --convert-to pdf "./workspace/${uploadFileName}" --outdir "./workspace/converted"`;
    const result = await execCommand(command);
    if (!result.success) {
      res.send('Failed to convert file');
    }

    res.type('application/pdf');
    res.header('Content-Disposition', `attachment; filename=${pdfFileName}`);
    res.download(`./uploads/converted/${pdfFileName}`, pdfFileName);
  } catch (e) {
    console.log(e);
    res.send('Failed to convert file');
  }
  // finally {
  //   fs.unlink(`${UPLOAD_PATH}/${uploadFileName}`, (err) => {
  //     console.log(err);
  //   });
  //   fs.unlink(`${PDF_PATH}/${pdfFileName}`, (err) => {
  //     console.log(err);
  //   });
  // }
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
// TODO: 1. Remove file after conversion
// TODO: 2. Handle invalid file
// TODO: 3. Handle docker not run
// TODO: 3. Make exec a promise based function

app.listen(serverPort, () => {
  console.log(`Listening on porte ${serverPort}`);
});
