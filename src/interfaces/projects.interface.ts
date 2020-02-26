import { Document } from 'mongoose';

export interface IProject extends Document {
    name: string,
    location: string,
    professionalsNeeded: string,
    area: string,
    shortDescription: string,
    description: string,
    userId: string
}