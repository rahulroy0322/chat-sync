import {
  Cog,
  type LucideIcon,
  MessageCircleMore,
  Phone,
  UsersRound,
} from 'lucide-react';
import type { FC, PropsWithChildren } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

const avatarUrl = '/profile.gif',
  uName = 'username';

type SideBarTabsKeysType = 'message' | 'group' | 'call' | 'setting';

type SideBarItemPropsType = PropsWithChildren<{
  value: SideBarTabsKeysType;
  Icon: LucideIcon;
  lable: string;
}>;

const SideBarItem: FC<SideBarItemPropsType> = ({
  children,
  Icon,
  lable,
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
    <span className='text-sm capitalize font-normal'>{lable}</span>
  </TabsTrigger>
);

const SideBar: FC = () => (
  <TabsList className='p-4 border-r flex flex-col gap-2 h-full rounded-none bg-transparent'>
    <Avatar className='size-10'>
      <AvatarImage src={avatarUrl} />
      <AvatarFallback>{uName.at(1)}</AvatarFallback>
    </Avatar>

    <nav className='flex flex-col grow space-y-4'>
      <SideBarItem
        Icon={MessageCircleMore}
        lable='Message'
        value='message'
      />
      <SideBarItem
        Icon={UsersRound}
        lable='Group'
        value='group'
      />
      <SideBarItem
        Icon={Phone}
        lable='Call'
        value='call'
      >
        9+
      </SideBarItem>
    </nav>

    <Separator className='w-full' />
    <SideBarItem
      Icon={Cog}
      lable='Setting'
      value='setting'
    />
  </TabsList>
);

export type { SideBarTabsKeysType };

export default SideBar;
