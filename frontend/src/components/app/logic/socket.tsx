import { type FC, useEffect } from 'react';
import type { ChatType } from '@/@types/chat.types';
import type { UserType } from '@/@types/user.types';
import { updateChats } from '@/api/chat.api';
import { db } from '@/db/main';
import useSocket, {
  addOnlineUser,
  connectIO,
  removeOnlineUser,
} from '@/store/io.store';
import useMessages from '@/store/messages.store';
import useUser from '@/store/user.store';

const handleError = (e: unknown) => {
  console.error('Socket connection error:', e);
};

const handleConnect = async () => {
  const io = useSocket.getState().io;
  if (!io) {
    return;
  }

  const contacts = (await db.contacts.toArray()).map(({ _id }) => _id);
  io.emit('contacts', contacts);
};

const Socket: FC = () => {
  const io = useSocket((state) => state.io);

  const token = useUser((state) => state.token);

  useEffect(() => {
    const ret = () => {
      io?.close();
    };
    if (!token) return ret;
    if (io) {
      return;
    }
    connectIO(token);

    return ret;
  }, [token, io]);

  useEffect(() => {
    io?.on('connect', handleConnect);
    io?.on('connect_error', handleError);

    return () => {
      io?.off('connect', handleConnect);
      io?.off('connect_error', handleError);
    };
  }, [io]);

  useEffect(() => {
    const onChat = async (chat: ChatType) => {
      if (!chat) {
        return;
      }

      await db.messages.update(chat.sender, {
        lastMsgId: chat._id,
      });

      const msgId = useMessages.getState().selectedMsg?._id;

      const updatedChat = {
        ...chat,
        status: chat.sender === msgId ? 'read' : 'reached',
      } satisfies ChatType;

      await db.chats.add(updatedChat);

      await updateChats([updatedChat]);

      io?.emit('chat-status', chat.sender, updatedChat);
    };

    io?.on('chat', onChat);

    return () => {
      io?.off('chat', onChat);
    };
  }, [io]);

  useEffect(() => {
    const onChatStatus = async (chat: ChatType) => {
      if (!chat) {
        return;
      }
      await db.chats.update(chat._id, chat);
    };

    io?.on('chat-status', onChatStatus);

    return () => {
      io?.off('chat-status', onChatStatus);
    };
  }, [io]);

  useEffect(() => {
    const handleOnlineUser = ({ userId }: { userId: UserType['_id'] }) => {
      addOnlineUser(userId);
    };
    const handleOfflineUser = ({ userId }: { userId: UserType['_id'] }) => {
      removeOnlineUser(userId);
    };

    io?.on('online', handleOnlineUser);
    io?.on('offline', handleOfflineUser);

    return () => {
      io?.off('online', handleOnlineUser);
      io?.off('offline', handleOfflineUser);
    };
  }, [io]);

  return null;
};

export default Socket;
