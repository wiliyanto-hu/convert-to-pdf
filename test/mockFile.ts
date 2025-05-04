import { Readable } from 'stream';

const mockStream = new Readable();
mockStream.push('Fake file content');
mockStream.push(null); // End of stream

export default {
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
