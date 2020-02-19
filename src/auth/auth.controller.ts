import { Controller, Post, Body, Get, Res, HttpStatus, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/users/dto/register-user.dto';
import { LoginDto } from 'src/users/dto/login-user.dto';
import { Request, Response } from 'express';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res() res: Response
  ): Promise<Response> {
    try {
      await this.authService.register(registerDto, res);
      return res.status(200).send('registered...');
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res() res: Response
  ): Promise<Response> {
    try {
      res = await this.authService.login(loginDto, res);
      return res.status(HttpStatus.OK).send('logged in...');
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }

  @Get('logout')
  logout(@Res() res: Response): Response {
    try {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return res.status(HttpStatus.OK).send('Logged out');
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }

  @Post('refresh')
  async refreshTokens(
    @Req() req: Request,    
    @Res() res: Response
  ): Promise<Response> {
    try {
      await this.authService.refreshTokens(req.cookies.refreshToken, res);
      return res.status(HttpStatus.OK).send('Tokens have been updated');
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }

}
