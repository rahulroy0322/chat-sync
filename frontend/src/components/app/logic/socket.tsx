import { type FC, useEffect } from 'react';
import useSocket, { connectIO } from '@/store/io.store';
import useUser from '@/store/user.store';

const handleError = (e: unknown) => {
  console.error(e);
};

const handleConnected = () => {
  // biome-ignore lint/suspicious/noConsole: just for debug perpuse
  console.log('connection successful');
};

const Socket: FC = () => {
  const io = useSocket((state) => state.io);

  useEffect(() => {
    // biome-ignore lint/style/noNonNullAssertion: i know it will be there
    const token = useUser.getState().token!;
    const socket = connectIO(token);

    return () => {
      socket();
    };
  }, []);

  useEffect(() => {
    io?.on('connect', handleConnected);
    io?.on('connect_error', handleError);

    return () => {
      io?.off('connect');
      io?.off('connect_error');
    };
  }, [io]);
  return null;
};

export default Socket;
