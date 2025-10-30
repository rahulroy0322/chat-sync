import type { ChatType } from '@/@types/chat.types';
import type { MessageType } from '@/@types/message.types';
import { db } from '@/db/main';
import useChats from '@/store/chat.store';
import { req } from './main';

const sendChat = async ({
  text,
  userId,
  msg,
}: {
  msg: MessageType;
  userId: string;
  text: string;
}) => {
  useChats.setState({
    isSending: true,
  });

  let _chat = {
    _id: `TEMP-${Math.random()}`,
    createdAt: new Date().toISOString(),
    editedAt: null,
    receiver: msg._id,
    sender: userId,
    status: 'pending',
    type: 'text',
    text,
  } satisfies ChatType as ChatType;

  try {
    await db.chats.add(_chat);

    const { chat } = await req<{ chat: ChatType }>(`chat/`, {
      method: 'POST',
      body: {
        type: 'text',
        text,
        status: 'sent',
        receiver: msg._id,
      },
    });

    await db.chats.update(_chat._id, chat);
    _chat = chat;
  } catch (e) {
    console.error('ERROR sending chat:', e);
    await db.chats.update(_chat._id, {
      status: 'failed',
    });
  } finally {
    useChats.setState({
      isSending: false,
    });
    await db.messages.update(msg._id, {
      lastMsgId: _chat._id,
    });
  }
  return _chat;
};

const updateChats = async (_chats: ChatType[]) => {
  try {
    const { chats } = await req<{ chats: ChatType[] }>(`chat/`, {
      method: 'PATCH',
      body: {
        chats: _chats,
      },
    });

    await db.chats.bulkUpdate(
      chats.map((chat) => ({
        key: chat._id,
        changes: chat,
      }))
    );
  } catch (e) {
    console.error('ERROR sending chat:', e);
  }
};
export { sendChat, updateChats };
