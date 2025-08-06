import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard, IS_PUBLIC_KEY } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let reflector: Reflector;
  let mockExecutionContext: ExecutionContext;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new AuthGuard(reflector);
  });

  const createMockContext = (headers: any = {}, isPublic = false) => ({
    switchToHttp: () => ({
      getRequest: () => ({ headers }),
    }),
    getHandler: () => ({}),
    getClass: () => ({}),
  });

  describe('canActivate', () => {
    it('should allow access for public routes', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);
      mockExecutionContext = createMockContext() as ExecutionContext;

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        mockExecutionContext.getHandler(),
        mockExecutionContext.getClass(),
      ]);
    });

    it('should allow access with valid token', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      mockExecutionContext = createMockContext({
        authorization: 'Bearer valid-token',
      }) as ExecutionContext;

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should throw UnauthorizedException when no authorization header', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      mockExecutionContext = createMockContext({}) as ExecutionContext;

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        UnauthorizedException,
      );
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        'Token de autorización requerido',
      );
    });

    it('should throw UnauthorizedException with invalid token', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      mockExecutionContext = createMockContext({
        authorization: 'Bearer invalid-token',
      }) as ExecutionContext;

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        UnauthorizedException,
      );
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        'Token de autorización inválido',
      );
    });

    it('should throw UnauthorizedException with malformed authorization header', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      mockExecutionContext = createMockContext({
        authorization: 'InvalidFormat',
      }) as ExecutionContext;

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        UnauthorizedException,
      );
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        'Token de autorización inválido',
      );
    });

    it('should reject token without Bearer prefix', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      mockExecutionContext = createMockContext({
        authorization: 'valid-token',
      }) as ExecutionContext;

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        UnauthorizedException,
      );
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        'Token de autorización inválido',
      );
    });

    it('should handle empty authorization header', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      mockExecutionContext = createMockContext({
        authorization: '',
      }) as ExecutionContext;

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        UnauthorizedException,
      );
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        'Token de autorización requerido',
      );
    });

    it('should handle undefined authorization header', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      mockExecutionContext = createMockContext({
        authorization: undefined,
      }) as ExecutionContext;

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        UnauthorizedException,
      );
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        'Token de autorización requerido',
      );
    });
  });
}); 