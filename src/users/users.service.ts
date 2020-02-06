import { Injectable, NotFoundException } from '@nestjs/common';
import { IUser } from './interfaces/users.interface';

@Injectable()
export class UsersService {
    private users: IUser[] = []; // "database"

    insertUser(email: string, firstName: string, lastName: string, age: number) {
        const newUser = <IUser> {
            email,
            firstName,
            lastName,
            age
        };
        this.users.push(newUser);
        return newUser.email;
    }

    getAllUsers () {
        return [...this.users];
    }

    getUser (reqUsersEmail: string) {
        const user = this.users.find( user => user.email === reqUsersEmail);
        if (!user) {
            throw new NotFoundException('Could not find user');
        }
        return { ...user };
    }

    deleteUser (reqUsersEmail: string) {
        const index = this.users.findIndex( user => user.email === reqUsersEmail);
        if (!this.users[index]) {
            throw new NotFoundException('Could not find user');
        }
        this.users.splice(index, 1);
        return { message: 'Deleted'}
    }
}
