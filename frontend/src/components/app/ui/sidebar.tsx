import {
  Cog,
  type LucideIcon,
  MessageCircleMore,
  Phone,
  UsersRound,
} from 'lucide-react';
import type { FC, ReactNode } from 'react';
import Avatar from '@/components/app/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

type SideBarUITabsKeysType = 'message' | 'group' | 'call' | 'setting';

type SideBarUIItemPropsType = {
  value: SideBarUITabsKeysType;
  Icon: LucideIcon;
  label: string;
  children?: ReactNode;
};

type SideBarUIPropsType = {
  avatarUrl: string;
  name: string;
};

const SideBarUIItem: FC<SideBarUIItemPropsType> = ({
  children,
  Icon,
  label,
  value,
}) => (
  <TabsTrigger
    className='flex flex-col items-center justify-center gap-1 py-2 rounded-sm text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:text-primary grow-0 !shadow-none p-2 cursor-pointer border-none'
    value={value}
  >
    {children ? (
      <div className='flex relative'>
        <Icon className='size-5' />
        <Badge
          className='aspect-square size-5 rounded-full absolute -top-1/3 -right-1/2 p-1'
          variant='default'
        >
          {children}
        </Badge>
      </div>
    ) : (
      <Icon className='size-5' />
    )}
    <span className='text-sm capitalize font-normal'>{label}</span>
  </TabsTrigger>
);

const SideBarUI: FC<SideBarUIPropsType> = ({ avatarUrl, name }) => (
  <TabsList className='p-4 border-r flex flex-col gap-2 h-full rounded-none bg-transparent'>
    <Avatar
      alt={name}
      className='size-10'
      isOnline
      url={avatarUrl}
    />

    <nav className='flex flex-col grow space-y-4'>
      <SideBarUIItem
        Icon={MessageCircleMore}
        label='Message'
        value='message'
      />
      <SideBarUIItem
        Icon={UsersRound}
        label='Group'
        value='group'
      />
      <SideBarUIItem
        Icon={Phone}
        label='Call'
        value='call'
      >
        9+
      </SideBarUIItem>
    </nav>

    <Separator className='w-full' />
    <SideBarUIItem
      Icon={Cog}
      label='Setting'
      value='setting'
    />
  </TabsList>
);

export type { SideBarUITabsKeysType };

export default SideBarUI;
