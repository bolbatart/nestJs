import { ApiProperty } from '@nestjs/swagger';

export class ProjectDto {
    @ApiProperty()
    readonly name: string;

    @ApiProperty()
    readonly location?: string;

    @ApiProperty()
    readonly professionalsNeeded?: string[];

    @ApiProperty()
    readonly area?: string[];
    
    @ApiProperty()
    readonly shortDescription?: string;

    @ApiProperty()
    readonly description?: string;

    userId?: string;
  }