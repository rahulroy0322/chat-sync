import {
  type ComponentProps,
  type FC,
  type FormEvent,
  type RefObject,
  useRef,
  useState,
} from 'react';
import { login } from '@/api';
import { Button } from '@/components/ui/button';
import useUser from '@/store/user.store';

type FieldPropsType = {
  label: string;
  placeholder: string;
  type: 'password' | 'email' | 'text';
  name: string;
  ref: RefObject<HTMLInputElement | null>;
} & ComponentProps<'input'>;

const Field: FC<FieldPropsType> = ({ label, ...props }) => (
  <label className='flex items-center gap-2'>
    <b>{label} : </b>
    <input
      {...props}
      className='border-b outline-none px-2'
      required
    />
  </label>
);

const AuthPage: FC = () => {
  const [loading, setLoading] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (email && password) {
      try {
        setLoading(true);
        const _data = await login({
          email,
          password,
        });
        if ('error' in _data) {
          throw _data.error;
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
      } catch (e) {
        // TODO?
        console.error('e', e);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className='grow h-screen flex flex-col justify-center items-center overflow-hidden'
      role='presentation'
    >
      <form
        className='border border-primary flex flex-col gap-2 p-4'
        onSubmit={handleSubmit}
      >
        <Field
          defaultValue='raat@example.com'
          label='Email'
          name='email'
          placeholder='jhon@example.com'
          ref={emailRef}
          type='email'
        />
        <Field
          defaultValue='RAat@@101'
          label='Password'
          name='password'
          placeholder={'*'.repeat(8)}
          ref={passwordRef}
          type='text'
        />
        <Button
          disabled={loading}
          type='submit'
        >
          Login
        </Button>
      </form>
    </div>
  );
};

export default AuthPage;
