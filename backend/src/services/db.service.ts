import mongoose from 'mongoose';
import ENV from '../config/env.config';
import logger from '../logger/log';

const connectDb = async (err = () => {}) => {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    logger.info('db connected successfully');
  } catch (e) {
    logger.error(e, 'DB connect EROOR!');
    err();
  }
};

export { connectDb };
