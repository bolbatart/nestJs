import { ApiProperty } from '@nestjs/swagger';

export class filterProjectDto {
    @ApiProperty()
    readonly availablePositions?: string;

    @ApiProperty()
    readonly area?: string[];

    @ApiProperty()
    readonly location?: string;
  }