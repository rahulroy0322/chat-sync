import type { ResType } from '@/@types/res.types';
import useUser from '@/store/user.store';
import { refreshToken } from './auth';

const BASE_URL = 'http://localhost:8000';

const API_URL = `${BASE_URL}/api/v1`;

type RequestOptionsType = RequestInit & {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: string;
};

const formateUrl = (path: string) =>
  path.startsWith('/') ? path.substring(1) : path;

const reqImpl = async <R>(
  url: string,
  options: RequestOptionsType = {
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
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    body?: unknown;
  },
  signal?: AbortSignal
): Promise<R> => {
  const { method = 'GET', body = undefined } = options || {};
  const { token } = useUser.getState();

  const _options = {
    method,
    headers: {
      token: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  if (signal) {
    // @ts-expect-error
    _options.signal = signal;
  }
  if (body) {
    // @ts-expect-error
    _options.body = JSON.stringify(body);
  }
  try {
    const data = await reqImpl<R>(url, _options as RequestOptionsType);

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

      // biome-ignore lint/style/noNonNullAssertion: it will be there
      _options.headers.token = useUser.getState().token!;
      const data = await reqImpl<R>(url, _options as RequestOptionsType);

      if (!data.success) {
        throw data.error;
      }

      return data.data;
    }

    throw e;
  }
};

export { req, reqImpl, BASE_URL, API_URL };
