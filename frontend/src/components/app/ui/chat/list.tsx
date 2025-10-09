import type { FC, ReactNode } from 'react';

type ChatListUiPropsType = {
  children: ReactNode;
};

const ChatListUI: FC<ChatListUiPropsType> = ({ children }) => (
  <div
    className='grow overflow-auto flex flex-col'
    role='presentation'
  >
    <ul className='mt-auto'>{children}</ul>
  </div>
);
export default ChatListUI;
