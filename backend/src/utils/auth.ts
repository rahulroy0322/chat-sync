type GetTokenPropsType = {
  headers: Record<string, string>;
};

const getToken = ({ headers }: GetTokenPropsType): string =>
  ((headers.Authorization ||
    headers.authorization ||
    headers.token ||
    headers['api-token'] ||
    headers['x-api-token']) as string) || '';

export type { GetTokenPropsType };

export { getToken };
