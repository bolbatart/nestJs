import { LoginDto } from 'src/auth/dto/login-user.dto';
import { Model } from 'mongoose';
import { IUser } from '../interfaces/users.interface';
import { RegisterDto } from 'src/auth/dto/register-user.dto';
import { Response } from 'express';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthService {
    private readonly userModel;
    constructor(userModel: Model<IUser>);
    register(registerDto: RegisterDto, res: Response): Promise<RegisterDto>;
    login(loginDto: LoginDto, res: Response): Promise<LoginDto>;
    refreshTokens(oldRefreshToken: string, res: Response): Promise<{
        message: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto, key: any): Promise<{
        message: string;
    }>;
    sendLinkToEmail(key: string, email: string): void;
    logout(res: Response): {
        message: string;
    };
    hashPassword(pass: string): string;
    createJwtCookies(payload: {}, res: Response): void;
}
