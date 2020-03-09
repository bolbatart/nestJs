import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';


export class EditProjectDto {
    @ApiProperty()
    @IsString()
    readonly projectId: string;
    
    @ApiProperty()
    @IsString()
    readonly name: string;

    @ApiProperty()
    @IsString()
    readonly location?: string;

    @ApiProperty()
    readonly professionalsNeeded?: string[];

    @ApiProperty()
    readonly area?: string[];
    
    @ApiProperty()
    @IsString()
    readonly shortDescription?: string;

    @ApiProperty()
    @IsString()
    readonly description?: string;
  }