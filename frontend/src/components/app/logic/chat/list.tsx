import { useLiveQuery } from 'dexie-react-hooks';
import { type FC, useEffect, useMemo, useRef } from 'react';
import type { ChatType } from '@/@types/chat.types';
import type { UserType } from '@/@types/user.types';
import { updateChats } from '@/api/chat.api';
import { db } from '@/db/main';
import useSocket from '@/store/io.store';
import useMessages from '@/store/messages.store';
import useUser from '@/store/user.store';
import ChatListUI from '../../ui/chat/list';
import ChatItem from './item';

type ListImplPropsType = {
  chats: ChatType[];
  user: UserType;
};

const ListImpl: FC<ListImplPropsType> = ({ chats, user }) =>
  chats.map((chat) => (
    <ChatItem
      user={user}
      {...chat}
      key={chat._id}
    />
  ));

const ChatList: FC = () => {
  const endRef = useRef<HTMLSpanElement>(null);

  const selectedMsg = useMessages((state) => state.selectedMsg);

  const chats = useLiveQuery(async () => {
    if (!selectedMsg?._id) {
      return null;
    }

    return await db.chats
      .where('sender')
      .equals(selectedMsg._id)
      .or('receiver')
      .equals(selectedMsg._id)
      .sortBy('createdAt');
  }, [selectedMsg?._id]);

  const unreadChats = useMemo(() => {
    if (!chats || !selectedMsg?._id) {
      return [];
    }
    return chats.filter(({ status, sender }) => {
      if (sender === selectedMsg._id) {
        return false;
      }

      return status !== 'read';
    });
  }, [chats, selectedMsg?._id]);

  const user = useUser((state) => state.user);

  useEffect(() => {
    if (!endRef.current) {
      return;
    }
    if (chats?.length === 0) {
      return;
    }
    endRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [chats]);

  useEffect(() => {
    if (!unreadChats.length) {
      return;
    }

    const syncReadChats = async () => {
      const updatedChats = unreadChats.map(
        (chat) =>
          ({
            ...chat,
            status: 'read',
          }) satisfies ChatType
      );

      await updateChats(updatedChats);

      const io = useSocket.getState().io;

      if (!io) {
        return;
      }

      updatedChats.forEach((chat) => {
        io?.emit('chat-status', chat.sender, chat);
      });
    };

    syncReadChats();
  }, [unreadChats]);

  if (!user || !chats) {
    return null;
  }

  return (
    <ChatListUI>
      {user && chats ? (
        <ListImpl
          chats={chats}
          user={user}
        />
      ) : null}
      <span
        className='block'
        ref={endRef}
      />
    </ChatListUI>
  );
};

export default ChatList;
