import { Controller,  Body, Get, Delete, UseGuards, HttpStatus, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { DeleteUserDto } from './dto/delete-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserDto } from './dto/search-user.dto';


@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) { }

  @Get('profile')
  async getProfile(
    @Req() req: Request,
    @Res() res: Response,
    @Body() userId: UserDto
    ): Promise<Response> {
    const usersProfile = await this.usersService.getProfile(userId);
    return res.status(HttpStatus.OK).send(usersProfile);
  }
  
  
}
