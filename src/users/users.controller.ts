import { Controller,  Body, Get, Delete, UseGuards, HttpStatus, Req, Res, Param, Post } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { DeleteUserDto } from './dto/delete-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserDto } from './dto/search-user.dto';
import { EditUserDto } from './dto/edit-user.dto';


@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) { }

  @Get('profile/:id')
  async getProfile(
    @Req() req: Request,
    @Res() res: Response,
    // @Body() userId: UserDto
    @Param('id') userId: string
    ): Promise<Response> {
    const usersProfile = await this.usersService.getProfile(userId);
    return res.status(HttpStatus.OK).send(usersProfile);
  }


  @Post('edit-profile')
  @UseGuards(new AuthGuard)
  async editProfile(
    @Req() req: Request,
    @Res() res: Response,
    @Body() editUser: EditUserDto
    ): Promise<Response> {
    return res.send(await this.usersService.editProfile(editUser));
  }

  
  
}
