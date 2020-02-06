import { Injectable, NotFoundException } from '@nestjs/common';
import { IUser } from './interfaces/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';


@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

    async insertUser(createUserDto: CreateUserDto): Promise<IUser> {
        const createdUser = new this.userModel(createUserDto);
        return createdUser.save();
    }

    async getAllUsers(): Promise<IUser[]> {
        return this.userModel.find().exec();
    }

    async getUser(reqEmail: string): Promise<IUser> {
        return this.userModel.find({ email: reqEmail }).exec();
    }

    async deleteUser (deleteUserDto: DeleteUserDto): Promise<IUser> {
        return this.userModel.findOneAndRemove({ email: deleteUserDto.email });
    }
}
