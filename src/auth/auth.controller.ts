import { Controller, Post, Body, Get, Res, HttpStatus, Req, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/auth/dto/register-user.dto';
import { LoginDto } from 'src/auth/dto/login-user.dto';
import { Request, Response } from 'express';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';


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

  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
    @Res() res: Response
  ): Promise<Response> {
      return res.send(await this.authService.forgotPassword(forgotPasswordDto));
  }

  @Post('reset/:key')
  async resetPassword(
    @Param('key') key: string,
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res() res: Response
  ): Promise<Response> {
      console.log(key)
      return res.send(await this.authService.resetPassword(resetPasswordDto, key));
  }

}
