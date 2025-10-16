import type { ChatType } from '@/@types/chat.types';
import { req } from './main';

const updateChat = async (chat: ChatType, body: Partial<ChatType>) => {
  return (
    await req<{
      chat: ChatType;
    }>(`chat/msg/${chat.msgId}/chat/${chat._id}/`, {
      method: 'PATCH',
      body,
    })
  ).chat;
};

const updateToReadChat = (chat: ChatType) =>
  updateChat(chat, {
    status: 'read',
  });

const updateToReachedChat = (chat: ChatType) =>
  updateChat(chat, {
    status: 'reached',
  });

export { updateToReadChat, updateToReachedChat };
