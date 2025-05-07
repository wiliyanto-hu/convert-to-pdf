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
    download: jest.fn().mockReturnThis(),
    type: jest.fn().mockReturnThis(),
    header: jest.fn().mockReturnThis(),
    on: jest.fn().mockReturnThis(),
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

  it('Should success if no error', async () => {
    req.file = mockFile;
    (execCommand as jest.Mock).mockResolvedValueOnce({
      success: true,
      message: '',
    });
    await convertToPdf(req as Request, res as Response);
    expect(res.type).toHaveBeenCalledWith('application/pdf');
    expect(res.download).toHaveBeenCalled();
    expect(removeFiles).toHaveBeenCalled();
  });
});
