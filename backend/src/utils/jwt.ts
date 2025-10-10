import jwt, { type SignOptions } from 'jsonwebtoken';
import ENV from '../config/env.config';

const sing = (data: Record<string, unknown>, options?: SignOptions) =>
  jwt.sign(data, ENV.JWT_SECRET, options);
const verify = (token: string) => jwt.verify(token, ENV.JWT_SECRET);

export { sing, verify };
