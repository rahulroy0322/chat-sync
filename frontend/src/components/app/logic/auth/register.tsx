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
import { register } from '@/api';
import { type RegisterUserType, registerSchema } from '@/schema/auth.schema';
import { setAuthScreen } from '@/store/auth.store';
import useUser from '@/store/user.store';
import { RegisterFormUI } from '../../ui/auth/register';
import RegisterIllustration from '../../ui/auth/register.illustration';
import { FormFigure } from './form';

const RegisterForm: FC = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: joiResolver(registerSchema),
    defaultValues: {
      uname: '',
      email: '',
      password: '',
    } satisfies RegisterUserType,
  });

  const handleSubmit = (props: RegisterUserType) => {
    const { email, password, uname } = props;
    if (!uname || !email || !password) {
      toast.error('user name,email and password is required!');
      return;
    }
    toast.promise(
      () =>
        new Promise(async (res, rej) => {
          try {
            setLoading(true);
            const _data = await register(props);

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

  const handleResetClick = useCallback(() => {
    setAuthScreen('forget');
  }, []);

  const handleLoginClick = useCallback(() => {
    setAuthScreen('login');
  }, []);

  const resetBtn = useMemo(
    () =>
      ({
        onClick: handleResetClick,
      }) satisfies ComponentProps<'button'>,
    [handleResetClick]
  );

  const loginBtn = useMemo(
    () =>
      ({
        onClick: handleLoginClick,
      }) satisfies ComponentProps<'button'>,
    [handleLoginClick]
  );

  return (
    <RegisterFormUI
      control={form.control}
      disabled={loading}
      Illustration={
        <FormFigure>
          <RegisterIllustration />
        </FormFigure>
      }
      loginBtn={loginBtn}
      onSubmit={form.handleSubmit(handleSubmit)}
      resetBtn={resetBtn}
    />
  );
};

export { RegisterForm };
