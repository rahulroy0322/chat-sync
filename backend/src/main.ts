import { PORT } from './config/env.config';
import http from './io';
import logger from './logger/log';
import { connectDb } from './services/db.service';

const close = () => {
  server.closeIdleConnections();
  server.closeAllConnections();
  server.close((err) => {
    if (err) {
      logger.error(err, 'ERROR! in server close');
      process.exit(1);
    }
    process.exit(0);
  });
};

const server = http.listen(PORT, () => {
  logger.info(`app is running on port : ${PORT}`);
  connectDb(close);
});

process.on('SIGTERM', close);
