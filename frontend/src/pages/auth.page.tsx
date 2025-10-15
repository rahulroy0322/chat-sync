import {
  type ComponentProps,
  type FC,
  type FormEvent,
  type RefObject,
  useRef,
} from 'react';
import { Button } from '@/components/ui/button';
import { login } from '@/store/user.store';

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
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (email && password) {
      login({
        email,
        password,
      });
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
        <Button type='submit'>Login</Button>
      </form>
    </div>
  );
};

export default AuthPage;
