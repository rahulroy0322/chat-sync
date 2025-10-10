import type { ModelType } from './model.types';

type UserType = {
  _id: string;
  uname: string;
  email: string;
  password: string;
  avatarUrl: string;
};

type UserModelType = ModelType<UserType>;

export type { UserType, UserModelType };
