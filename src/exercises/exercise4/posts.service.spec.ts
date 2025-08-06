import { Test, TestingModule } from '@nestjs/testing';
import { PostsService, CreatePostDto, UpdatePostDto } from './posts.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('PostsService', () => {
  let service: PostsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    post: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a post successfully', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Test Post',
        content: 'Test content',
        authorId: 1,
        tagIds: [1, 2],
      };

      const expectedPost = {
        id: 1,
        ...createPostDto,
        published: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: { id: 1, name: 'John Doe', email: 'john@example.com' },
        tags: [{ id: 1, name: 'Tag 1' }, { id: 2, name: 'Tag 2' }],
      };

      mockPrismaService.post.create.mockResolvedValue(expectedPost);

      const result = await service.create(createPostDto);

      expect(result).toEqual(expectedPost);
      expect(mockPrismaService.post.create).toHaveBeenCalledWith({
        data: {
          title: 'Test Post',
          content: 'Test content',
          authorId: 1,
          tags: {
            connect: [{ id: 1 }, { id: 2 }],
          },
        },
        include: {
          author: true,
          tags: true,
        },
      });
    });

    it('should create a post without tags', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Test Post',
        content: 'Test content',
        authorId: 1,
      };

      const expectedPost = {
        id: 1,
        ...createPostDto,
        published: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: { id: 1, name: 'John Doe', email: 'john@example.com' },
        tags: [],
      };

      mockPrismaService.post.create.mockResolvedValue(expectedPost);

      await service.create(createPostDto);

      expect(mockPrismaService.post.create).toHaveBeenCalledWith({
        data: {
          title: 'Test Post',
          content: 'Test content',
          authorId: 1,
          tags: undefined,
        },
        include: {
          author: true,
          tags: true,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated posts', async () => {
      const mockPosts = [
        {
          id: 1,
          title: 'Post 1',
          author: { id: 1, name: 'John', email: 'john@example.com' },
          tags: [],
        },
        {
          id: 2,
          title: 'Post 2',
          author: { id: 2, name: 'Jane', email: 'jane@example.com' },
          tags: [],
        },
      ];

      mockPrismaService.post.findMany.mockResolvedValue(mockPosts);
      mockPrismaService.post.count.mockResolvedValue(10);

      const result = await service.findAll(2, 0);

      expect(result).toEqual({
        data: mockPosts,
        meta: {
          total: 10,
          limit: 2,
          offset: 0,
          hasMore: true,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a post by id', async () => {
      const expectedPost = {
        id: 1,
        title: 'Test Post',
        author: { id: 1, name: 'John', email: 'john@example.com' },
        tags: [],
      };

      mockPrismaService.post.findUnique.mockResolvedValue(expectedPost);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedPost);
      expect(mockPrismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          tags: true,
        },
      });
    });

    it('should throw NotFoundException when post not found', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByAuthor', () => {
    it('should return posts by author', async () => {
      const mockPosts = [
        {
          id: 1,
          title: 'Post 1',
          author: { id: 1, name: 'John', email: 'john@example.com' },
          tags: [],
        },
      ];

      mockPrismaService.post.findMany.mockResolvedValue(mockPosts);
      mockPrismaService.post.count.mockResolvedValue(1);

      const result = await service.findByAuthor(1, 10, 0);

      expect(result).toEqual({
        data: mockPosts,
        meta: {
          total: 1,
          limit: 10,
          offset: 0,
          hasMore: false,
        },
      });

      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith({
        where: { authorId: 1 },
        take: 10,
        skip: 0,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          tags: true,
        },
      });
    });
  });

  describe('findWithTags', () => {
    it('should return all posts with tags', async () => {
      const mockPosts = [
        {
          id: 1,
          title: 'Post 1',
          author: { id: 1, name: 'John', email: 'john@example.com' },
          tags: [{ id: 1, name: 'Tag 1' }],
        },
      ];

      mockPrismaService.post.findMany.mockResolvedValue(mockPosts);

      const result = await service.findWithTags();

      expect(result).toEqual(mockPosts);
      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith({
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          tags: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('update', () => {
    it('should update a post successfully', async () => {
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Post',
        tagIds: [1, 2],
      };

      const expectedPost = {
        id: 1,
        title: 'Updated Post',
        author: { id: 1, name: 'John', email: 'john@example.com' },
        tags: [{ id: 1, name: 'Tag 1' }, { id: 2, name: 'Tag 2' }],
      };

      mockPrismaService.post.update.mockResolvedValue(expectedPost);

      const result = await service.update(1, updatePostDto);

      expect(result).toEqual(expectedPost);
      expect(mockPrismaService.post.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          title: 'Updated Post',
          tags: {
            set: [{ id: 1 }, { id: 2 }],
          },
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          tags: true,
        },
      });
    });

    it('should throw NotFoundException when post not found', async () => {
      const updatePostDto: UpdatePostDto = { title: 'Updated Post' };

      const prismaError = new Prisma.PrismaClientKnownRequestError('', {
        code: 'P2025',
        clientVersion: '1.0.0',
      });

      mockPrismaService.post.update.mockRejectedValue(prismaError);

      await expect(service.update(999, updatePostDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a post successfully', async () => {
      mockPrismaService.post.delete.mockResolvedValue({ id: 1 });

      const result = await service.remove(1);

      expect(result).toEqual({ message: 'Post eliminado exitosamente' });
      expect(mockPrismaService.post.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException when post not found', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError('', {
        code: 'P2025',
        clientVersion: '1.0.0',
      });

      mockPrismaService.post.delete.mockRejectedValue(prismaError);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
}); 