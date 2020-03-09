import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteProjectDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly projectId: string;
}