import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../schemas/user.schema';
import { ProjectsModule } from 'src/projects/projects.module';
import { ProjectSchema } from 'src/schemas/project.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema},
      { name: 'Project', schema: ProjectSchema}
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
