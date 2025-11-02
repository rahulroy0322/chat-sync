import type { FC, ReactNode } from 'react';
import type { ChatType, ChatTypeandTextType } from '@/@types/chat.types';
import type { ChatStatusType } from '@/@types/status.types';
import type { UserType } from '@/@types/user.types';
import Avatar from '@/components/app/ui/avatar';
import { cn } from '@/lib/utils';
import useContacts from '@/store/contact.store';
import StatusIcon from '../status-icon';

type ChatTimePropsType = {
  time: string;
};

type ChatBottomPropsType = {
  time: string;
  status: ChatStatusType | null;
};

type ChatUserNamePropsType = {
  name: string;
};

type ChatContentTextPropsType = {
  text: string;
};

type ChatAvatarPropsType = {
  url: string;
  name: string;
  isOnline: boolean;
};

type ChatContentImgPropsType = {
  src: string;
  text: string | undefined;
};
type ChatContentPropsType = ChatTypeandTextType;

type ChatOtherPropsType = Pick<UserType, 'uname' | 'avatarUrl'> &
  ChatType & {
    isOnline: boolean;
  };

type ChatIndicatorPropsType = {
  isMe: boolean;
};

type ChatContentWrapperPropsType = {
  isMe: boolean;
  isFigure: boolean;
  children: ReactNode;
};

type ChatItemUIPropsType = {
  user: UserType;
  isOnline: boolean;
} & ChatType;

type ChatWrapperPropsType = { children: ReactNode; isFigure: boolean };

const { format } = Intl.DateTimeFormat(undefined, {
  timeStyle: 'short',
});

const ChatTime: FC<ChatTimePropsType> = ({ time }) => (
  <time
    className='text-xs text-muted-foreground'
    dateTime={time}
  >
    {format(new Date(time))}
  </time>
);

const ChatBottom: FC<ChatBottomPropsType> = ({ time, status }) => (
  <div className='flex gap-1.5 items-center justify-end'>
    <ChatTime time={time} />
    {!status ? null : (
      <StatusIcon
        className='size-4 text-muted-foreground'
        status={status}
      />
    )}
  </div>
);

const ChatUserName: FC<ChatUserNamePropsType> = ({ name }) => (
  <h2 className='font-semibold text-md leading-4'>{name}</h2>
);

const ChatContentText: FC<ChatContentTextPropsType> = ({ text }) => (
  <p className='text-sm font-medium text-balance'>{text}</p>
);

const ChatContent: FC<ChatContentPropsType> = ({
  text,
  type,
  // @ts-expect-error
  url = '',
}) => {
  if (type === 'img') {
    return (
      <ChatContentImg
        src={url}
        text={text}
      />
    );
  }
  if (type === 'vid') {
    return null;
  }

  return <ChatContentText text={text as string} />;
};

const ChatContentImg: FC<ChatContentImgPropsType> = ({ text, src }) => (
  <figure className='space-y-1 pt-2'>
    <img
      alt={text}
      className='rounded-xs aspect-video'
      src={src}
    />
    {text ? (
      <figcaption className='text-sm font-light tracking-tight'>
        {text}
      </figcaption>
    ) : null}
  </figure>
);

const ChatAvatar: FC<ChatAvatarPropsType> = ({ name, ...props }) => (
  <Avatar
    alt={name}
    className='size-8'
    {...props}
  />
);

const ChatOther: FC<ChatOtherPropsType> = ({
  avatarUrl,
  uname,
  createdAt,
  isOnline,
  ...props
}) => (
  <ChatWrapper isFigure={props.type !== 'text'}>
    <ChatAvatar
      isOnline={isOnline}
      name={uname}
      url={avatarUrl}
    />
    <ChatContentWrapper
      isFigure={props.type !== 'text'}
      isMe={false}
    >
      <ChatUserName name={uname} />
      <ChatContent {...props} />
      <ChatBottom
        status={null}
        time={createdAt}
      />
    </ChatContentWrapper>
  </ChatWrapper>
);

const ChatMe: FC<ChatOtherPropsType> = ({
  avatarUrl,
  uname,
  createdAt,
  status,
  isOnline,
  ...props
}) => (
  <ChatWrapper isFigure={props.type !== 'text'}>
    <ChatContentWrapper
      isFigure={props.type !== 'text'}
      isMe
    >
      <ChatContent {...props} />
      <ChatBottom
        status={status}
        time={createdAt}
      />
    </ChatContentWrapper>
    <ChatAvatar
      isOnline={isOnline}
      name={uname}
      url={avatarUrl}
    />
  </ChatWrapper>
);

const ChatIndicator: FC<ChatIndicatorPropsType> = ({ isMe }) => (
  <div
    className={cn(
      'absolute bottom-0 w-3 h-4 bg-inherit before:bg-background before:absolute before:inset-0',
      {
        'left-full before:rounded-bl-full': isMe,
        'right-full before:rounded-br-full': !isMe,
      }
    )}
    role='presentation'
  />
);

const ChatContentWrapper: FC<ChatContentWrapperPropsType> = ({
  isFigure,
  children,
  isMe,
}) => (
  <div
    className={cn(
      'relative bg-slate-300 dark:bg-slate-500 rounded-md px-3 py-2 space-y-1',
      {
        'bg-primary! text-primary-foreground!': isMe,
        'rounded-bl-none': !isMe,
        'rounded-br-none': isMe,
        'w-full': isFigure,
      }
    )}
    role='presentation'
  >
    {children}
    <ChatIndicator isMe={isMe} />
  </div>
);

const ChatWrapper: FC<ChatWrapperPropsType> = ({ children, isFigure }) => (
  <div
    className={cn('flex items-end max-w-3/4 lg:max-w-3/5 gap-3.5 p-2', {
      'w-3/4 max-w-sm!': isFigure,
    })}
    role='presentation'
  >
    {children}
  </div>
);

const ChatItemUI: FC<ChatItemUIPropsType> = ({ user, sender, ...props }) => {
  const isMe = sender === user._id;
  const Comp = isMe ? ChatMe : ChatOther;

  const _user = isMe
    ? user
    : useContacts.getState().contacts?.[sender] ||
      ({
        avatarUrl: '/profile.gif',
        _id: 'unknown',
        uname: 'unknown user',
        email: 'unknown@email.com',
      } satisfies UserType);

  return (
    <li
      className={cn('w-full overflow-hidden', {
        'flex justify-end-safe': isMe,
      })}
    >
      <Comp
        avatarUrl={_user.avatarUrl}
        sender={sender}
        uname={_user.uname}
        {...props}
      />
    </li>
  );
};

export default ChatItemUI;
