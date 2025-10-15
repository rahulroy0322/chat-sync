import { io, type Socket } from 'socket.io-client';
import { create } from 'zustand';
import { BASE_URL } from '@/api/main';

type UseSocketType = {
  io: Socket | null;
  onlineUsers: Set<string>;
};

const useSocket = create<UseSocketType>(() => ({
  io: null,
  onlineUsers: new Set<string>(),
}));

const { getState: get, setState: set } = useSocket;

const addOnlineUser = (uid: string) =>
  set(() => {
    const oldSet = get().onlineUsers;
    oldSet.add(uid);

    return {
      onlineUsers: new Set(oldSet),
    };
  });

const removeOnlineUser = (uid: string) =>
  set(() => {
    const oldSet = get().onlineUsers;
    oldSet.delete(uid);

    return {
      onlineUsers: new Set(oldSet),
    };
  });

const closeIO = () => {
  const socket = get().io;
  if (socket) {
    socket.close();

    set({
      io: null,
    });
  }
};

const connectIO = (token: string) => {
  closeIO();

  set({
    io: io(BASE_URL, {
      extraHeaders: {
        Authorization: `Bearer ${token}`, // Or any other header name like 'x-auth-token'
      },
    }),
  });

  return closeIO;
};

export { connectIO, addOnlineUser, removeOnlineUser };
export default useSocket;
