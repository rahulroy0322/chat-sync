import type { UserType } from '@/@types/user.types';
import { req } from './main';

const getAllUser = async () => {
  const { users } = await req<{
    users: UserType[];
  }>('/user');

  return users;
};

export { getAllUser };
