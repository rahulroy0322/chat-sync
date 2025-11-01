import type { UserType } from '@/@types/user.types';
import type { LoginUserType, RegisterUserType } from '@/schema/auth.schema';
import useUser from '@/store/user.store';
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

    const {
      data: {
        token: { access, refresh },
        user,
      },
    } = data;

    useUser.setState({
      user,
      refreshToken: refresh,
      token: access,
    });
  }
};

const login = async (props: LoginUserType) => {
  try {
    const data = await reqImpl<{
      user: UserType;
      token: {
        refresh: string;
        access: string;
      };
    }>('/auth/login', {
      body: JSON.stringify(props),
      method: 'POST',
    });
    if (!data.success) {
      throw data.error;
    }
    return data;
  } catch (e) {
    console.error('ERROR: login -> ', e);
    return {
      error: e,
    };
  }
};

const register = async (props: RegisterUserType) => {
  try {
    const data = await reqImpl<{
      user: UserType;
      token: {
        refresh: string;
        access: string;
      };
    }>('/auth/register', {
      body: JSON.stringify(props),
      method: 'POST',
    });
    if (!data.success) {
      throw data.error;
    }
    return data;
  } catch (e) {
    console.error('ERROR: register -> ', e);
    return {
      error: e,
    };
  }
};

export { refreshToken, login, register };
