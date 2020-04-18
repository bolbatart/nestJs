import { LoginDto } from './login-user.dto';
export declare class RegisterDto extends LoginDto {
    readonly firstName: string;
    readonly lastName: string;
    readonly bio: string;
}
