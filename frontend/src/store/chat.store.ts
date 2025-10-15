import { create } from "zustand";
import type { ChatType } from "@/@types/chat.types";
import { req } from "@/api/main";
import useUser from "./user.store";

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

const addChat = (chat: ChatType) =>
  set(({ chats }) => ({
    chats: [...(chats || []), chat],
  }));

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
    console.error("ERROR:", e);
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
    _id: `temp-${date}-${Math.random()}`,
    attached: null,
    createdAt: date,
    editedAt: date,
    status: "pending",
    text,
    type: "text",
    sender: user,
    msgId: id,
  } satisfies ChatType;

  set({
    chats: [...oldChats,data],
    isSending: true,
  });

  try {
    const { chat } = await req<{ chat: ChatType }>(`chat/msg/${id}`, {
      method: "POST",
      body: {
        type: "text",
        text,
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
    return chat;
  } catch (e) {
    console.error("ERROR:", e);
    set({
      chats: [
        ...oldChats,
        {
          ...data,
          status: "failed",
        },
      ],
    });
  } finally {
    set({
      isSending: false,
    });
  }
};

export { addChat, setChats, sendChat, fetchChats };

export default useChats;
