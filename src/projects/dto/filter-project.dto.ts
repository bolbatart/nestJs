import { ApiProperty } from '@nestjs/swagger';

export class filterProjectDto {
  @ApiProperty()
  availablePositions: string[] | { $type: number} | { $in: any };

  @ApiProperty()
  area: string[] | { $type: number} | { $in: any };

  @ApiProperty()
  location: string | { $type: number};
}