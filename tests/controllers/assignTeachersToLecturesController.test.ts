import { Request, Response } from 'express';
import { getAssignationsConflicts } from '../../src/modules/assignTeachersToLectures';
import AssignTeachersToLecturesController from '../../src/controllers/assignTeachersToLecturesController';
import { returnError } from '../../src/shared/utils/exceptions/handleExceptions';

jest.mock('../../src/modules/assignTeachersToLectures', () => ({
  getAssignationsConflicts: jest.fn(),
}));

jest.mock('../../src/shared/utils/exceptions/handleExceptions', () => ({
  returnError: jest.fn(),
}));

describe('AssignTeachersToLecturesController - getAssignationsConflicts', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it('should return 200 with valid semesterId', async () => {
    const mockResult = [{ conflict: 'example' }];
    (getAssignationsConflicts as jest.Mock).mockResolvedValue(mockResult);

    req.params = { semesterId: '123' };

    await AssignTeachersToLecturesController.getAssignationsConflicts(
      req as Request,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResult);
    expect(getAssignationsConflicts).toHaveBeenCalledWith(123);
  });

  it('should return 400 for invalid semesterId', async () => {
    req.params = { semesterId: 'invalid' };

    await AssignTeachersToLecturesController.getAssignationsConflicts(
      req as Request,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid semesterId' });
    expect(getAssignationsConflicts).not.toHaveBeenCalled();
  });

  it('should call returnError on unexpected error', async () => {
    const mockError = new Error('Unexpected error');
    (getAssignationsConflicts as jest.Mock).mockRejectedValue(mockError);

    req.params = { semesterId: '123' };

    await AssignTeachersToLecturesController.getAssignationsConflicts(
      req as Request,
      res as Response
    );

    expect(returnError).toHaveBeenCalledWith(res, mockError);
  });
});
