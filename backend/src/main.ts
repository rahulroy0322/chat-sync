import { PORT } from './config/env.config';
import http from './http';
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
  connectDb(close).then(async () => {
    // 0 &&
    //   console.log(
    //     await findUser({
    //       uname: "uname2",
    //     })
    //   );
    // console.log(await findMsgsByUId("68ea2001e603985004224ae1"));
  });
});

process.on('SIGTERM', close);
