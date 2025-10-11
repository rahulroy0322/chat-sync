const STATUS = {
  // 2**
  OK: 200,
  CREATED: 201,

  ACCEPTED: 202,
  NO_CONTENT: 204,

  // 4**
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  // PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  NOT_ACCEPTABLE: 406,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,

  // 5**
  SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
} as const satisfies Record<string, number>;

type StatusType = keyof typeof STATUS;

export type { StatusType };
export { STATUS };
