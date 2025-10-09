import { create } from 'zustand';
import type { ChatType } from '@/@types/chat.types';
import type { UserType } from '@/@types/user.types';
import useUser from './user.store';

const user1 = {
  _id: 'u-1',
  avatarUrl: '/profile.gif',
  uname: 'username',
} satisfies UserType;

const user2 = {
  ...user1,
  avatarUrl: '/worker.gif',
  _id: 'u-2',
};

const getUser = () => (Math.random() > 0.5 ? user1 : user2);

const date = '2022-10-04T13:45:41.869Z';

const chats = [
  {
    _id: 'chat-01',
    createdAt: date,
    editedAt: date,
    sender: getUser(),
    status: 'read',
    text: 'hi',
    type: 'text',
  },
  {
    _id: 'chat-02',
    createdAt: date,
    editedAt: date,
    sender: getUser(),
    status: 'read',
    text: 'hlo',
    type: 'text',
  },
  {
    _id: 'chat-03',
    createdAt: date,
    editedAt: date,
    sender: getUser(),
    status: 'read',
    text: 'how are You',
    type: 'text',
  },
  {
    _id: 'chat-04',
    createdAt: date,
    editedAt: date,
    sender: getUser(),
    status: 'read',
    text: 'fine.',
    type: 'text',
  },
  {
    _id: 'chat-05',
    createdAt: date,
    editedAt: date,
    sender: getUser(),
    status: 'riched',
    text: 'what about u??',
    type: 'text',
  },
  {
    _id: 'chat-06',
    createdAt: date,
    editedAt: date,
    sender: getUser(),
    status: 'read',
    text: "i'm also fine",
    type: 'text',
  },
  {
    _id: 'chat-07',
    createdAt: date,
    editedAt: date,
    sender: getUser(),
    status: 'read',
    text: 'cjdbsajcvjsa',
    type: 'img',
    url: '/image.png',
  },
  {
    _id: 'chat-08',
    createdAt: date,
    editedAt: date,
    sender: getUser(),
    status: 'read',
    text: 'cjdbsajcvjsa',
    type: 'img',
    url: '/image.png',
  },
  {
    _id: 'chat-09',
    createdAt: date,
    editedAt: date,
    sender: getUser(),
    status: 'read',
    text: 'cjdbsajcvjsa',
    type: 'img',
    url: '/image.png',
  },
] satisfies ChatType[];

type UseChatsType = {
  chats: ChatType[];
  isSending: boolean;
  isLoading: boolean;
};

const useChats = create<UseChatsType>(() => ({
  chats: chats,
  isLoading: false,
  isSending: false,
}));

const { getState: get, setState: set } = useChats;

const setChats = (chats: ChatType[]) =>
  set({
    chats,
  });

const sendChat = (msg: string) => {
  const user = useUser.getState().user;
  if (!user) {
    return;
  }

  const oldChats = get().chats;

  const data = {
    _id: Math.random().toString().substring(0, 3).toString(),
    attached: null,
    createdAt: date,
    editedAt: date,
    status: 'painding',
    text: msg,
    type: 'text',
    sender: user,
  } satisfies ChatType;

  set({
    chats: oldChats.concat(data),
    isSending: true,
  });
  setTimeout(
    () => {
      const _n = Math.random();
      set({
        chats: [
          ...oldChats,
          {
            ...data,
            status: _n > 0.75 ? 'read' : _n > 50 ? 'riched' : 'send',
          },
        ],
        isSending: false,
      });
    },
    Math.random() * 2 + 1000
  );
};

export { setChats, sendChat };

export default useChats;
