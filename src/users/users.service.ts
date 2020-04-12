import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { IUser } from '../interfaces/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IProject } from 'src/interfaces/projects.interface';


@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<IUser>,
        @InjectModel('Project') private readonly projectModel: Model<IProject>
    ) {}

    async getProfile(userId: string): Promise<{user: IUser, projects: IProject}> {
        try {
            const user = await this.userModel.findOne({ _id: userId});
            const projects: IProject = await this.projectModel.find({ userId: userId }); 
            const {password, keyExpires, resetPasswordKey, ...userToReturn}: IUser = user.toObject()
            return {user: userToReturn, projects};
        } catch (err) {
            const message = 'Server error: ' + (err.message || err.name);
            throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
          }
    }
    
}
