import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  addUser(@Body() createUserDto: CreateUserDto) {
    const insertedEmail = this.usersService.insertUser(createUserDto.email, createUserDto.firstName, createUserDto.lastName, createUserDto.age);
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
  deleteUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.deleteUser(createUserDto.email);
  }
}
