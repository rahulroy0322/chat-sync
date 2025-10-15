import type { FC, ReactNode } from 'react';

type ChatListUIPropsType = {
  children: ReactNode;
};

const ChatListUI: FC<ChatListUIPropsType> = ({ children }) => (
  <div
    className='grow overflow-auto flex flex-col'
    role='presentation'
  >
    <ul className='mt-auto'>{children}</ul>
  </div>
);
export default ChatListUI;
