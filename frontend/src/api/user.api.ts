import type { UserType } from '@/@types/user.types';

const getAllUser = async () => {
  return await Promise.resolve([
    {
      _id: '1',
      avatarUrl: '/profile.gif',
      uname: 'user2',
    },
    {
      _id: '2',
      avatarUrl: '/profile.gif',
      uname: 'user3',
    },
  ] satisfies UserType[]);
};

export { getAllUser };
