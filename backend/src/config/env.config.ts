import 'dotenv/config';
import { envSchema } from '../schemas/env.schema';
import { formatJoiError, validateJoi } from '../utils/joi';

const { warning, error, value } = validateJoi(envSchema, process.env);

if (warning) {
  console.warn('WARNING: ', formatJoiError(warning));
}

if (error) {
  console.error('ERROR!: ', formatJoiError(error));
  process.exit(1);
}

const ENV = value;

const { PORT } = ENV;
const isDev = ENV.ENV === 'dev';

export { ENV, PORT, isDev };

export default ENV;
