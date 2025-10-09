import type { FC, ReactNode } from 'react';
import type { SideBarTabsKeysType } from '@/components/app/ui/sidebar';
import { TabsContent as TC } from '@/components/ui/tabs';

type TabsContentPropsType = {
  value: SideBarTabsKeysType;
  children: ReactNode;
};

const TabsContent: FC<TabsContentPropsType> = ({ children, value }) => (
  <TC
    className='flex items-center justify-center h-full'
    value={value}
  >
    {children}
  </TC>
);

export default TabsContent;
