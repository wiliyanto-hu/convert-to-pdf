import express, { Request, Response } from 'express';
import { getUser } from './test.controller';
const serverPort = process.env.SERVER_PORT ?? 5000;
const app = express();

app.get('/', getUser);

app.listen(serverPort, () => {
  console.log(`Listening on porte ${serverPort}`);
});
