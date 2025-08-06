import { ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { PrismaKnownRequestExceptionFilter, PrismaValidationExceptionFilter, GlobalExceptionFilter } from './exception.filter';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';

describe('Exception Filters', () => {
  let mockResponse: Partial<Response>;
  let mockArgumentsHost: ArgumentsHost;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
    } as any;
  });

  describe('PrismaKnownRequestExceptionFilter', () => {
    let filter: PrismaKnownRequestExceptionFilter;

    beforeEach(() => {
      filter = new PrismaKnownRequestExceptionFilter();
    });

    it('should handle P2002 error (unique constraint)', () => {
      const exception = new PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '1.0.0',
        meta: { target: ['email'] },
      });

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'El registro ya existe',
        error: {
          code: 'P2002',
          meta: { target: ['email'] },
        },
        timestamp: expect.any(String),
      });
    });

    it('should handle P2025 error (record not found)', () => {
      const exception = new PrismaClientKnownRequestError('Record not found', {
        code: 'P2025',
        clientVersion: '1.0.0',
      });

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Registro no encontrado',
        error: {
          code: 'P2025',
          meta: undefined,
        },
        timestamp: expect.any(String),
      });
    });

    it('should handle P2003 error (foreign key constraint)', () => {
      const exception = new PrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
        clientVersion: '1.0.0',
      });

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error de referencia externa',
        error: {
          code: 'P2003',
          meta: undefined,
        },
        timestamp: expect.any(String),
      });
    });

    it('should handle unknown error code', () => {
      const exception = new PrismaClientKnownRequestError('Unknown error', {
        code: 'P9999',
        clientVersion: '1.0.0',
      });

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error en la base de datos',
        error: {
          code: 'P9999',
          meta: undefined,
        },
        timestamp: expect.any(String),
      });
    });
  });

  describe('PrismaValidationExceptionFilter', () => {
    let filter: PrismaValidationExceptionFilter;

    beforeEach(() => {
      filter = new PrismaValidationExceptionFilter();
    });

    it('should handle validation error', () => {
      const exception = new PrismaClientValidationError('Invalid value provided', {
        clientVersion: '1.0.0',
      });

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error de validación en la base de datos',
        error: {
          message: 'Invalid value provided',
        },
        timestamp: expect.any(String),
      });
    });
  });

  describe('GlobalExceptionFilter', () => {
    let filter: GlobalExceptionFilter;

    beforeEach(() => {
      filter = new GlobalExceptionFilter();
    });

    it('should handle generic error', () => {
      const exception = new Error('Something went wrong');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error interno del servidor',
        error: {
          message: 'Something went wrong',
        },
        timestamp: expect.any(String),
      });
    });
  });
}); 