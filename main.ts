import express from 'express';
import { pdfUpload } from './middleware/pdf-upload';
import { convertToPdf } from './controller/converter.controller';

const serverPort = process.env.SERVER_PORT ?? 5000;
const app = express();

app.get('/', (req, res) => {
  res.send('Hi');
});
app.post('/convert-to-pdf', pdfUpload.single('file'), convertToPdf);

// TODO: 1. Check fake file (ex .exe uploaded as .docx)
// TODO: 2. Remove file outside of try catch block

app.listen(serverPort, () => {
  console.log(`Listening on porte ${serverPort}`);
});
