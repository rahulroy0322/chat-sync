import { Search } from 'lucide-react';
import { type FC, type PropsWithChildren, useCallback, useEffect } from 'react';
import type {
  MessageType,
  MessageTypeandTextType,
} from '@/@types/message.types';
import type { UserType } from '@/@types/user.types';
import { req } from '@/api/main';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import useMessages, {
  setFetching,
  setMessages,
  setMsgId,
} from '@/store/messages.store';
import HeaderUI from '../ui/header';
import StatusIcon from '../ui/status-icon';
import MessagesLayoutLogic from './message-logic.layout';

type LayoutLinkPropsType = PropsWithChildren & {
  id: string;
};

const LayoutLink: FC<LayoutLinkPropsType> = ({ id, children }) => {
  const handleClick = useCallback(() => {
    setMsgId(id);
  }, [id]);

  return (
    // biome-ignore lint/a11y/useButtonType: is not ay ready button
    <button
      className='flex gap-2 items-center p-1 cursor-pointer w-full'
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

type MassageItemPropsType = {
  avatarUrl: string;
  uName: string;
  uid: UserType['_id'];
} & MessageTypeandTextType &
  Pick<MessageType, 'sender' | 'text' | 'status'>;

const MassageItem: FC<MassageItemPropsType> = ({
  avatarUrl,
  uName,
  status,
  uid,
  // type,
  sender: { _id: sid },
  text,
}) => (
  <li>
    <LayoutLink id={uid}>
      <Avatar className='size-10'>
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{uName}</AvatarFallback>
      </Avatar>
      <div
        className='grow'
        role='presentation'
      >
        <h2 className='text-base font-semibold w-fit'>Army Man</h2>
        <div
          className='flex gap-1 items-center'
          role='presentation'
        >
          <h3 className='line-clamp-1 text-start text-sm grow'>{text}</h3>
          {uid === sid ? null : (
            <StatusIcon
              className={cn('size-5 p-0.5 shrink-0', {
                'text-cyan-500': status === 'read',
              })}
              status={status}
            />
          )}
        </div>
      </div>
    </LayoutLink>
  </li>
);

const MessagesList: FC = () => {
  const messages = useMessages((state) => state.messages);

  const isFetching = useMessages((state) => state.isFetching);

  useEffect(() => {
    const cont = new AbortController();

    const getMessages = async () => {
      try {
        setFetching(true);
        const { messages } = await req<{ messages: MessageType[] }>(
          'msg',
          undefined,
          cont.signal
        );

        setMessages(messages);
      } catch (e) {
        console.error('ERROR:', e);
      } finally {
        setFetching(false);
      }
    };

    getMessages();

    return () => {
      cont.abort();
    };
  }, []);

  if (isFetching) {
    // TODO!
    return 'fetching';
  }

  if (!messages) {
    // TODO!
    return null;
  }

  return (
    <ul>
      {messages.map(
        ({ _id, user: { avatarUrl, uname, _id: uid }, ...props }) => (
          <MassageItem
            avatarUrl={avatarUrl}
            key={_id}
            uid={uid}
            uName={uname}
            {...props}
          />
        )
      )}
    </ul>
  );
};

type MessagesLayoutPropsType = PropsWithChildren;

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
            className='grow overflow-auto px-2'
            role='presentation'
          >
            <MessagesList />
          </div>
        </div>
      }
    >
      <main className='grow h-full overflow-hidden'>{children}</main>
    </MessagesLayoutLogic>
  );
};

export default MessagesLayout;
