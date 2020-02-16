import { Controller, Post, Body, Request, Get} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/users/dto/register-user.dto';
import { LoginDto } from 'src/users/dto/login-user.dto';
import { SetCookies, ClearCookies, Cookies } from '@nestjsplus/cookies';


@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ){}

    @SetCookies()
    @Post('register')
    async register(
            @Body() registerDto: RegisterDto, 
            @Request() req
        ){
        const tokens = await this.authService.register(registerDto);
        req._cookies = await this.authService.addCookies(tokens);
        return { message: 'Registered' };
    }

    @SetCookies()
    @Post('login')
    async login(
            @Body() loginDto: LoginDto, 
            @Request() req
        ){
        const tokens = await this.authService.login(loginDto)
        req._cookies = await this.authService.addCookies(tokens);
        return { message: 'Logged in' };
    }

    @ClearCookies('accessToken', 'refreshToken')
    @Get('logout')
    logout() {
        return { message: 'Logged out' }
    }

    @SetCookies()
    @Post('refresh')
    async refreshTokens(
        @Cookies() cookies,
        @Request() req
        ) {
        const payload = await this.authService.refreshTokens(cookies.refreshToken);
        const tokens = await this.authService.generateTokens({ userId: payload.userId });
        req._cookies = await this.authService.addCookies(tokens);
        return { message: 'Tokens have been updated' };
    }
}
