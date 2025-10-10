import J from 'joi';
import type { UserType } from '../@types/user.types';

const uname = J.string().trim().min(3).max(20).required();
const email = J.string().trim().email().required();
const password = J.string()
  .trim()
  .min(8)
  .pattern(/(.*[a-z]){2}/, { name: 'lowercase' })
  .pattern(/(.*[A-Z]){2}/, { name: 'uppercase' })
  .pattern(/(.*[!@#$%^&*]){2}/, { name: 'special' })
  .required();

const registerSchema = J.object<UserType>({
  uname,
  email,
  password,
});

const loginSchema = J.object<UserType>({
  email,
  password,
});

export { registerSchema, loginSchema };
