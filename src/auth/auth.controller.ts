import { Controller, Post, Body} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/users/dto/register-user.dto';
import { LoginDto } from 'src/users/dto/login-user.dto';


@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ){}

    @Post('register')
    async register(@Body() registerDto: RegisterDto){
        const tokens = await this.authService.register(registerDto);
        return tokens; // ideti kur nors i headeri arba i cookies
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto){
        const tokens = await this.authService.login(loginDto)
        return tokens; // ideti kur nors i headeri arba i cookies
    }

    // RefreshTokens
}
