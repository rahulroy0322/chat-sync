import type { ENVType } from '../constants/env.constants';

type EnvType = {
  PORT: number;
  ENV: ENVType;
  MONOG_URI: string;
  JWT_SECRET: string;
};

export type { EnvType };
