import { Logger } from '@nestjs/common';
import { LoggerMiddleware, loggerMiddleware } from './logger.middleware';
import { Request, Response } from 'express';

describe('LoggerMiddleware', () => {
  let middleware: LoggerMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;
  let loggerSpy: jest.SpyInstance;

  beforeEach(() => {
    middleware = new LoggerMiddleware();
    mockNext = jest.fn();
    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();

    mockRequest = {
      method: 'GET',
      originalUrl: '/users',
      ip: '127.0.0.1',
      get: jest.fn().mockReturnValue('Mozilla/5.0'),
    };

    mockResponse = {
      statusCode: 200,
      end: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('LoggerMiddleware class', () => {
    it('should log request start and call next', () => {
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(loggerSpy).toHaveBeenCalledWith(
        'GET /users - 127.0.0.1 - Mozilla/5.0 - Request started',
      );
      expect(mockNext).toHaveBeenCalled();
    });

    it('should log response when res.end is called', () => {
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Simulate response end
      (mockResponse.end as jest.Mock)();

      expect(loggerSpy).toHaveBeenCalledTimes(2);
      expect(loggerSpy).toHaveBeenNthCalledWith(1,
        'GET /users - 127.0.0.1 - Mozilla/5.0 - Request started',
      );
      expect(loggerSpy).toHaveBeenNthCalledWith(2,
        expect.stringMatching(/GET \/users - 200 - \d+ms - Request completed/),
      );
    });

    it('should handle missing User-Agent header', () => {
      mockRequest.get = jest.fn().mockReturnValue(undefined);

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(loggerSpy).toHaveBeenCalledWith(
        'GET /users - 127.0.0.1 -  - Request started',
      );
    });

    it('should handle different HTTP methods', () => {
      mockRequest.method = 'POST';

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(loggerSpy).toHaveBeenCalledWith(
        'POST /users - 127.0.0.1 - Mozilla/5.0 - Request started',
      );
    });

    it('should handle different status codes', () => {
      mockResponse.statusCode = 404;

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      (mockResponse.end as jest.Mock)();

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringMatching(/GET \/users - 404 - \d+ms - Request completed/),
      );
    });
  });

  describe('loggerMiddleware function', () => {
    it('should log request start and call next', () => {
      loggerMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(loggerSpy).toHaveBeenCalledWith(
        'GET /users - 127.0.0.1 - Mozilla/5.0 - Request started',
      );
      expect(mockNext).toHaveBeenCalled();
    });

    it('should log response when res.end is called', () => {
      loggerMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Simulate response end
      (mockResponse.end as jest.Mock)();

      expect(loggerSpy).toHaveBeenCalledTimes(2);
      expect(loggerSpy).toHaveBeenNthCalledWith(1,
        'GET /users - 127.0.0.1 - Mozilla/5.0 - Request started',
      );
      expect(loggerSpy).toHaveBeenNthCalledWith(2,
        expect.stringMatching(/GET \/users - 200 - \d+ms - Request completed/),
      );
    });

    it('should handle missing User-Agent header', () => {
      mockRequest.get = jest.fn().mockReturnValue(undefined);

      loggerMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(loggerSpy).toHaveBeenCalledWith(
        'GET /users - 127.0.0.1 -  - Request started',
      );
    });
  });

  describe('Response timing', () => {
    it('should calculate correct duration', (done) => {
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Simulate some processing time
      setTimeout(() => {
        (mockResponse.end as jest.Mock)();

        expect(loggerSpy).toHaveBeenCalledWith(
          expect.stringMatching(/GET \/users - 200 - \d+ms - Request completed/),
        );

        const lastCall = loggerSpy.mock.calls[1][0];
        const durationMatch = lastCall.match(/(\d+)ms/);
        const duration = parseInt(durationMatch[1]);

        expect(duration).toBeGreaterThanOrEqual(5); // Should be at least 5ms due to setTimeout
        done();
      }, 10);
    }, 10000); // Increase timeout to 10 seconds
  });
}); 