import fs from 'fs';
export const removeFiles = async (
  uploadFileName: string,
  pdfFileName?: string
): Promise<void> => {
  const UPLOAD_PATH = './uploads';
  const PDF_PATH = `${UPLOAD_PATH}/converted`;
  console.log('CLEANING FILES', uploadFileName, pdfFileName);
  fs.unlink(`${UPLOAD_PATH}/${uploadFileName}`, (err) => {
    if (err) console.log(err);
  });
  if (pdfFileName) {
    fs.unlink(`${PDF_PATH}/${pdfFileName}`, (err) => {
      if (err) console.log(err);
    });
  }
};
