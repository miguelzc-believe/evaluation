import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../exercise2/users.service';
import { CreateUserDto, UpdateUserDto } from '../exercise1/user.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'John Doe',
        age: 25,
      };

      const expectedUser = {
        id: 1,
        ...createUserDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.create.mockResolvedValue(expectedUser);

      const result = await controller.create(createUserDto);

      expect(result).toEqual(expectedUser);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const mockResponse = {
        data: [
          { id: 1, email: 'user1@example.com', name: 'User 1' },
          { id: 2, email: 'user2@example.com', name: 'User 2' },
        ],
        meta: {
          total: 10,
          limit: 2,
          offset: 0,
          hasMore: true,
        },
      };

      mockUsersService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll('2', '0');

      expect(result).toEqual(mockResponse);
      expect(service.findAll).toHaveBeenCalledWith(2, 0);
    });

    it('should handle undefined query parameters', async () => {
      const mockResponse = {
        data: [{ id: 1, email: 'user1@example.com', name: 'User 1' }],
        meta: { total: 1, limit: 10, offset: 0, hasMore: false },
      };

      mockUsersService.findAll.mockResolvedValue(mockResponse);

      await controller.findAll();

      expect(service.findAll).toHaveBeenCalledWith(undefined, undefined);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const expectedUser = {
        id: 1,
        email: 'test@example.com',
        name: 'John Doe',
      };

      mockUsersService.findOne.mockResolvedValue(expectedUser);

      const result = await controller.findOne(1);

      expect(result).toEqual(expectedUser);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUsersService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };

      const expectedUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Updated Name',
      };

      mockUsersService.update.mockResolvedValue(expectedUser);

      const result = await controller.update(1, updateUserDto);

      expect(result).toEqual(expectedUser);
      expect(service.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const expectedResponse = { message: 'Usuario eliminado exitosamente' };

      mockUsersService.remove.mockResolvedValue(expectedResponse);

      const result = await controller.remove(1);

      expect(result).toEqual(expectedResponse);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
}); 