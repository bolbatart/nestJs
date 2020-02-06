import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  addUser(
    @Body('email') usersEmail: string,
    @Body('firstName') usersFirstName: string,
    @Body('lastName') usersLastName: string,
    @Body('age') usersAge: number,
  ) {
    const insertedEmail = this.usersService.insertUser(usersEmail, usersFirstName, usersLastName, usersAge);
    return { email: insertedEmail };
  }

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':email')
  getUser(@Param('email') reqUsersEmail: string) {
    return this.usersService.getUser(reqUsersEmail);
  }

  @Delete()
  deleteUser(@Body('email') reqUsersEmail: string) {
    return this.usersService.deleteUser(reqUsersEmail);
  }
}
