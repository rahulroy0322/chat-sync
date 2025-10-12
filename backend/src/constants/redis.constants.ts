const REDIS_KEYS = {
  USERS: "USERS",
  USER_TO_SOCKET: "USER_TO_SOCKET",
  SOCKET_TO_USER: "SOCKET_TO_USER",
} as const satisfies Record<string, string>;

const REDIS = REDIS_KEYS;

type RedisKeyType = keyof typeof REDIS;

export type { RedisKeyType };
export { REDIS_KEYS, REDIS };
