import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
    @ApiProperty()
    @IsEmail()
    readonly email: string;

    @ApiProperty()
    @MinLength(4, { message: 'Password is to short' })
    readonly password: string;
  }