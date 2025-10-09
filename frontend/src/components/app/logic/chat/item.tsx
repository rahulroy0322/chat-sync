'use client';
import type { FC } from 'react';
import type { ChatType } from '@/@types/chat.types';
import type { UserType } from '@/@types/user.types';
import ChatItemUI from '../../ui/chat/item';

type ChatItemPropsType = {
  user: UserType;
} & ChatType;

// TODO!

const ChatItem: FC<ChatItemPropsType> = ({ ...props }) => {
  return <ChatItemUI {...props} />;
};

export default ChatItem;
