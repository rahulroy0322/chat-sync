import { useLiveQuery } from 'dexie-react-hooks';
import { Search, UserRoundPlus } from 'lucide-react';
import { type FC, type PropsWithChildren, useCallback } from 'react';
import type { ChatType } from '@/@types/chat.types';
import type { MessageType } from '@/@types/message.types';
import type { UserType } from '@/@types/user.types';
import { Button } from '@/components/ui/button';
import { db } from '@/db/main';
import useChats from '@/store/chat.store';
import useContacts from '@/store/contact.store';
import useSocket from '@/store/io.store';
import useMessages, { setMsgId } from '@/store/messages.store';
import useSettings, { setContactOpen } from '@/store/settings.store';
import AddUsersList from '../logic/new-message';
import Avatar from '../ui/avatar';
import HeaderUI from '../ui/header';
import Loading from '../ui/loading';
import StatusIcon from '../ui/status-icon';
import MessagesLayoutLogic from './message-adaptive.layout';

type LayoutLinkPropsType = PropsWithChildren & { msg: MessageType };

const LayoutLink: FC<LayoutLinkPropsType> = ({ msg, children }) => {
  const handleClick = useCallback(() => {
    setMsgId(msg);
  }, [msg]);

  return (
    <button
      className='flex gap-2 items-center p-1 cursor-pointer w-full'
      onClick={handleClick}
      type='button'
    >
      {children}
    </button>
  );
};

type MessageItemPropsType = {
  msg: MessageType;
  lastChat: ChatType | null;
  user: UserType;
  isOnline: boolean;
};

const MessageItem: FC<MessageItemPropsType> = ({
  msg,
  user: { _id: uid, avatarUrl, uname },
  lastChat,
  isOnline,
}) => {
  return (
    <li>
      <LayoutLink msg={msg}>
        <Avatar
          alt={uname}
          className='size-10'
          isOnline={isOnline}
          url={avatarUrl}
        />

        <div
          className='grow'
          role='presentation'
        >
          <h2 className='text-base font-semibold w-fit'>{uname}</h2>
          {!lastChat ? null : (
            <div
              className='flex gap-1 items-center'
              role='presentation'
            >
              <h3 className='line-clamp-1 text-start text-sm grow'>
                {lastChat.text}
              </h3>
              {lastChat.sender === uid ? null : (
                <StatusIcon
                  className={'size-5 p-0.5 shrink-0'}
                  status={lastChat.status}
                />
              )}
            </div>
          )}
        </div>
      </LayoutLink>
    </li>
  );
};

const MessagesList: FC = () => {
  const messages = useLiveQuery(() => db.messages.toArray());

  const contacts = useContacts((state) => state.contacts);
  const chats = useChats((state) => state.chats);

  const onlineUsers = useSocket((state) => state.onlineUsers);

  if (messages === undefined) {
    return <Loading size='base' />;
  }

  return (
    <>
      <ul>
        {messages.map((msg) =>
          !contacts[msg._id] ? null : (
            <MessageItem
              isOnline={onlineUsers.has(msg._id)}
              key={msg._id}
              lastChat={(msg.lastMsgId && chats[msg.lastMsgId]) || null}
              msg={msg}
              user={contacts[msg._id]}
            />
          )
        )}
      </ul>
      <Button
        className='rounded-full cursor-pointer absolute right-5 bottom-5'
        onClick={() => {
          setContactOpen(true);
        }}
        size='icon-lg'
        variant='outline'
      >
        <UserRoundPlus />
      </Button>
    </>
  );
};

const MessagesORUserList: FC = () => {
  const isContactOpen = useSettings((state) => state.isContactOpen);
  if (isContactOpen) {
    return <AddUsersList />;
  }
  return <MessagesList />;
};

type MessagesLayoutPropsType = PropsWithChildren;

const MessagesLayout: FC<MessagesLayoutPropsType> = ({ children }) => {
  const selected = useMessages((state) => state.selectedMsg);

  return (
    <MessagesLayoutLogic
      selected={selected?._id || null}
      side={
        <div
          className='w-full h-full md:basis-80 flex flex-col border-r'
          role='presentation'
        >
          <HeaderUI>
            <div
              className='w-2/3 text-ring placeholder:text-muted-foreground rounded-md focus-within:border-ring flex gap-2 px-3 py-1 border-2 border-input'
              role='presentation'
            >
              <Search />
              <input
                className='outline-none w-full'
                placeholder='Search Chat...'
              />
            </div>
          </HeaderUI>
          <div
            className='grow overflow-auto px-2 relative'
            role='presentation'
          >
            <MessagesORUserList />
          </div>
        </div>
      }
    >
      <main className='grow h-full overflow-hidden'>{children}</main>
    </MessagesLayoutLogic>
  );
};

export default MessagesLayout;
