import type { ChatType } from '@/@types/chat.types';
import type { MessageType } from '@/@types/message.types';
import { db } from '@/db/dexie';
import useChats from '@/store/chat.store';
import useUser from '@/store/user.store';
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

const sendChat = async (message: MessageType, msg: string) => {
  const user = useUser.getState().user;
  const otherUserId = message.users.find((u) => u !== user?._id);

  if (!user || !otherUserId) {
    return;
  }

  const date = new Date().toISOString();

  const chat = {
    _id: `temp-chat-id-:${Math.random()}`,
    createdAt: date,
    editedAt: null,
    msgId: message._id,
    receiver: otherUserId,
    sender: user._id,
    status: 'pending',
    type: 'text',
    text: msg,
  } satisfies ChatType;

  useChats.setState({
    sending: true,
  });

  try {
    await db.chats.add(chat);
    await db.messages.update(message._id, {
      lastChat: chat._id,
    });

    //  ! todo
    const { chat: _chat } = await req<{ chat: ChatType }>(
      `chat/msg/${message._id}`,
      {
        method: 'POST',
        body: {
          type: 'text',
          text: msg,
        },
      }
    );

    await new Promise((res) => setTimeout(res, 250));

    await db.chats.update(chat._id, _chat);
    return chat;
  } catch (e) {
    console.error('ERROR:', e);
    await db.chats.update(chat._id, {
      status: 'failed',
    });
  } finally {
    useChats.setState({
      sending: false,
    });
  }
};

export { sendChat, updateToReadChat, updateToReachedChat };
