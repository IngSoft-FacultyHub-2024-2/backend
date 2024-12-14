import { Request, Response } from 'express';
import benefitController from '../../src/controllers/benefitController';
import {
  addBenefit,
  deleteBenefit,
  getBenefits,
  updateBenefit,
} from '../../src/modules/teacher';
import { returnError } from '../../src/shared/utils/exceptions/handleExceptions';

jest.mock('../../src/modules/teacher');
jest.mock('../../src/shared/utils/exceptions/handleExceptions');

describe('BenefitController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getBenefits', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;
    beforeEach(() => {
      req = { query: {} };
      statusMock = jest.fn().mockReturnThis();
      jsonMock = jest.fn();
      res = { status: statusMock, json: jsonMock };
      jest.clearAllMocks(); // Limpia todos los mocks antes de cada prueba
    });

    it('should return a list of benefits', async () => {
      const mockBenefits = [{ id: 1, name: 'Health Insurance' }];
      // Asegúrate de que la función `getBenefits` sea un mock.
      (getBenefits as jest.Mock).mockResolvedValue(mockBenefits);

      await benefitController.getBenefits(req as Request, res as Response);

      // Verifica que la función mockeada `getBenefits` fue llamada.
      expect(getBenefits).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockBenefits);
    });

    it('should handle errors when fetching benefits fails', async () => {
      const error = new Error('Something went wrong');
      // Simula un error cuando se llama a `getBenefits`.
      (getBenefits as jest.Mock).mockRejectedValue(error);

      await benefitController.getBenefits(req as Request, res as Response);

      expect(getBenefits).toHaveBeenCalledTimes(1);
      expect(returnError).toHaveBeenCalledWith(res, error);
    });
  });

  describe('addBenefit', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
      req = { body: {} };
      statusMock = jest.fn().mockReturnThis();
      jsonMock = jest.fn();
      res = { status: statusMock, json: jsonMock };
      jest.clearAllMocks(); // Limpia todos los mocks antes de cada prueba
    });

    it('should add a benefit successfully', async () => {
      const mockBenefit = { id: 1, name: 'Health Insurance' };
      // Asegúrate de que la función `addBenefit` sea un mock.
      (addBenefit as jest.Mock).mockResolvedValue(mockBenefit);

      await benefitController.addBenefit(req as Request, res as Response);

      // Verifica que la función mockeada `addBenefit` fue llamada.
      expect(addBenefit).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockBenefit);
    });

    it('should handle errors when adding a benefit fails', async () => {
      const error = new Error('Something went wrong');
      // Simula un error cuando se llama a `addBenefit`.
      (addBenefit as jest.Mock).mockRejectedValue(error);

      await benefitController.addBenefit(req as Request, res as Response);

      expect(addBenefit).toHaveBeenCalledTimes(1);
      expect(returnError).toHaveBeenCalledWith(res, error);
    });
  });

  describe('updateBenefit', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
      req = { params: { id: '1' }, body: {} };
      statusMock = jest.fn().mockReturnThis();
      jsonMock = jest.fn();
      res = { status: statusMock, json: jsonMock };
      jest.clearAllMocks(); // Limpia todos los mocks antes de cada prueba
    });

    it('should update a benefit successfully', async () => {
      const mockBenefit = { id: 1, name: 'Health Insurance' };
      // Asegúrate de que la función `updateBenefit` sea un mock.
      (updateBenefit as jest.Mock).mockResolvedValue(mockBenefit);

      await benefitController.updateBenefit(req as Request, res as Response);

      // Verifica que la función mockeada `updateBenefit` fue llamada.
      expect(updateBenefit).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockBenefit);
    });

    it('should handle errors when updating a benefit fails', async () => {
      const error = new Error('Something went wrong');
      // Simula un error cuando se llama a `updateBenefit`.
      (updateBenefit as jest.Mock).mockRejectedValue(error);

      await benefitController.updateBenefit(req as Request, res as Response);

      expect(updateBenefit).toHaveBeenCalledTimes(1);
      expect(returnError).toHaveBeenCalledWith(res, error);
    });
  });

  describe('deleteBenefit', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let sendMock: jest.Mock;

    beforeEach(() => {
      req = { params: { id: '1' } };
      statusMock = jest.fn().mockReturnThis();
      sendMock = jest.fn();
      res = { status: statusMock, send: sendMock };
      jest.clearAllMocks(); // Limpia todos los mocks antes de cada prueba
    });

    it('should delete a benefit successfully', async () => {
      // Asegúrate de que la función `deleteBenefit` sea un mock.
      (deleteBenefit as jest.Mock).mockResolvedValue(undefined);

      await benefitController.deleteBenefit(req as Request, res as Response);

      // Verifica que la función mockeada `deleteBenefit` fue llamada.
      expect(deleteBenefit).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(204);
      expect(sendMock).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when deleting a benefit fails', async () => {
      const error = new Error('Something went wrong');
      // Simula un error cuando se llama a `deleteBenefit`.
      (deleteBenefit as jest.Mock).mockRejectedValue(error);

      await benefitController.deleteBenefit(req as Request, res as Response);

      expect(deleteBenefit).toHaveBeenCalledTimes(1);
      expect(returnError).toHaveBeenCalledWith(res, error);
    });
  });
});
