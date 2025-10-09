import type { FC } from 'react';
import Todo from '@/components/app/ui/todo';
import TabsContent from './main.tabs';

const CallTab: FC = () => {
  return (
    <TabsContent value={'call'}>
      <Todo title='Call Tab' />
    </TabsContent>
  );
};

export default CallTab;
