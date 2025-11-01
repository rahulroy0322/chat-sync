import { type FC, useLayoutEffect } from 'react';
import { LoginForm } from '@/components/app/logic/auth/login';
import { RegisterForm } from '@/components/app/logic/auth/register';
import Todo from '@/components/app/ui/todo';
import useAuth, { setAuthScreen } from '@/store/auth.store';

// type FieldPropsType = {
//   label: string;
//   placeholder: string;
//   type: 'password' | 'email' | 'text';
//   name: string;
//   ref: RefObject<HTMLInputElement | null>;
// } & ComponentProps<'input'>;

// const Field: FC<FieldPropsType> = ({ label, ...props }) => (
//   <label className='flex items-center gap-2'>
//     <b>{label} : </b>
//     <input
//       {...props}
//       className='border-b outline-none px-2'
//       required
//     />
//   </label>
// );

// const AuthPage: FC = () => {
//   const [loading, setLoading] = useState(false);

//   const emailRef = useRef<HTMLInputElement>(null);
//   const passwordRef = useRef<HTMLInputElement>(null);

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault();

//     const email = emailRef.current?.value;
//     const password = passwordRef.current?.value;

//     if (email && password) {
//       toast.promise(
//         () =>
//           new Promise(async (res, rej) => {
//             try {
//               setLoading(true);
//               const _data = await login({
//                 email,
//                 password,
//               });

//               if ('error' in _data) {
//                 return rej(_data.error as Error);
//               }

//               const {
//                 data: {
//                   token: { access, refresh },
//                   user,
//                 },
//               } = _data;

//               useUser.setState({
//                 user,
//                 refreshToken: refresh,
//                 token: access,
//               });
//               res(null);
//             } finally {
//               setLoading(false);
//             }
//           }),
//         {
//           loading: 'Loading...',
//           success: () => 'Login Success...',
//           error: (e: Error) => e.message,
//         }
//       );
//     }
//   };

//   return (
//     <div
//       className='grow h-screen flex flex-col justify-center items-center overflow-hidden'
//       role='presentation'
//     >
//       <form
//         className='border border-primary flex flex-col gap-2 p-4'
//         onSubmit={handleSubmit}
//       >
//         <Field
//           defaultValue='raat@example.com'
//           label='Email'
//           name='email'
//           placeholder='jhon@example.com'
//           ref={emailRef}
//           type='email'
//         />
//         <Field
//           defaultValue='RAat@@101'
//           label='Password'
//           name='password'
//           placeholder={'*'.repeat(8)}
//           ref={passwordRef}
//           type='text'
//         />
//         <Button
//           disabled={loading}
//           type='submit'
//         >
//           Login
//         </Button>
//       </form>
//     </div>
//   );
// };

const AuthPageImpl: FC = () => {
  const authState = useAuth((state) => state.state);

  switch (authState) {
    case 'login':
      return <LoginForm />;
    case 'register':
      return <RegisterForm />;
    case 'forget':
      return <Todo title='RESET PASSWORD' />;
    case 'none':
      return null;
  }
  return null;
};

const AuthPage: FC = () => {
  useLayoutEffect(() => {
    setAuthScreen('login');
  }, []);
  return (
    <div
      className='grow h-screen flex flex-col justify-center items-center overflow-hidden'
      role='presentation'
    >
      <AuthPageImpl />
    </div>
  );
};

export default AuthPage;
