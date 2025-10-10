const ENV_CONSTS = ['dev', 'debug', 'test', 'prod'] as const;

type ENVType = (typeof ENV_CONSTS)[number];

export type { ENVType };
export { ENV_CONSTS };
