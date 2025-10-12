import { io, type Socket } from "socket.io-client";
import { create } from "zustand";

const BASE_URL = "http://localhost:8000";

type UseSocketType = {
  io: Socket | null;
};

const useSocket = create<UseSocketType>(() => ({
  io: null,
}));

const { getState: get, setState: set } = useSocket;

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

export { connectIO };
export default useSocket;
