import { Test, TestingModule } from '@nestjs/testing';
import { UserExistsPipe, PostExistsPipe } from './validation.pipe';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('Validation Pipes', () => {
  let userExistsPipe: UserExistsPipe;
  let postExistsPipe: PostExistsPipe;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    post: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserExistsPipe,
        PostExistsPipe,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    userExistsPipe = module.get<UserExistsPipe>(UserExistsPipe);
    postExistsPipe = module.get<PostExistsPipe>(PostExistsPipe);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('UserExistsPipe', () => {
    it('should transform valid user id', async () => {
      const userId = 1;
      const mockUser = { id: userId, name: 'John Doe', email: 'john@example.com' };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await userExistsPipe.transform(userId.toString(), {} as any);

      expect(result).toBe(userId);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should throw BadRequestException when value is empty', async () => {
      await expect(userExistsPipe.transform('', {} as any)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.user.findUnique).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when value is not a number', async () => {
      await expect(userExistsPipe.transform('invalid', {} as any)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.user.findUnique).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const userId = 999;
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(userExistsPipe.transform(userId.toString(), {} as any)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should handle null value', async () => {
      await expect(userExistsPipe.transform(null, {} as any)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.user.findUnique).not.toHaveBeenCalled();
    });
  });

  describe('PostExistsPipe', () => {
    it('should transform valid post id', async () => {
      const postId = 1;
      const mockPost = { id: postId, title: 'Test Post', content: 'Test content' };

      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);

      const result = await postExistsPipe.transform(postId.toString(), {} as any);

      expect(result).toBe(postId);
      expect(mockPrismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: postId },
      });
    });

    it('should throw BadRequestException when value is empty', async () => {
      await expect(postExistsPipe.transform('', {} as any)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.post.findUnique).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when value is not a number', async () => {
      await expect(postExistsPipe.transform('invalid', {} as any)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.post.findUnique).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when post does not exist', async () => {
      const postId = 999;
      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(postExistsPipe.transform(postId.toString(), {} as any)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: postId },
      });
    });

    it('should handle null value', async () => {
      await expect(postExistsPipe.transform(null, {} as any)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.post.findUnique).not.toHaveBeenCalled();
    });
  });
}); 