import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty()
    readonly userId: string;
  }