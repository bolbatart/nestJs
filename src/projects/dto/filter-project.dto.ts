import { ApiProperty } from '@nestjs/swagger';

export class filterProjectDto {
    @ApiProperty()
    availablePositions?: string[] | { $type: number};

    @ApiProperty()
    area?: string[] | { $type: number};

    @ApiProperty()
    location?: string | { $type: number};
  }