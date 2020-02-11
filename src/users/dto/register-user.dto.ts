import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty()
    readonly email: string;

    @ApiProperty()
    readonly password: string;

    @ApiProperty()
    readonly firstName?: string;

    @ApiProperty()
    readonly lastName?: string;
    
    @ApiProperty()
    readonly age?: number;
  }