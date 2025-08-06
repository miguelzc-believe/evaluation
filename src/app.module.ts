import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersController } from './exercises/exercise3/users.controller';
import { UsersService } from './exercises/exercise2/users.service';
import { PostsService } from './exercises/exercise4/posts.service';
import { UserExistsPipe, PostExistsPipe } from './exercises/exercise5/validation.pipe';
import { PrismaKnownRequestExceptionFilter, PrismaValidationExceptionFilter, GlobalExceptionFilter } from './exercises/exercise6/exception.filter';
import { TransformInterceptor } from './exercises/exercise7/transform.interceptor';
import { AuthGuard } from './exercises/exercise8/auth.guard';
import { LoggerMiddleware } from './exercises/exercise9/logger.middleware';

@Module({
  imports: [PrismaModule],
  controllers: [AppController, UsersController],
  providers: [
    AppService,
    UsersService,
    PostsService,
    UserExistsPipe,
    PostExistsPipe,
    PrismaKnownRequestExceptionFilter,
    PrismaValidationExceptionFilter,
    GlobalExceptionFilter,
    TransformInterceptor,
    AuthGuard,
    LoggerMiddleware,
  ],
})
export class AppModule {}
