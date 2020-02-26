import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { IUser } from '../interfaces/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeleteUserDto } from '../auth/dto/delete-user.dto';



@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

    async getAllUsers(): Promise<IUser[]> {
        return this.userModel.find().exec();
    }

    async getUser(user: {userId: string}): Promise<IUser> {
        return this.userModel.find({ _id: user.userId}).exec();
    }

    async deleteUser (deleteUserDto: DeleteUserDto): Promise<IUser> {
        return this.userModel.findOneAndRemove({ email: deleteUserDto.email });
    }

    async findOne(email: string): Promise<IUser | undefined> {
        return this.userModel.findOne(user => user.email === email);
      }
}
