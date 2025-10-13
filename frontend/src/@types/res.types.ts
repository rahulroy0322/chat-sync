type SuccessType<D> = {
  success: true;
  data: D;
};

type ErrorType = {
  success: false;
  error: Error;
};

type ResType<D> = SuccessType<D> | ErrorType;

export type { ResType };
