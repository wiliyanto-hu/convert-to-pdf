import express from "express";
import { pdfUpload } from "./middleware/pdf-upload";
import { convertToPdf } from "./controller/converter.controller";
import { documentValidation } from "./middleware/file-validation";

const serverPort = process.env.SERVER_PORT ?? 5000;
const app = express();

app.get("/", (req, res) => {
  res.send("Hi");
});
app.post(
  "/convert-to-pdf",
  pdfUpload.single("file"),
  documentValidation,
  convertToPdf
);

if (process.env.NODE_ENV !== "test") {
  app.listen(serverPort, () => {
    console.log(`Listening on porte ${serverPort}`);
  });
}

export default app;
