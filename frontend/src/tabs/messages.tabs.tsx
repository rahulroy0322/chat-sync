import type { FC } from 'react';
import MessagesLayoutLogic from '@/components/app/layouts/message.layout';
import ChatPage from '@/pages/chat.page';
import MessagesPage from '@/pages/messages.page';
import useMessages from '@/store/messages.store';
import TabsContent from './main.tabs';

const MessagesTabPage: FC = () => {
  const selected = useMessages((state) => state.selectedMsg);

  return selected ? <ChatPage /> : <MessagesPage />;
};

const MessagesTab: FC = () => {
  return (
    <TabsContent value={'message'}>
      <MessagesLayoutLogic>
        <MessagesTabPage />
      </MessagesLayoutLogic>
    </TabsContent>
  );
};

export default MessagesTab;
