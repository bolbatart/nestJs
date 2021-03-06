import * as mongoose from 'mongoose';

export const ProjectSchema = new mongoose.Schema({
  name: String,
  location: String,
  professionalsNeeded: [String],
  area: [String],
  shortDescription: String,
  description: String,
  userId: String,
  comments: [{userId: String, comment: String}],
  like: [String],
  dislike: [String]
});