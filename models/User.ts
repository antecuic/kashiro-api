import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../interfaces';

const UserSchema = new Schema<IUser.UserProperties>({
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  surname: {
    type: String,
    required: [true, 'Surname is required'],
  },
  username: {
    type: String,
    unique: true,
    required: [true, 'Username is required'],
    min: [3, 'Username must contain at least 3 characters.'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    min: [6, 'Password must contain at least 6 characters.'],
  },
  balance: {
    type: Number,
  },
});

UserSchema.pre<IUser.UserProperties>('save', async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

UserSchema.methods.isValidPassword = async function (
  password
): Promise<boolean> {
  const isValid: boolean = await bcrypt.compare(password, this.password);
  return isValid;
};

export default mongoose.model('User', UserSchema);
