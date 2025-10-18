import { useLiveQuery } from 'dexie-react-hooks';
import { UserRoundPlus } from 'lucide-react';
import { type FC, type PropsWithChildren, useCallback, useMemo } from 'react';
import type { MessageType } from '@/@types/message.types';
import Avatar from '@/components/app/ui/avatar';
import { Button } from '@/components/ui/button';
import { db } from '@/db/dexie';
import useChats from '@/store/chat.store';
import useContacts from '@/store/contact.store';
import useMessages, { setMsgId } from '@/store/messages.store';
import useSettings, { setContactOpen } from '@/store/settings.store';
import useUser from '@/store/user.store';
import AddUsersList from '../logic/new-message';
import SearchHeaderUI from '../ui/messages/search-header';
import StatusIcon from '../ui/status-icon';
import MessagesLayoutLogic from './message-adaptive.layout';

type LayoutLinkPropsType = PropsWithChildren & {
  id: string;
};

type MessageItemPropsType = MessageType & {
  isOnline: boolean;
};

type MessagesLayoutPropsType = PropsWithChildren;

const LayoutLink: FC<LayoutLinkPropsType> = ({ id, children }) => {
  const handleClick = useCallback(() => {
    setMsgId(id);
  }, [id]);

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

const MessageItem: FC<MessageItemPropsType> = ({
  users,
  _id,
  lastChat,
  isOnline,
}) => {
  const user = useUser((state) => state.user);

  const otherUserId = useMemo(
    () => users.find((u) => u !== user?._id),
    [user?._id, users]
  );

  const contact = useContacts((state) =>
    state.contacts && otherUserId ? state.contacts[otherUserId] : null
  );

  const chat = useChats((state) =>
    state.chats && lastChat ? state.chats[lastChat] : null
  );

  if (!contact) {
    return null;
  }

  const { avatarUrl, uname } = contact;

  return (
    <li>
      <LayoutLink id={_id}>
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
          {!chat ? null : (
            <div
              className='flex gap-1 items-center'
              role='presentation'
            >
              <h3 className='line-clamp-1 text-start text-sm grow'>
                {chat.text}
              </h3>
              {chat.sender !== user?._id ? null : (
                <StatusIcon
                  className='size-5 p-0.5 shrink-0'
                  status={chat.status}
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
  const messages = useLiveQuery(async () => await db.messages.toArray(), []);

  // const isFetching = useMessages((state) => state.isFetching);
  // const onlineUsers = useSocket((state) => state.onlineUsers);
  // const user = useUser((state) => state.user);
  // const token = useUser((state) => state.token);

  // useEffect(() => {
  //   const controller = new AbortController();

  //   const getMessages = async () => {
  //     if (!token) return;
  //     try {
  //       setFetching(true);
  //       const { messages } = await req<{ messages: MessageType[] }>(
  //         "msg",
  //         undefined,
  //         controller.signal
  //       );

  //       setMessages(messages);
  //     } catch (e) {
  //       console.error("ERROR:", e);
  //     } finally {
  //       setFetching(false);
  //     }
  //   };

  //   getMessages();

  //   return () => {
  //     controller.abort();
  //   };
  // }, [token]);

  if (messages === undefined) {
    // TODO!
    return 'fetching';
  }

  // if (!messages || !user) {
  //   // TODO!
  //   return null;
  // }

  return (
    <>
      <ul>
        {messages.map((msg) => (
          <MessageItem
            key={msg._id}
            {...msg}
            isOnline
            // isOnline={onlineUsers.has(
            //   msg.users.find((u) => u._id !== user._id)?._id ?? ""
            // )}
          />
        ))}
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

const MessagesOrUserList: FC = () => {
  const isContactOpen = useSettings((state) => state.isContactOpen);
  if (isContactOpen) {
    return <AddUsersList />;
  }
  return <MessagesList />;
};

const MessagesLayout: FC<MessagesLayoutPropsType> = ({ children }) => {
  const selected = useMessages((state) => state.selectedMsg);

  return (
    <MessagesLayoutLogic
      selected={selected}
      side={
        <div
          className='w-full h-full md:basis-80 flex flex-col border-r'
          role='presentation'
        >
          <SearchHeaderUI />
          <div
            className='grow overflow-auto px-2 relative'
            role='presentation'
          >
            <MessagesOrUserList />
          </div>
        </div>
      }
    >
      <main className='grow h-full overflow-hidden'>{children}</main>
    </MessagesLayoutLogic>
  );
};

export default MessagesLayout;
