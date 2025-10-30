import { type FC, useEffect } from 'react';
import { refreshToken } from '@/api';
import MainLayout from '@/components/app/layouts/main.layout';
import Loading from '@/components/app/ui/loading';
import AuthPage from '@/pages/auth.page';
import useUser, { setLoading } from '@/store/user.store';

const App: FC = () => {
  const token = useUser((state) => state.token);
  const user = useUser((state) => state.user);
  const isLoading = useUser((state) => state.isLoading);

  useEffect(() => {
    const cont = new AbortController();

    const getUser = async () => {
      try {
        setLoading(true);
        await refreshToken(cont.signal);
      } catch (e) {
        console.error('ERROR:', e);
      } finally {
        setLoading(false);
      }
    };

    if (useUser.getState().refreshToken) {
      getUser();
    }

    return () => {
      cont.abort();
    };
  }, []);

  if (!user) {
    return <AuthPage />;
  }

  if (isLoading || !token) {
    return (
      <div className='h-screen'>
        <Loading />
      </div>
    );
  }

  return <MainLayout />;
};

export default App;
