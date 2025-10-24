import { create } from 'zustand';
import type { ChatType } from '@/@types/chat.types';

type UseChatsType = {
  chats: Record<string, ChatType>;
  isSending: boolean;
};

const useChats = create<UseChatsType>(() => ({
  chats: {},
  isSending: false,
}));

const { setState: set } = useChats;

const setChats = (chats: UseChatsType['chats']) =>
  set({
    chats,
  });

export { setChats };

export default useChats;
