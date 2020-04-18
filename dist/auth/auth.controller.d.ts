import { AuthService } from './auth.service';
import { RegisterDto } from 'src/auth/dto/register-user.dto';
import { LoginDto } from 'src/auth/dto/login-user.dto';
import { Request, Response } from 'express';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto, res: Response): Promise<Response>;
    login(loginDto: LoginDto, res: Response): Promise<Response>;
    logout(res: Response): Response;
    refreshTokens(req: Request, res: Response): Promise<Response>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto, res: Response): Promise<Response>;
    resetPassword(key: string, resetPasswordDto: ResetPasswordDto, res: Response): Promise<Response>;
}
