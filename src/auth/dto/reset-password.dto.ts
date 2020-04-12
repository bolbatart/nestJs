import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class ResetPasswordDto {
    
  @ApiProperty()
  @IsString()
  @MinLength(8, { message: 'Password is to short' })
  @MaxLength(255, { message: 'Password is too long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, { message: 'password is to weak'}) // Minimum eight characters, at least one letter and one number
  readonly password: string;

}