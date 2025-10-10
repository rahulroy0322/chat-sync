import pino from 'pino';
import PinoPretty from 'pino-pretty';

import ENV, { isDev } from '../config/env.config';

const logger = pino(
  PinoPretty({
    colorize: true,
    minimumLevel: ENV.ENV === 'debug' ? 'trace' : isDev ? 'info' : 'warn',
  })
);
const { trace, debug, info, warn, error, fatal } = logger;

export { trace, debug, info, warn, error, fatal, logger };

export default logger;
