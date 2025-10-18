import type { FC } from 'react';
import ChatHeader from '@/components/app/logic/chat/header';
import ChatInput from '@/components/app/logic/chat/input';
import ChatList from '@/components/app/logic/chat/list';

const ChatPage: FC = () => (
  <div
    className='grow h-full flex flex-col overflow-hidden'
    role='presentation'
  >
    <ChatHeader />

    <ChatList />
    <ChatInput />
  </div>
);

export default ChatPage;
