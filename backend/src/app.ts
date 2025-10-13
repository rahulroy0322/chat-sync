import cors from 'cors';
import express, { type Express, json, urlencoded } from 'express';
import type { AccessTokenUserType } from './@types/jwt.types';
import { errorMiddleware } from './middlewares/error.middleware';
import { requestInfoMiddleware } from './middlewares/info.middleware';
import { notFoundMiddleware } from './middlewares/not-found.middleware';
import apiRouter from './routes';

const app: Express = express();

app.use(
  cors({
    origin: ['http://localhost:5173'],
  })
);
app.use(json());
app.use(
  urlencoded({
    extended: true,
  })
);

// req-> info
app.use(requestInfoMiddleware);

// api routes
app.use('/api/v1', apiRouter);

// middlewares
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenUserType;
    }
  }
}
