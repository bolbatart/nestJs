import { ApiProperty } from '@nestjs/swagger';

export class CommentProjectDto {
  @ApiProperty()
  comment: string;

}