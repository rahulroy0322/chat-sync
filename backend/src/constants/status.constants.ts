const STATUS = {
  // 2**
  OK: 200,
  CREATED: 201,

  // 4**
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,

  // 5**
  SERVER_ERROR: 500,
} as const satisfies Record<string, number>;

type StatusType = keyof typeof STATUS;

export type { StatusType };
export { STATUS };
