import { IUser } from '../interfaces/users.interface';
import { Model } from 'mongoose';
import { IProject } from 'src/interfaces/projects.interface';
import { EditUserDto } from './dto/edit-user.dto';
export declare class UsersService {
    private readonly userModel;
    private readonly projectModel;
    constructor(userModel: Model<IUser>, projectModel: Model<IProject>);
    getProfile(userId: string): Promise<{
        user: IUser;
        projects: IProject;
    }>;
    editProfile(editUser: EditUserDto): Promise<{
        user: IUser;
    }>;
}
