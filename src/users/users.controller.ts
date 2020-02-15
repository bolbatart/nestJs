import { Controller, Post, Body, Get, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { DeleteUserDto } from './dto/delete-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';


@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) { }

  @Get('profile')
  @UseGuards(new AuthGuard)
  getProfile(@Request() req) {
    //get data from db by id;
    return this.usersService.getUser(req.user);
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
