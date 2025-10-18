import { type FC, useEffect, useMemo } from 'react';
import type { ChatType } from '@/@types/chat.types';
import type { UserType } from '@/@types/user.types';
import { updateToReachedChat, updateToReadChat } from '@/api/chat';
import { addChat, updateChats } from '@/store/chat.store';
import useSocket, {
  addOnlineUser,
  connectIO,
  removeOnlineUser,
} from '@/store/io.store';
import useMessages, { updateLastChatToMessage } from '@/store/messages.store';
import useUser from '@/store/user.store';

const handleError = (e: unknown) => {
  console.error('Socket connection error:', e);
};

const Socket: FC = () => {
  const io = useSocket((state) => state.io);

  const token = useUser((state) => state.token);
  const user = useUser((state) => state.user);

  const messages = useMessages((state) => state.messages);
  const selectedMsg = useMessages((state) => state.selectedMsg);

  const contacts = useMemo(() => {
    if (!messages?.length || !user?._id) {
      return [];
    }

    return messages.map(
      ({ users }) => users.find((u) => u._id !== user._id)?._id
    );
  }, [messages, user?._id]);

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
    io?.on('connect_error', handleError);

    return () => {
      io?.off('connect_error', handleError);
    };
  }, [io]);

  useEffect(() => {
    io?.emit('contacts', contacts);
  }, [io, contacts]);

  useEffect(() => {
    const onChat = async (chat: ChatType) => {
      if (!chat) {
        return;
      }
      updateLastChatToMessage(chat);
      let updatedChat: ChatType;
      if (chat.msgId === selectedMsg) {
        addChat(chat);
        updatedChat = await updateToReadChat(chat);
      } else {
        updatedChat = await updateToReachedChat(chat);
      }

      if (updatedChat) {
        updateChats([updatedChat]);
        const uid = useUser.getState().user?._id ?? '';
        const messages = useMessages.getState().messages;

        const otherUser = messages
          ?.find((m) => m._id === updatedChat.msgId)
          ?.users.find((u) => u._id !== uid);

        if (otherUser) {
          io?.emit('chat-status', otherUser._id, updatedChat);
        }
      }
    };

    io?.on('chat', onChat);

    return () => {
      io?.off('chat', onChat);
    };
  }, [io, selectedMsg]);

  useEffect(() => {
    const onChatStatus = (chat: ChatType) => {
      if (!chat) {
        return;
      }

      updateChats([chat]);
      const { messages } = useMessages.getState();

      const message = messages?.find((m) => m.lastChat === chat._id);
      if (message) {
        updateLastChatToMessage(chat);
      }
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
