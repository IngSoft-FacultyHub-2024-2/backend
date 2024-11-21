import { Request, Response } from 'express';
import FileProcessorController from '../../src/controllers/fileProcessorController';
import { LecturesReturnDto } from '../../src/modules/file-processor/dtos/LecturesReturnDto';
import { processFile } from '../../src/modules/file-processor/services/fileProcessorService';
import { returnError } from '../../src/shared/utils/exceptions/handleExceptions';

jest.mock('../../src/modules/file-processor/services/fileProcessorService');
jest.mock('../../src/shared/utils/exceptions/handleExceptions');

const mockProcessedSemester: LecturesReturnDto[] = [
  {
    sheetName: 'Semestre 1',
    lectures: [
      {
        subject_name: 'Materia 1',
        lecture_groups: [
          {
            name: 'N5A',
            roles: ['Tecnología', 'Teórico'],
          },
        ],
      },
      {
        subject_name: 'Materia 2',
        lecture_groups: [],
      },
    ],
  },
];

describe('FileProcessorController', () => {
  let mockReq = {} as Request;
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;

  const mockFile = {
    originalname: 'test-file.xlsx',
    path: 'test-file-path',
    fieldname: 'file',
    encoding: '7bit',
    mimetype:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 12345,
    buffer: Buffer.from(''),
    stream: new (require('stream').Readable)(),
    destination: 'test-destination',
    filename: 'test-filename',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('processes a file successfully', async () => {
    // Arrange
    mockReq.file = mockFile;
    mockReq.body = { someKey: 'someValue' };
    (processFile as jest.Mock).mockResolvedValue(mockProcessedSemester);

    // Act
    await FileProcessorController.processFile(mockReq, mockRes);

    // Assert
    expect(processFile).toHaveBeenCalledWith('test-file.xlsx', mockReq.body);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockProcessedSemester);
  });

  it('processes a file successfully with empty result', async () => {
    // Arrange
    mockReq.file = mockFile;
    mockReq.body = { someKey: 'someValue' };
    (processFile as jest.Mock).mockResolvedValue(null);

    // Act
    await FileProcessorController.processFile(mockReq, mockRes);

    // Assert
    expect(processFile).toHaveBeenCalledWith('test-file.xlsx', mockReq.body);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(null);
  });

  it('handles error during file processing', async () => {
    // Arrange
    const mockError = new Error('Error al procesar el archivo');
    mockReq.file = mockFile;
    mockReq.body = { someKey: 'someValue' };
    (processFile as jest.Mock).mockRejectedValue(mockError);

    // Act
    await FileProcessorController.processFile(mockReq, mockRes);

    // Assert
    expect(processFile).toHaveBeenCalledWith('test-file.xlsx', mockReq.body);
    expect(returnError).toHaveBeenCalledWith(mockRes, mockError);
  });
});
