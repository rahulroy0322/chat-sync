import express, { type Express, json, urlencoded } from 'express';
import { errorMiddleware } from './middlewares/error.middleware';
import { requestInfoMeddleware } from './middlewares/info.middleware';
import { notFoundMiddleware } from './middlewares/not-found.middleware';
import apiRouter from './routes';

const app: Express = express();

app.use(json());
app.use(
  urlencoded({
    extended: true,
  })
);

// req-> info
app.use(requestInfoMeddleware);

// api routes
app.use('/api/v1', apiRouter);

// middlewares
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
