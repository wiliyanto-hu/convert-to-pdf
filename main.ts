import express, { Request, Response } from 'express';
import { getUser } from './test.controller';
import { pdfUpload } from './pdf-upload';
const serverPort = process.env.SERVER_PORT ?? 5000;
const app = express();

app.get('/', getUser);
app.post('/convert-to-pdf', pdfUpload.single('file'), (req, res) => {
  if (!req.file) {
    res.send('Invalid file');
    return;
  }
  res.send(req.file);
});

//TODO: 1. Add multer
//TODO: 2. Read pdf file, fs and stuff
//TODO: 3. Function to convert to pdf (route to docker)

app.listen(serverPort, () => {
  console.log(`Listening on porte ${serverPort}`);
});
