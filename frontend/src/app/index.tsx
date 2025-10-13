import { type FC, useEffect } from 'react';
import { refreshToken } from '@/api/auth';
import MainLayout from '@/components/app/layouts/main.layout';
import useUser, { setLoading } from '@/store/user.store';

const App: FC = () => {
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

  if (isLoading) {
    // ? TODO
    return 'loading...';
  }

  if (user) {
    return <MainLayout />;
  }

  return 'no user';
};

export default App;
