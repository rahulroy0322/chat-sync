'use client';
import type { FC } from 'react';
import { openSetting } from '@/store/messages.store';
import ChatHeaderUI from '../../ui/chat/header';

const avatarUrl = '/worker.gif',
  uName = 'username';
const date = '2022-10-04T13:45:41.869Z';

const ChatHeader: FC = () => {
  const handleHeaderClick = () => {
    // biome-ignore lint/suspicious/noConsole:  c jxanscxlkna
    console.log('opening setting');
    openSetting();
  };
  return (
    <ChatHeaderUI
      avatarUrl={avatarUrl}
      lastSeen={date}
      name={uName}
      onClick={handleHeaderClick}
    />
  );
};

export default ChatHeader;
