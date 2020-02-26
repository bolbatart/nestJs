import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
  age: { type: Number, validate: {
      validator: age => age > 0 && age < 100
    } },
});