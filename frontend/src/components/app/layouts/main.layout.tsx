// import type { FC } from 'react';
// import { Tabs } from '@/components/ui/tabs';
// import { setMsgId } from '@/store/messages.store';
// import CallTab from '@/tabs/call.tabs';
// import GroupTab from '@/tabs/group.tabs';
// import MessagesTab from '@/tabs/messages.tabs';
// import SettingsTab from '@/tabs/settings.tabs';
// import SideBar from '../logic/sidebar';
// import Socket from '../logic/socket';
// import type { SideBarUITabsKeysType } from '../ui/sidebar';

// const MainLayout: FC = () => {
//   const handleValueChange = (value: string) => {
//     if (value) {
//       setMsgId(null);
//     }
//   };
//   return (
//     <Tabs
//       className='h-screen w-screen flex flex-row items-start gap-0'
//       defaultValue={'message' satisfies SideBarUITabsKeysType}
//       onValueChange={handleValueChange}
//       orientation='vertical'
//     >
//       <SideBar />

//       <MessagesTab />
//       <GroupTab />
//       <CallTab />
//       <SettingsTab />
//       <Socket />
//     </Tabs>
//   );
// };

import { Tabs } from '@radix-ui/react-tabs';
import { useLiveQuery } from 'dexie-react-hooks';
import { type FC, useEffect, useState } from 'react';
import type { ChatType } from '@/@types/chat.types';
import type { MessageType } from '@/@types/message.types';
import type { UserType } from '@/@types/user.types';
import { syncDb } from '@/db';
import { db } from '@/db/dexie';
import { setChats } from '@/store/chat.store';
import { setContacts } from '@/store/contact.store';
import { setMessages, setMsgId } from '@/store/messages.store';
import useUser from '@/store/user.store';
import CallTab from '@/tabs/call.tabs';
import GroupTab from '@/tabs/group.tabs';
import MessagesTab from '@/tabs/messages.tabs';
import SettingsTab from '@/tabs/settings.tabs';
import SideBar from '../logic/sidebar';
import type { SideBarUITabsKeysType } from '../ui/sidebar';

const SyncStore: FC = () => {
  const users = useLiveQuery(async () => await db.contacts.toArray(), []);
  const chats = useLiveQuery(async () => await db.chats.toArray(), []);
  const messages = useLiveQuery(async () => await db.messages.toArray(), []);

  useEffect(() => {
    if (!messages) {
      setContacts(null);
      return;
    }

    const _messages: Record<MessageType['_id'], MessageType> = {};

    messages.forEach((chat) => {
      _messages[chat._id] = chat;
    });

    setMessages(_messages);
  }, [messages]);

  useEffect(() => {
    if (!chats) {
      setContacts(null);
      return;
    }

    const _chats: Record<UserType['_id'], ChatType> = {};

    chats.forEach((chat) => {
      _chats[chat._id] = chat;
    });

    setChats(_chats);
  }, [chats]);

  useEffect(() => {
    if (!users) {
      setContacts(null);
      return;
    }

    const contacts: Record<UserType['_id'], UserType> = {};

    users.forEach((u) => {
      contacts[u._id] = u;
    });

    setContacts(contacts);
  }, [users]);

  return null;
};

const MainLayoutImpl: FC = () => {
  const handleValueChange = (value: string) => {
    if (value) {
      setMsgId(null);
    }
  };
  return (
    <Tabs
      className='h-screen w-screen flex flex-row items-start gap-0'
      defaultValue={'message' satisfies SideBarUITabsKeysType}
      onValueChange={handleValueChange}
      orientation='vertical'
    >
      <SideBar />
      <MessagesTab />
      <GroupTab />
      <CallTab />
      <SettingsTab />
      {/* <Socket /> */}
    </Tabs>
  );
};

const SyncDb: FC = () => {
  const [isInitialized, setIsInitialized] = useState(false); // just to sync
  const token = useUser((state) => state.token);

  useEffect(() => {
    if (!token || isInitialized) {
      return;
    }

    syncDb();
    setIsInitialized(true);
  }, [token, isInitialized]);

  return null;
};

const MainLayout: FC = () => (
  <>
    <MainLayoutImpl />
    <SyncStore />
    <SyncDb />
  </>
);

export default MainLayout;
