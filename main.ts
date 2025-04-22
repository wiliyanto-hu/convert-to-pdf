import express, { Request, Response } from 'express';
import { getUser } from './test.controller';
const serverPort = process.env.SERVER_PORT ?? 5000;
const app = express();

app.get('/', getUser);
app.get('/convert-to-pdf', getUser);

//TODO: 1. Add multer
//TODO: 2. Read pdf file, fs and stuff
//TODO: 3. Function to convert to pdf (route to docker)

app.listen(serverPort, () => {
  console.log(`Listening on porte ${serverPort}`);
});
