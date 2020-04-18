import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { EditUserDto } from './dto/edit-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: Request, res: Response, userId: string): Promise<Response>;
    editProfile(req: Request, res: Response, editUser: EditUserDto): Promise<Response>;
}
