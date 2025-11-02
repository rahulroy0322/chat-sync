import J from 'joi';

type LoginUserType = {
  email: string;
  password: string;
};

type RegisterUserType = LoginUserType & {
  uname: string;
};

const uname = J.string().trim().min(3).max(20).required();
const email = J.string().trim().email().required();
const password = J.string()
  .trim()
  .min(8)
  .pattern(/(.*[a-z]){2}/, { name: 'lowercase' })
  .pattern(/(.*[A-Z]){2}/, { name: 'uppercase' })
  .pattern(/(.*[!@#$%^&*]){2}/, { name: 'special' })
  .required();

const registerSchema = J.object<RegisterUserType>({
  uname,
  email,
  password,
});

const loginSchema = J.object<LoginUserType>({
  email,
  password,
});

export type { LoginUserType, RegisterUserType };

export { registerSchema, loginSchema };
