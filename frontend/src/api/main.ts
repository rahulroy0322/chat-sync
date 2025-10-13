import type { ResType } from '@/@types/res.types';
import useUser from '@/store/user.store';
import { refreshToken } from './auth';

const BASE_URL = 'http://localhost:8000';

const API_URL = `${BASE_URL}/api/v1`;

const formateUrl = (path: string) =>
  path.startsWith('/') ? path.substring(1) : path;

const reqImpl = async <R>(
  url: string,
  options: RequestInit & {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    body?: string;
  } = {
    method: 'GET',
    body: undefined,
  }
): Promise<ResType<R>> => {
  url = url.startsWith('http') ? url : `${API_URL}/${formateUrl(url)}`;

  const res = await fetch(url, options);

  return res.json() as Promise<ResType<R>>;
};

const req = async <R>(
  url: string,
  options?: {
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    body?: string;
  },
  signal?: AbortSignal
): Promise<R> => {
  const { method = 'GET', body = undefined } = options || {};
  const { token } = useUser.getState();

  const _options: RequestInit = {
    method,
    headers: {
      token: `Bearer ${token}`,
    },
  };
  if (signal) {
    _options.signal = signal;
  }
  if (signal) {
    _options.signal = signal;
  }
  if (body) {
    _options.body = body;
  }
  try {
    const data = await reqImpl<R>(url, {
      headers: {
        token: `Bearer ${token}`,
      },
      signal,
    });

    if (!data.success) {
      throw data.error;
    }

    return data.data;
  } catch (e) {
    if (
      (
        e as {
          code: number;
        }
      )?.code === 401
    ) {
      await refreshToken();

      const data = await reqImpl<R>(url, {
        headers: {
          token: `Bearer ${token}`,
        },
        signal,
      });

      if (!data.success) {
        throw data.error;
      }

      return data.data;
    }

    throw e;
  }
};

export { req, reqImpl, BASE_URL, API_URL };
