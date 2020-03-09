import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    unique: true, 
    required: true,
    maxlength: 255 
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 255
  },
  firstName: {
    type: String,
    maxlength: 255
  },
  lastName: {
    type: String,
    maxlength: 255
  },
  bio: {
    type: String,
    maxlength: 255
  }
});