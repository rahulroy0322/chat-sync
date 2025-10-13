import { type FC, useEffect } from 'react';
import ChatHeader from '@/components/app/logic/chat/header';
import ChatInput from '@/components/app/logic/chat/input';
import ChatList from '@/components/app/logic/chat/list';
import useChats, { fetchChats } from '@/store/chat.store';
import useMessages from '@/store/messages.store';

const ChatPage: FC = () => {
  const id = useMessages((state) => state.selectedMsg);
  const isLoading = useChats((state) => state.isLoading);

  useEffect(() => {
    if (id) {
      fetchChats(id);
    }
  }, [id]);

  if (isLoading) {
    return 'loading...';
  }

  return (
    <div
      className='grow h-full flex flex-col overflow-hidden'
      role='presentation'
    >
      <ChatHeader />

      <ChatList />
      <ChatInput />
    </div>
  );
};

export default ChatPage;
