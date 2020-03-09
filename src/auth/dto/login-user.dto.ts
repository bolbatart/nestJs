import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength, MaxLength, IsNotEmpty, Matches, IsString } from 'class-validator';

export class LoginDto {
    
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255, { message: 'Email is too long' })
  readonly email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8, { message: 'Password is to short' })
  @MaxLength(255, { message: 'Password is too long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, { message: 'password is to weak'}) // Minimum eight characters, at least one letter and one number
  readonly password: string;
}