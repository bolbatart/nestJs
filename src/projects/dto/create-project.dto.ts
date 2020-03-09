import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ProjectDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly location?: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly professionalsNeeded?: string[];

    @ApiProperty()
    @IsNotEmpty()
    readonly area?: string[];
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly shortDescription?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly description?: string;

    userId?: string;
  }