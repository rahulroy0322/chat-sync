import type { ArraySchema, ObjectSchema, StringSchema } from 'joi';
import { type DefaultEventsMap, Server, type Socket } from 'socket.io';
import type { EventsMap } from 'socket.io/dist/typed-events';
import type { AccessTokenUserType } from './@types/jwt.types';
import ENV from './config/env.config';
import { REDIS } from './constants/redis.constants';
import http from './http';
import logger from './logger/log';
import { contactsSchema, toSchema } from './schemas/io.schema';
import { verifyAccessToken } from './services/jwt.service';
import { redis, setToRedis } from './services/redis.service';
import { type GetTokenPropsType, getToken } from './utils/auth';
import { getSocketKey, getUserKey, UTSK } from './utils/io';
import { formatJoiError, validateJoi } from './utils/joi';

const validateAndLog = <T>(
  schema: ObjectSchema<T> | ArraySchema<T> | StringSchema<T>,
  data: unknown,
  msg: string
):
  | {
      success: true;
      value: T;
    }
  | {
      success: false;
    } => {
  const { error, warning, value } = validateJoi(schema, data);
  if (warning) {
    logger.warn(formatJoiError(warning), `WARNING in socket -> ${msg}!`);
  }

  if (error) {
    const _error = formatJoiError(error);
    console.error(_error, `ERROR!: in socket -> ${msg}`);
    return {
      success: false,
    };
  }

  return {
    success: true,
    value,
  };
};

const typing = (socket: Socket) => {
  let timer: ReturnType<typeof setTimeout>;
  socket.on('typing:start', (to) => {
    const res = validateAndLog(toSchema, to, 'typing:start');

    if (!res.success) {
      return;
    }

    socket.to(res.value).emit('typing:start');
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      socket.to(res.value).emit('typing:stop');
      clearTimeout(timer);
    }, 1000);
  });

  socket.on('typing:stop', (to) => {
    const res = validateAndLog(toSchema, to, 'typing:start');

    if (!res.success) {
      return;
    }
    socket.to(res.value).emit('typing:stop');
    if (timer) {
      clearTimeout(timer);
    }
  });
};

const io = new Server<
  DefaultEventsMap,
  EventsMap,
  DefaultEventsMap,
  {
    user: AccessTokenUserType;
  }
>(http, {
  cors: {
    origin: ENV.FRONEND_URLS,
    methods: ['GET', 'POST'],
  },
});

io.use((socket, next) => {
  const token = getToken(socket.handshake as GetTokenPropsType).split(' ')[1];

  try {
    const { user } = verifyAccessToken(token);

    socket.data.user = user;
    next();
  } catch (e) {
    next({
      ...(e || {}),
      data: {
        code: 401,
      },
    } as unknown as Error);
  }
});

io.on('connection', async (socket) => {
  try {
    logger.info({ id: socket.id }, 'connection');
    const user = socket.data.user;

    socket.to(user.sub).emit('online', {
      userId: user.sub,
      socketId: socket.id,
    });

    typing(socket);

    socket.on('contacts', async (contacts) => {
      const res = validateAndLog(contactsSchema, contacts, 'contacts');

      if (!res.success) {
        return;
      }

      const contactsIds = res.value.map((id) => {
        socket.join(id);

        return getUserKey(id);
      });

      if (!contactsIds.length) {
        return;
      }

      (await redis.mget(contactsIds))
        // .filter((id) => typeof id === "string")
        .forEach((value) => {
          if (typeof value !== 'string') return;
          const {
            key,
            data: _,
          }: {
            key: string;
            data: string;
          } = JSON.parse(value);

          const uid = key.substring(UTSK.length);

          socket.emit('online', {
            userId: uid,
            socketId: socket.id,
          });
        });
    });

    socket.on('chat', async (uid: string, chat) => {
      const res = validateAndLog(toSchema, uid, 'chat');

      if (!res.success) {
        return;
      }

      const socketData = await redis.get(getUserKey(res.value));

      if (socketData) {
        const { data } = JSON.parse(socketData) as {
          data: string;
        };

        io.to(data).emit('chat', chat);
      }
    });

    socket.on('chat-status', async (uid: string, chat) => {
      const res = validateAndLog(toSchema, uid, 'chat');

      if (!res.success) {
        return;
      }

      const socketData = await redis.get(getUserKey(res.value));

      if (socketData) {
        const { data } = JSON.parse(socketData) as {
          data: string;
        };

        io.to(data).emit('chat-status', chat);
      }
    });
    const userKey = getUserKey(user.sub);
    const socketKey = getSocketKey(socket.id);

    await redis.sadd(REDIS.USERS, user.sub);
    await setToRedis(userKey, socket.id);
    await setToRedis(socketKey, user.sub);

    socket.on('disconnect', async () => {
      logger.info({ id: socket.id }, 'disconnect');
      socket.to(user.sub).emit('offline', {
        userId: user.sub,
        socketId: socket.id,
      });
      await redis.srem(REDIS.USERS, user.sub);
      await redis.del(userKey, socketKey);
    });
  } catch (error) {
    logger.fatal({ error }, 'Error in io!');
  }
});

export { io };
export default http;
