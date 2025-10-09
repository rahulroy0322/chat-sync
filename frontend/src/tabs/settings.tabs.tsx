import type { FC } from 'react';
import Todo from '@/components/app/ui/todo';
import TabsContent from './main.tabs';

const SettingsTab: FC = () => {
  return (
    <TabsContent value={'setting'}>
      <Todo title='Settings Tab' />
    </TabsContent>
  );
};

export default SettingsTab;
