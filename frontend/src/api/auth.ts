import type { UserType } from '@/@types/user.types';
import useUser, {
  setRefreshToken,
  setToken,
  setUser,
} from '@/store/user.store';
import { reqImpl } from './main';

const refreshToken = async (signal?: AbortSignal) => {
  const refreshToken = useUser.getState().refreshToken;

  if (refreshToken) {
    const data = await reqImpl<{
      user: UserType;
      token: {
        access: string;
        refresh: string;
      };
    }>('auth/refresh', {
      headers: {
        token: `Bearer ${refreshToken}`,
      },
      signal,
    });

    if (signal?.aborted) {
      return;
    }
    if (!data.success) {
      throw data.error;
    }

    setUser(data.data.user);
    setToken(data.data.token.access);
    setRefreshToken(data.data.token.refresh);
  }
};

export { refreshToken };
