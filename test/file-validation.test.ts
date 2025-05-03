import { documentValidation } from '../middleware/file-validation';
import * as fileType from 'file-type';
import fs from 'fs';
import { removeFiles } from '../utils/fileManager';
import { Request, Response, NextFunction } from 'express';
import { Readable } from 'stream';
import { ALLOWED_EXTENSION } from '../constant/allowedExtensions';
jest.mock('fs');
jest.mock('file-type');
jest.mock('../utils/fileManager');

const mockStream = new Readable();
mockStream.push('Fake file content');
mockStream.push(null); // End of stream

const mockFile = {
  fieldname: 'file',
  originalname: 'valid-document.exe',
  encoding: '7bit',
  mimetype:
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  buffer: Buffer.from('Fake file content'),
  size: 1024,
  path: '/fake/path/to/file/valid-document.exe',
  filename: 'valid-document.exe',
  destination: 'x',
  stream: mockStream,
};

describe('Upload doc file validation', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  const next = jest.fn();

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  it('should send error if no file is uploaded', async () => {
    await documentValidation(req as Request, res as Response, next);
    expect(res.send).toHaveBeenCalledWith('Invalid file');
    expect(next).not.toHaveBeenCalled();
  });
  it('should send error if no the extension is not allowed', async () => {
    req = {
      file: mockFile,
    };
    await documentValidation(req as Request, res as Response, next);
    expect(res.send).toHaveBeenCalledWith(
      `Unsupported file type. Only ${ALLOWED_EXTENSION} are allowed`
    );
    expect(next).not.toHaveBeenCalled();
  });
});
