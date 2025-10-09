import type { FC } from 'react';
import Todo from '@/components/app/ui/todo';
import TabsContent from './main.tabs';

const GroupTab: FC = () => {
  return (
    <TabsContent value={'group'}>
      <Todo title='Group Tab' />
    </TabsContent>
  );
};

export default GroupTab;
