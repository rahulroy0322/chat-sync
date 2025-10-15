import {
  Headset,
  type LucideIcon,
  MoreVertical,
  Search,
  Video,
} from 'lucide-react';
import type { ComponentProps, FC } from 'react';
import Avatar from '@/components/app/ui/avatar';
import { Button } from '@/components/ui/button';
import Header from '../header';

type HeaderIconPropsType = {
  Icon: LucideIcon;
};

type ChatHeaderUIPropsType = {
  avatarUrl: string;
  uname: string;
  lastSeen: string;
  isOnline: boolean;
} & ComponentProps<'button'>;

const HeaderIcon: FC<HeaderIconPropsType> = ({ Icon }) => (
  <Button
    asChild
    className='size-7 p-1 cursor-pointer'
    disabled
    size='icon'
    variant='ghost'
  >
    <Icon />
  </Button>
);

const ChatHeaderUI: FC<ChatHeaderUIPropsType> = ({
  avatarUrl,
  uname,
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
          alt={uname}
          className='size-8'
          role='button'
          url={avatarUrl}
          {...props}
        />

        <div role='presentation'>
          <h3 className='text-sm font-semibold'>{uname}</h3>
          <p className='font-light text-xs text-muted-foreground'>
            <b className='font-bold'>Last Seen</b> :{' '}
            <span>
              {lastSeen.substring(0, 9)}
              {/* // TODO */}
            </span>
          </p>
        </div>
      </div>

      <div
        className='flex items-center gap-1'
        role='presentation'
      >
        <HeaderIcon Icon={Search} />
        <HeaderIcon Icon={Headset} />
        <HeaderIcon Icon={Video} />
        <HeaderIcon Icon={MoreVertical} />
      </div>
    </div>
  </Header>
);

export default ChatHeaderUI;
