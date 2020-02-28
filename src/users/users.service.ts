import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { IUser } from '../interfaces/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeleteUserDto } from './dto/delete-user.dto';
import { IProject } from 'src/interfaces/projects.interface';



@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<IUser>,
        @InjectModel('Project') private readonly projectModel: Model<IProject>
    ) {}

    async getProfile(usr: {userId: string}): Promise<{user: IUser, projects: IProject}> {
        try {
            const { password, ...user }: IUser = await this.userModel.find({ _id: usr.userId});
            const projects: IProject = await this.projectModel.find({ userId: usr.userId }); 
            return { user, projects }
        } catch (err) {
            const message = 'Server error: ' + (err.message || err.name);
            throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
          }
    }
    
}
