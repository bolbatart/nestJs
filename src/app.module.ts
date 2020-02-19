import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProjectsController } from './projects/projects.controller';
import { ProjectsModule } from './projects/projects.module';
import { UsersController } from './users/users.controller';


@Module({
  imports: [
    UsersModule, 
    MongooseModule.forRoot('mongodb://localhost:27017/nest'), 
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, }),
    ProjectsModule
  ],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
