import { ApiProperty } from '@nestjs/swagger';

export class EditProjectDto {
    @ApiProperty()
    readonly projectId: string;
    
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
  }