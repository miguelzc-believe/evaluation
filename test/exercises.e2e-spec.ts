import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { CreateUserDto } from '../src/exercises/exercise1/user.dto';

describe('Exercises E2E Tests', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    prismaService = app.get<PrismaService>(PrismaService);
    await app.init();
  });

  beforeEach(async () => {
    // Limpiar la base de datos antes de cada test
    await prismaService.user.deleteMany();
    await prismaService.post.deleteMany();
    await prismaService.tag.deleteMany();
    await prismaService.profile.deleteMany();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await app.close();
  });

  describe('/users (POST)', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'John Doe',
        age: 25,
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(createUserDto.email);
      expect(response.body.name).toBe(createUserDto.name);
      expect(response.body.age).toBe(createUserDto.age);
    });

    it('should fail with invalid email', async () => {
      const createUserDto = {
        email: 'invalid-email',
        name: 'John Doe',
        age: 25,
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(400);
    });

    it('should fail with short name', async () => {
      const createUserDto = {
        email: 'test@example.com',
        name: 'A',
        age: 25,
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(400);
    });

    it('should fail with invalid age', async () => {
      const createUserDto = {
        email: 'test@example.com',
        name: 'John Doe',
        age: 15,
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(400);
    });

    it('should fail with duplicate email', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'John Doe',
        age: 25,
      };

      // Crear primer usuario
      await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      // Intentar crear segundo usuario con el mismo email
      await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(409);
    });
  });

  describe('/users (GET)', () => {
    beforeEach(async () => {
      // Crear usuarios de prueba
      const users = [
        { email: 'user1@example.com', name: 'User 1', age: 25 },
        { email: 'user2@example.com', name: 'User 2', age: 30 },
        { email: 'user3@example.com', name: 'User 3', age: 35 },
      ];

      for (const user of users) {
        await prismaService.user.create({ data: user });
      }
    });

    it('should return all users with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(response.body.data).toHaveLength(3);
      expect(response.body.meta.total).toBe(3);
    });

    it('should return paginated users with limit', async () => {
      const response = await request(app.getHttpServer())
        .get('/users?limit=2')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.meta.limit).toBe(2);
      expect(response.body.meta.hasMore).toBe(true);
    });

    it('should return paginated users with offset', async () => {
      const response = await request(app.getHttpServer())
        .get('/users?limit=1&offset=1')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.meta.offset).toBe(1);
    });
  });

  describe('/users/:id (GET)', () => {
    let userId: number;

    beforeEach(async () => {
      const user = await prismaService.user.create({
        data: {
          email: 'test@example.com',
          name: 'John Doe',
          age: 25,
        },
      });
      userId = user.id;
    });

    it('should return a user by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200);

      expect(response.body.id).toBe(userId);
      expect(response.body.email).toBe('test@example.com');
      expect(response.body.name).toBe('John Doe');
    });

    it('should return 404 for non-existent user', async () => {
      await request(app.getHttpServer()).get('/users/999').expect(404);
    });

    it('should return 400 for invalid id', async () => {
      await request(app.getHttpServer()).get('/users/invalid').expect(400);
    });
  });

  describe('/users/:id (PATCH)', () => {
    let userId: number;

    beforeEach(async () => {
      const user = await prismaService.user.create({
        data: {
          email: 'test@example.com',
          name: 'John Doe',
          age: 25,
        },
      });
      userId = user.id;
    });

    it('should update a user successfully', async () => {
      const updateData = {
        name: 'Updated Name',
        age: 30,
      };

      const response = await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
      expect(response.body.age).toBe(updateData.age);
      expect(response.body.email).toBe('test@example.com'); // Should remain unchanged
    });

    it('should return 404 for non-existent user', async () => {
      const updateData = { name: 'Updated Name' };

      await request(app.getHttpServer())
        .patch('/users/999')
        .send(updateData)
        .expect(404);
    });

    it('should fail with invalid email', async () => {
      const updateData = { email: 'invalid-email' };

      await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send(updateData)
        .expect(400);
    });
  });

  describe('/users/:id (DELETE)', () => {
    let userId: number;

    beforeEach(async () => {
      const user = await prismaService.user.create({
        data: {
          email: 'test@example.com',
          name: 'John Doe',
          age: 25,
        },
      });
      userId = user.id;
    });

    it('should delete a user successfully', async () => {
      await request(app.getHttpServer()).delete(`/users/${userId}`).expect(204);

      // Verify user is deleted
      await request(app.getHttpServer()).get(`/users/${userId}`).expect(404);
    });

    it('should return 404 for non-existent user', async () => {
      await request(app.getHttpServer()).delete('/users/999').expect(404);
    });
  });

  describe('Validation and Error Handling', () => {
    it('should handle missing required fields', async () => {
      const invalidUser = {
        name: 'John Doe',
        // email is missing
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(invalidUser)
        .expect(400);
    });

    it('should handle extra fields', async () => {
      const userWithExtraFields = {
        email: 'test@example.com',
        name: 'John Doe',
        age: 25,
        extraField: 'should not be allowed',
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(userWithExtraFields)
        .expect(400);
    });

    it('should handle malformed JSON', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);
    });
  });
});
