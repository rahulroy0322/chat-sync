import { create } from 'zustand';
import type { ChatType } from '@/@types/chat.types';
import { req } from '@/api/main';
import useUser from './user.store';

type UseChatsType = {
  chats: null | ChatType[];
  isSending: boolean;
  isLoading: boolean;
};

const useChats = create<UseChatsType>(() => ({
  chats: null,
  isLoading: false,
  isSending: false,
}));

const { getState: get, setState: set } = useChats;

const setChats = (chats: ChatType[]) =>
  set({
    chats,
  });

const fetchChats = async (id: string) => {
  set({
    isLoading: true,
  });

  try {
    const { chats } = await req<{ chats: ChatType[] }>(`chat/msg/${id}`);

    set({
      chats,
    });
  } catch (e) {
    console.error('ERROR:', e);
  } finally {
    set({
      isLoading: false,
    });
  }
};

const sendChat = async (id: string, text: string) => {
  const user = useUser.getState().user;
  if (!user) {
    return;
  }

  const oldChats = get().chats || [];

  const date = new Date().toISOString();

  const data = {
    _id: Math.random().toString().substring(0, 3).toString(),
    attached: null,
    createdAt: date,
    editedAt: date,
    status: 'painding',
    text,
    type: 'text',
    sender: user,
  } satisfies ChatType;

  set({
    chats: oldChats.concat(data),
    isSending: true,
  });

  try {
    const { chat } = await req<{ chat: ChatType }>(`chat/msg/${id}`, {
      method: 'POST',
      body: {
        ...data,
        status: 'send',
      },
    });

    set({
      chats: [
        ...oldChats,
        {
          ...chat,
          sender: user,
        },
      ],
    });
  } catch (e) {
    console.error('ERROR:', e);
  } finally {
    set({
      isSending: false,
    });
  }
};

export { setChats, sendChat, fetchChats };

export default useChats;
