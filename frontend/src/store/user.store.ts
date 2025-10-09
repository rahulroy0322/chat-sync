import { create } from 'zustand';
import type { UserType } from '@/@types/user.types';

const user = {
  _id: 'u-1',
  avatarUrl: '/profile.gif',
  uname: 'username',
} satisfies UserType;

type UseUserType = {
  isLoading: boolean;
  user: UserType | null;
};

const useUser = create<UseUserType>(() => ({
  user,
  isLoading: false,
}));

// const { getState: get, setState: set } = useUser;

export default useUser;
