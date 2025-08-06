import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { TransformInterceptor } from './transform.interceptor';

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<any>;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(() => {
    interceptor = new TransformInterceptor();
  });

  const createMockContext = (url: string) => ({
    switchToHttp: () => ({
      getRequest: () => ({ url }),
    }),
  });

  const createMockCallHandler = (data: any) => ({
    handle: () => of(data),
  });

  describe('intercept', () => {
    it('should transform simple response', (done) => {
      const data = { id: 1, name: 'Test' };
      mockExecutionContext = createMockContext('/users') as ExecutionContext;
      mockCallHandler = createMockCallHandler(data) as CallHandler;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toEqual({
            success: true,
            data,
            timestamp: expect.any(String),
          });
          done();
        },
        error: done,
      });
    });

    it('should transform paginated response', (done) => {
      const data = {
        data: [{ id: 1, name: 'User 1' }],
        meta: { total: 1, limit: 10, offset: 0 },
      };
      mockExecutionContext = createMockContext('/users') as ExecutionContext;
      mockCallHandler = createMockCallHandler(data) as CallHandler;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toEqual({
            success: true,
            data: data.data,
            meta: data.meta,
            timestamp: expect.any(String),
          });
          done();
        },
        error: done,
      });
    });

    it('should transform delete response', (done) => {
      const data = { message: 'Usuario eliminado exitosamente' };
      mockExecutionContext = createMockContext('/users/1') as ExecutionContext;
      mockCallHandler = createMockCallHandler(data) as CallHandler;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toEqual({
            success: true,
            data: null,
            message: 'Usuario eliminado exitosamente',
            timestamp: expect.any(String),
          });
          done();
        },
        error: done,
      });
    });

    it('should preserve already formatted response', (done) => {
      const data = {
        success: false,
        message: 'Error occurred',
        data: null,
      };
      mockExecutionContext = createMockContext('/users') as ExecutionContext;
      mockCallHandler = createMockCallHandler(data) as CallHandler;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toEqual({
            success: false,
            message: 'Error occurred',
            data: null,
            timestamp: expect.any(String),
          });
          done();
        },
        error: done,
      });
    });

    it('should skip transformation for excluded routes', (done) => {
      const data = { status: 'ok' };
      mockExecutionContext = createMockContext('/health') as ExecutionContext;
      mockCallHandler = createMockCallHandler(data) as CallHandler;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toEqual(data);
          done();
        },
        error: done,
      });
    });

    it('should skip transformation for metrics route', (done) => {
      const data = { cpu: 50, memory: 80 };
      mockExecutionContext = createMockContext('/metrics') as ExecutionContext;
      mockCallHandler = createMockCallHandler(data) as CallHandler;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toEqual(data);
          done();
        },
        error: done,
      });
    });

    it('should skip transformation for docs route', (done) => {
      const data = { swagger: '2.0' };
      mockExecutionContext = createMockContext('/docs') as ExecutionContext;
      mockCallHandler = createMockCallHandler(data) as CallHandler;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toEqual(data);
          done();
        },
        error: done,
      });
    });

    it('should handle null response', (done) => {
      const data = null;
      mockExecutionContext = createMockContext('/users') as ExecutionContext;
      mockCallHandler = createMockCallHandler(data) as CallHandler;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toEqual({
            success: true,
            data: null,
            timestamp: expect.any(String),
          });
          done();
        },
        error: done,
      });
    });

    it('should handle string response', (done) => {
      const data = 'Hello World';
      mockExecutionContext = createMockContext('/users') as ExecutionContext;
      mockCallHandler = createMockCallHandler(data) as CallHandler;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toEqual({
            success: true,
            data: 'Hello World',
            timestamp: expect.any(String),
          });
          done();
        },
        error: done,
      });
    });
  });
}); 