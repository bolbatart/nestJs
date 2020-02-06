import { ApiProperty } from '@nestjs/swagger';

export interface IUser {
  email: string,

  firstName: string,

  lastName: string,

  age: number
}