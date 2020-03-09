import { ApiProperty } from '@nestjs/swagger';
import { LoginDto } from './login-user.dto';
import { IsString, MaxLength, IsNotEmpty } from 'class-validator'

export class RegisterDto extends LoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255, { message: 'First Name is too long' })
  readonly firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255, { message: 'Last Name is too long' })
  readonly lastName: string;
  
  @ApiProperty()
  @IsString()
  @MaxLength(255, { message: 'Biography is too long' })
  readonly bio: string;
}