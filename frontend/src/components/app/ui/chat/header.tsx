import {
  Headset,
  type LucideIcon,
  MoreVertical,
  Search,
  Video,
} from 'lucide-react';
import type { ComponentProps, FC } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Header from '../header';

type HeaderIconPropsType = {
  children: LucideIcon;
};

const HeaderIcon: FC<HeaderIconPropsType> = ({ children: Icon }) => (
  <Button
    className='size-7 p-1 cursor-pointer'
    disabled
    size='icon'
    // asChild
    variant='ghost'
  >
    <Icon />
  </Button>
);

type ChatHeaderUIPropsType = {
  avatarUrl: string;
  name: string;
  lastSeen: string;
} & ComponentProps<'button'>;

const ChatHeaderUI: FC<ChatHeaderUIPropsType> = ({
  avatarUrl,
  name,
  lastSeen,
  ...props
}) => (
  <Header>
    <div
      className='size-full px-2 flex items-center justify-between'
      role='presentation'
    >
      <div
        className='flex items-end gap-1.5'
        role='presentation'
      >
        <Avatar
          className='size-8'
          role='button'
          {...props}
        >
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{name.at(1)}</AvatarFallback>
        </Avatar>

        <div role='presentation'>
          <h3 className='text-sm font-semibold'>{name}</h3>
          <h4 className='font-light text-xs text-muted-foreground'>
            <b className='font-bold'>Last Seen</b> :{' '}
            <span>
              {lastSeen.substring(0, 9)}
              {/* // TODO */}
            </span>
          </h4>
        </div>
      </div>

      <div
        className='flex items-center gap-1'
        role='presentation'
      >
        <HeaderIcon>{Search}</HeaderIcon>
        <HeaderIcon>{Headset}</HeaderIcon>
        <HeaderIcon>{Video}</HeaderIcon>
        <HeaderIcon>{MoreVertical}</HeaderIcon>
      </div>
    </div>
  </Header>
);

export default ChatHeaderUI;
