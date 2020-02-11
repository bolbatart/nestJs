import { Controller, Post, Body, Get, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { DeleteUserDto } from './dto/delete-user.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) { }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  
  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Delete()
  deleteUser(@Body() deleteUserDto: DeleteUserDto) {
    return this.usersService.deleteUser(deleteUserDto);
  }
}
