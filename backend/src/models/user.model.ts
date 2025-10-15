import { model, Schema } from 'mongoose';
import type { UserModelType } from '../@types/user.types';
import { models } from './main';

const UserSchema = new Schema<UserModelType>(
  {
    uname: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      select: false,
    },
    avatarUrl: {
      type: String,
      default: '/profile.gif',
    },
  },
  {
    timestamps: true,
  }
);

const User = model<UserModelType>(models.user, UserSchema);

export default User;
