import { ApiProperty } from '@nestjs/swagger';
import { LoginDto } from './login-user.dto';

export class RegisterDto extends LoginDto {
    @ApiProperty()
    readonly firstName?: string;

    @ApiProperty()
    readonly lastName?: string;
    
    @ApiProperty()
    readonly age?: number;
  }