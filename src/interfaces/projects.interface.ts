import { Document } from 'mongoose';

export interface IProject extends Document {
    name: string,
    location: string,
    professionalsNeeded: string,
    area: string,
    shortDescription: string,
    description: string,
    userId: string,
    comments?: [{userId: string, comment: string}],
    like?: string[],
    dislike?: string[]
}