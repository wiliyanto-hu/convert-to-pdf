import { convertToPdf } from '../controller/converter.controller';
import { execCommand } from '../utils/executeCommand';
import { Request, Response, NextFunction } from 'express';
import { removeFiles } from '../utils/fileManager';
import mockFile from './mockFile';

jest.mock('../utils/executeCommand.ts', () => ({
  execCommand: jest.fn(),
}));
jest.mock('../utils/fileManager', () => ({
  removeFiles: jest.fn(),
}));

describe('Convert to pdf', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  req = {};
  res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };

  it('Should send error if failed to convert', async () => {
    (execCommand as jest.Mock).mockRejectedValueOnce({
      success: false,
      message: 'Error converting to PDF',
    });
    req.file = mockFile;
    await convertToPdf(req as Request, res as Response);
    expect(res.send).toHaveBeenCalledWith('Failed to convert file');
    expect(removeFiles).toHaveBeenCalled();
  });
});
