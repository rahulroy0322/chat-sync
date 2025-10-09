import { type FC, useEffect, useRef } from 'react';
import useChats from '@/store/chat.store';
import useUser from '@/store/user.store';
import ChatListUI from '../../ui/chat/list';
import ChatItem from './item';

const ChatList: FC = () => {
  const endRef = useRef<HTMLSpanElement>(null);
  const chats = useChats((state) => state.chats);
  const user = useUser((state) => state.user);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Because of go to the last
  useEffect(() => {
    if (!endRef.current) {
      return;
    }

    endRef.current.scrollIntoView({
      behavior: 'smooth',
    });
  }, [chats]);

  if (!user) {
    return null;
  }

  return (
    <ChatListUI>
      {chats.map((chat) => (
        <ChatItem
          user={user}
          {...chat}
          key={chat._id}
        />
      ))}
      <span
        className='block'
        ref={endRef}
      />
    </ChatListUI>
  );
};

export default ChatList;
