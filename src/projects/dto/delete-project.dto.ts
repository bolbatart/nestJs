import { ApiProperty } from '@nestjs/swagger';

export class DeleteProjectDto {
    @ApiProperty()
    readonly projectId: string;
}