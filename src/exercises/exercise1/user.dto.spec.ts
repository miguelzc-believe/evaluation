import { validate } from 'class-validator';
import { CreateUserDto, UpdateUserDto } from './user.dto';

describe('User DTOs', () => {
  describe('CreateUserDto', () => {
    it('should pass validation with valid data', async () => {
      const dto = new CreateUserDto();
      dto.email = 'test@example.com';
      dto.name = 'John Doe';
      dto.age = 25;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid email', async () => {
      const dto = new CreateUserDto();
      dto.email = 'invalid-email';
      dto.name = 'John Doe';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isEmail).toBeDefined();
    });

    it('should fail validation with short name', async () => {
      const dto = new CreateUserDto();
      dto.email = 'test@example.com';
      dto.name = 'A';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.minLength).toBeDefined();
    });

    it('should fail validation with invalid age', async () => {
      const dto = new CreateUserDto();
      dto.email = 'test@example.com';
      dto.name = 'John Doe';
      dto.age = 15;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.min).toBeDefined();
    });

    it('should pass validation without age (optional field)', async () => {
      const dto = new CreateUserDto();
      dto.email = 'test@example.com';
      dto.name = 'John Doe';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('UpdateUserDto', () => {
    it('should pass validation with partial data', async () => {
      const dto = new UpdateUserDto();
      dto.email = 'updated@example.com';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with empty object', async () => {
      const dto = new UpdateUserDto();

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid email', async () => {
      const dto = new UpdateUserDto();
      dto.email = 'invalid-email';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isEmail).toBeDefined();
    });

    it('should fail validation with short name', async () => {
      const dto = new UpdateUserDto();
      dto.name = 'A';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.minLength).toBeDefined();
    });
  });
}); 