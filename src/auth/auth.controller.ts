import { Controller, Post, Body, Get, Res, HttpStatus, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/auth/dto/register-user.dto';
import { LoginDto } from 'src/auth/dto/login-user.dto';
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
    return res.status(HttpStatus.OK).send(await this.authService.register(registerDto, res));
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res() res: Response
  ): Promise<Response> {
      return res.send(await this.authService.login(loginDto, res));
  }

  @Get('logout')
  logout(@Res() res: Response): Response {
      return res.send(this.authService.logout(res));
  }

  @Post('refresh')
  async refreshTokens(
    @Req() req: Request,    
    @Res() res: Response
  ): Promise<Response> {
      return res.send(await this.authService.refreshTokens(req.cookies.refreshToken, res));
  }

}
