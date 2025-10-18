import { create } from 'zustand';
import type { ChatType } from '@/@types/chat.types';

// import { req } from '@/api/main';

type UseChatsType = {
  chats: null | Record<ChatType['_id'], ChatType>;
  sending: boolean;
};

const useChats = create<UseChatsType>(() => ({
  chats: null,
  sending: false,
}));

const { setState: set } = useChats;

const setChats = (chats: UseChatsType['chats']) =>
  set({
    chats,
  });

// const addChat = (chat: ChatType) =>
//   set(({ chats }) => ({
//     chats: [...(chats || []), chat],
//   }));

// const updateChats = (updatedChats: ChatType[]) =>
//   set(({ chats }) => {
//     if (!chats || !updatedChats.length) {
//       return {};
//     }

//     updatedChats.forEach((uc) => {
//       const index = chats.findIndex((c) => c._id === uc._id);
//       if (index !== -1) {
//         chats[index] = uc;
//       }
//     });

//     return {
//       chats: [...chats],
//     };
//   });

// const fetchChats = async (id: string) => {
//   set({
//     isLoading: true,
//   });

//   try {
//     const { chats } = await req<{ chats: ChatType[] }>(`chat/msg/${id}`);

//     set({
//       chats,
//     });
//   } catch (e) {
//     console.error("ERROR:", e);
//   } finally {
//     set({
//       isLoading: false,
//     });
//   }
// };

// const sendChat = async (id: string, text: string) => {
//   const user = useUser.getState().user;
//   if (!user) {
//     return;
//   }

//   const oldChats = get().chats || [];

//   const date = new Date().toISOString();

//   const data = {
//     _id: `temp-${date}-${Math.random()}`,
//     attached: null,
//     createdAt: date,
//     editedAt: date,
//     status: "pending",
//     text,
//     type: "text",
//     sender: user._id,
//     receiver: "tepm-userId",
//     msgId: id,
//   } satisfies ChatType;

//   set({
//     chats: [...oldChats, data],
//     isSending: true,
//   });

//   try {
//     const { chat } = await req<{ chat: ChatType }>(`chat/msg/${id}`, {
//       method: "POST",
//       body: {
//         type: "text",
//         text,
//       },
//     });

//     set({
//       chats: [
//         ...oldChats,
//         {
//           ...chat,
//           sender: user._id,
//         },
//       ],
//     });
//     return chat;
//   } catch (e) {
//     console.error("ERROR:", e);
//     set({
//       chats: [
//         ...oldChats,
//         {
//           ...data,
//           status: "failed",
//         },
//       ],
//     });
//   } finally {
//     set({
//       isSending: false,
//     });
//   }
// };

// export { addChat, updateChats, setChats, sendChat, fetchChats };

export { setChats };
export default useChats;
