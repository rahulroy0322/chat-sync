import type { ENVType } from '../constants/env.constants';

type EnvType = {
  PORT: number;
  ENV: ENVType;
  MONGO_URI: string;
  REDIS_URI: string;
  JWT_SECRET: string;
  FRONEND_URLS: string[];
};

export type { EnvType };
