import { joiResolver } from '@hookform/resolvers/joi';
import {
  type ComponentProps,
  type FC,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { login } from '@/api';
import { type LoginUserType, loginSchema } from '@/schema/auth.schema';
import { setAuthScreen } from '@/store/auth.store';
import useUser from '@/store/user.store';
import { LoginFormUI } from '../../ui/auth/login';
import LoginIllustration from '../../ui/auth/login.illustration';
import { FormFigure } from './form';

const LoginForm: FC = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: joiResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    } satisfies LoginUserType,
  });

  const handleSubmit = ({ email, password }: LoginUserType) => {
    if (!email || !password) {
      toast.error('email and password is required!');
      return;
    }
    toast.promise(
      () =>
        new Promise(async (res, rej) => {
          try {
            setLoading(true);
            const _data = await login({
              email,
              password,
            });

            if ('error' in _data) {
              return rej(_data.error as Error);
            }

            const {
              data: {
                token: { access, refresh },
                user,
              },
            } = _data;

            useUser.setState({
              user,
              refreshToken: refresh,
              token: access,
            });
            res(null);
          } finally {
            setLoading(false);
          }
        }),
      {
        loading: 'Loading...',
        success: () => 'Login Success...',
        error: (e: Error) => e.message,
      }
    );
  };

  const handleRegisterClick = useCallback(() => {
    setAuthScreen('register');
  }, []);

  const registerBtn = useMemo(
    () =>
      ({
        onClick: handleRegisterClick,
      }) satisfies ComponentProps<'button'>,
    [handleRegisterClick]
  );

  return (
    <LoginFormUI
      control={form.control}
      disabled={loading}
      Illustration={
        <FormFigure>
          <LoginIllustration />
        </FormFigure>
      }
      onSubmit={form.handleSubmit(handleSubmit)}
      registerBtn={registerBtn}
    />
  );
};

export { LoginForm };
