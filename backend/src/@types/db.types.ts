type DbErrorType = {
  error: Error;
};

type DbResType<T, U = T> = Promise<T | U | DbErrorType>;

export type { DbResType };
