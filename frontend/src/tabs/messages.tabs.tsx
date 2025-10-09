import type { FC } from 'react';
import MessagesLayoutLogic from '@/components/app/layouts/message.layout';
import ChatPage from '@/pages/chat.page';
import MessagesPage from '@/pages/messages.page';
import useMessages from '@/store/messages.store';
import TabsContent from './main.tabs';

const MessagesTab: FC = () => {
  const selected = useMessages((state) => state.selectedMsg);
  return (
    <TabsContent value={'message'}>
      <MessagesLayoutLogic>
        {selected ? <ChatPage /> : <MessagesPage />}
      </MessagesLayoutLogic>
    </TabsContent>
  );
};

export default MessagesTab;
