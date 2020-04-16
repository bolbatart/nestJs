import { ApiProperty } from '@nestjs/swagger';

export class EditUserDto {
    @ApiProperty()
    readonly userId: string;
    
    @ApiProperty()
    readonly firstName: string;

    @ApiProperty()
    readonly lastName: string;

    @ApiProperty()
    readonly bio: string;
}