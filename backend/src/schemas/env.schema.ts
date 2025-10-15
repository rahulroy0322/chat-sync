import J from 'joi';
import type { EnvType } from '../@types/env.types';
import { ENV_CONSTS } from '../constants/env.constants';

const envSchema = J.object<EnvType>({
  PORT: J.number().default(8000),
  ENV: J.string()
    .valid(...ENV_CONSTS)
    .required(),
  MONGO_URI: J.string().uri().required(),
  REDIS_URI: J.string().uri().required(),
  JWT_SECRET: J.string().required(),
  FRONEND_URLS: J.string()
    .required()
    .custom((value, helpers) => {
      const urlArray = value
        .split(',')
        .map((url: string) => url.trim())
        .filter(Boolean) as string[];

      const invalidUrls = urlArray.filter(
        (url) => !!J.string().uri().validate(url).error
      );

      if (invalidUrls.length > 0) {
        return helpers.error('any.invalid', {
          message: `${invalidUrls.join(',')}: URLs are invalid`,
        });
      }

      return urlArray;
    }, 'Comma-separated URL transformation'),
});

export { envSchema };
