import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserType } from '@/@types/user.types';

type UseUserType = {
  isLoading: boolean;
  user: UserType | null;
  token: string | null;
  refreshToken: string | null;
};

const useUser = create(
  persist<UseUserType>(
    () => ({
      user: null,
      isLoading: false,
      token: null,
      refreshToken: null,
    }),
    {
      name: 'auth',
      partialize: ({ refreshToken, user }) =>
        ({ refreshToken, user }) as UseUserType,
    }
  )
);

const { setState: set } = useUser;

const setLoading = (isLoading: UseUserType['isLoading']) =>
  set({
    isLoading,
  });

const setUser = (user: UserType) =>
  set({
    user,
  });

const setToken = (token: UseUserType['token']) =>
  set({
    token,
  });

const setRefreshToken = (refreshToken: UseUserType['refreshToken']) =>
  set({
    refreshToken,
  });

export { setUser, setToken, setRefreshToken, setLoading };

export default useUser;
