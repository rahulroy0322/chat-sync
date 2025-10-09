import type { FC, ReactNode } from 'react';
import type { ChatType, ChatTypeandTextType } from '@/@types/chat.types';
import type { ChatStatusType } from '@/@types/status.types';
import type { UserType } from '@/@types/user.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import StatusIcon from '../status-icon';

type ChatTimePropsType = {
  time: string;
};

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

type ChatBottomPropsType = {
  time: string;
  status: ChatStatusType;
};

const ChatBottom: FC<ChatBottomPropsType> = ({ time, status }) => (
  <div className='flex gap-1.5 items-center justify-end'>
    <ChatTime time={time} />
    <StatusIcon
      className='text-muted-foreground'
      status={status}
    />
  </div>
);

type ChatUserNamePropsType = {
  name: string;
};

const ChatUserName: FC<ChatUserNamePropsType> = ({ name }) => (
  <h2 className='font-semibold text-md leading-4'>{name}</h2>
);

type ChatContentTextPropsType = {
  text: string;
};

const ChatContentText: FC<ChatContentTextPropsType> = ({ text }) => (
  <p className='text-sm font-medium text-balance'>{text}</p>
);

type ChatContentPropsType = ChatTypeandTextType;

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

type ChatContentImgPropsType = {
  src: string;
  text: string | undefined;
};

const ChatContentImg: FC<ChatContentImgPropsType> = ({ text, src }) => (
  <figure className='space-y-1 pt-2'>
    <img
      alt={text}
      className='rounded-xs aspect-video'
      src={src}
    />
    <figcaption className='text-sm font-light tracking-tight'>
      {text}
    </figcaption>
  </figure>
);

type ChatAvatarPropsType = {
  url: string;
  name: string;
};

const ChatAvatar: FC<ChatAvatarPropsType> = ({ name, url }) => (
  <Avatar className='size-8'>
    <AvatarImage src={url} />
    <AvatarFallback>{name.at(1)}</AvatarFallback>
  </Avatar>
);

type ChatOtherPropsType = Pick<UserType, 'uname' | 'avatarUrl'> & ChatType;

const ChatOther: FC<ChatOtherPropsType> = ({
  avatarUrl,
  uname,
  createdAt,
  status,
  ...props
}) => (
  <ChatWraper isFigure={props.type !== 'text'}>
    <ChatAvatar
      name={uname}
      url={avatarUrl}
    />
    <ChatContentWraper
      isFigure={props.type !== 'text'}
      isMe={false}
    >
      <ChatUserName name={uname} />
      <ChatContent {...props} />
      <ChatBottom
        status={status}
        time={createdAt}
      />
    </ChatContentWraper>
  </ChatWraper>
);

const ChatMe: FC<ChatOtherPropsType> = ({
  avatarUrl,
  uname,
  createdAt,
  status,
  ...props
}) => (
  <ChatWraper isFigure={props.type !== 'text'}>
    <ChatContentWraper
      isFigure={props.type !== 'text'}
      isMe
    >
      <ChatContent {...props} />
      <ChatBottom
        status={status}
        time={createdAt}
      />
    </ChatContentWraper>
    <ChatAvatar
      name={uname}
      url={avatarUrl}
    />
  </ChatWraper>
);

type ChatIndicatorPropsType = {
  isMe: boolean;
};

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

type ChatContentWraperPropsType = {
  isMe: boolean;
  isFigure: boolean;
  children: ReactNode;
};

const ChatContentWraper: FC<ChatContentWraperPropsType> = ({
  isFigure,
  children,
  isMe,
}) => (
  <div
    className={cn(
      'relative bg-slate-300 dark:bg-slate-500 rounded-md px-3 py-2 space-y-1',
      {
        '!bg-primary !text-primary-foreground': isMe,
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

type ChatWraperPropsType = { children: ReactNode; isFigure: boolean };

const ChatWraper: FC<ChatWraperPropsType> = ({ children, isFigure }) => (
  <div
    className={cn('flex items-end max-w-3/4 lg:max-w-3/5 gap-3.5 p-2', {
      'w-3/4 !max-w-sm': isFigure,
    })}
    role='presentation'
  >
    {children}
  </div>
);

type ChatItemUIPropsType = {
  user: UserType;
} & ChatType;

const ChatItemUI: FC<ChatItemUIPropsType> = ({ user, sender, ...props }) => {
  const isMe = sender._id === user._id;
  const Comp = isMe ? ChatMe : ChatOther;

  const _user = isMe ? user : sender;

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
