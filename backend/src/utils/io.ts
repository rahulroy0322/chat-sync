import { REDIS } from '../constants/redis.constants';

const UTSK = `${REDIS.USER_TO_SOCKET}-` as const;
const STUK = `${REDIS.SOCKET_TO_USER}:` as const;

const getUserKey = (uid: string) => `${UTSK}${uid}`;

const getSocketKey = (sid: string) => `${STUK}${sid}`;

export { getSocketKey, getUserKey, STUK, UTSK };
