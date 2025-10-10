import J from 'joi';
import type { EnvType } from '../@types/env.types';
import { ENV_CONSTS } from '../constants/env.constants';

const envSchema = J.object<EnvType>({
  PORT: J.number().default(8000),
  ENV: J.string()
    .valid(...ENV_CONSTS)
    .required(),
  MONOG_URI: J.string().uri().required(),
  JWT_SECRET: J.string().required(),
});

export { envSchema };
