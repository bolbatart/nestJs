import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserDto {
    @ApiProperty()
    readonly email: string;
}