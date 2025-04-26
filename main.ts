import express, { Request, Response } from 'express';
import { getUser } from './test.controller';
import { pdfUpload } from './pdf-upload';
import { exec } from 'child_process';
import path from 'path';
const serverPort = process.env.SERVER_PORT ?? 5000;
const app = express();

app.get('/', getUser);
app.post('/convert-to-pdf', pdfUpload.single('file'), (req, res) => {
  if (!req.file) {
    res.send('Invalid file');
    return;
  }

  const uploadFileName = req.file.filename;
  const fileNameWithoutExt = path.parse(req.file.filename).name;
  // why ./workspace?, its a directory mount to docker
  const command = `docker exec libreoffice libreoffice --headless --convert-to pdf "./workspace/${uploadFileName}" --outdir "./workspace/converted"`;

  exec(command, (error, stdout, stdin) => {
    if (error) {
      res.send('Failed to convert file');
      return;
    }

    res.download(
      `./uploads/converted/${fileNameWithoutExt}.pdf`,
      `${fileNameWithoutExt}.pdf`
    );
  });
});

app.listen(serverPort, () => {
  console.log(`Listening on porte ${serverPort}`);
});
