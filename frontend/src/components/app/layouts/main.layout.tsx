import type { UpdateSpec } from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';
import { type FC, useEffect } from 'react';
import type { ChatType } from '@/@types/chat.types';
import type { MessageType } from '@/@types/message.types';
import type { UserType } from '@/@types/user.types';
import { updateChats } from '@/api/chat.api';
import { req } from '@/api/main';
import { Tabs } from '@/components/ui/tabs';
import { db } from '@/db/main';
import { setChats } from '@/store/chat.store';
import { setContacts } from '@/store/contact.store';
import useSocket from '@/store/io.store';
import { setMsgId } from '@/store/messages.store';
import useUser from '@/store/user.store';
import CallTab from '@/tabs/call.tabs';
import GroupTab from '@/tabs/group.tabs';
import MessagesTab from '@/tabs/messages.tabs';
import SettingsTab from '@/tabs/settings.tabs';
import SideBar from '../logic/sidebar';
import Socket from '../logic/socket';
import type { SideBarUITabsKeysType } from '../ui/sidebar';

const SyncMessages: FC = () => {
  const messaages = useLiveQuery(() => db.messages.toArray());

  useEffect(() => {
    if (!messaages) {
      return;
    }
    const syncLastChats = async () => {
      const msgIds = messaages
        .map(({ lastMsgId }) => lastMsgId)
        .filter((id) => typeof id === 'string');

      const chats = await db.chats.where('_id').anyOf(msgIds).toArray();

      const _chats: Record<string, ChatType> = {};

      chats.forEach((chat) => {
        _chats[chat._id] = chat;
      });

      setChats(_chats);
    };

    syncLastChats();
  }, [messaages]);

  return null;
};

const SyncContact: FC = () => {
  const contacts = useLiveQuery(() => db.contacts.toArray());

  useEffect(() => {
    if (!contacts) {
      return;
    }

    const _contacts: Record<string, UserType> = {};

    contacts.forEach((contact) => {
      _contacts[contact._id] = contact;
    });

    setContacts(_contacts);
  }, [contacts]);

  return null;
};

const SyncToStore: FC = () => (
  <>
    <SyncContact />
    <SyncMessages />
  </>
);

const getNewUsers = (dbUsers: UserType[], apiUsers: UserType[]) => {
  if (dbUsers.length === apiUsers.length) {
    return [];
  }

  const userId = useUser.getState().user?._id;
  if (!userId) {
    return [];
  }

  const dbUsersIds = new Set<string>();

  dbUsers.forEach(({ _id }) => {
    dbUsersIds.add(_id);
  });

  return apiUsers.filter(({ _id }) => _id !== userId && !dbUsersIds.has(_id));
};

const CreateNewChatsToDb: FC = () => {
  const failedChats = useLiveQuery(() =>
    db.chats
      .where({
        status: 'failed',
      } satisfies Partial<ChatType>)
      .toArray()
  );

  useEffect(() => {
    const cont = new AbortController();

    const abort = () => {
      cont.abort();
    };

    if (!failedChats || !failedChats.length) {
      return abort;
    }

    //  ? TODO create chats(failed) to the backend

    // const createChatsToDb = () => {
    //   const chats = await db.chats
    //     .where({
    //       status: "failed",
    //     } satisfies Partial<ChatType>)
    //     .toArray();
    // };

    //   const getAllChats = async () => {
    //     const user = useUser.getState().user;
    //     if (!user) {
    //       return abort;
    //     }
    //     try {
    //       const { chats, users } = await req<{
    //         chats: ChatType[];
    //         users: UserType[];
    //       }>("/chat/", undefined, cont.signal);

    //       const existUsers = await db.contacts
    //         .where("_id")
    //         .anyOf(users.map(({ _id }) => _id))
    //         .toArray();

    //       const newUsers = getNewUsers(existUsers, users);

    //       if (newUsers.length) {
    //         await db.contacts.bulkAdd(newUsers);
    //         await db.messages.bulkAdd(
    //           newUsers.map(
    //             ({ _id }) =>
    //               ({
    //                 _id,
    //                 lastMsgId: null,
    //                 userId: _id,
    //               } satisfies MessageType)
    //           )
    //         );
    //       }

    //       const { newChats, oldMessages, lastChats } = chats.reduce(
    //         (acc, value) => {
    //           if (value.status === "sent" && user._id === value.receiver) {
    //             acc.newChats.push(value);
    //           } else {
    //             acc.oldMessages.push({
    //               key: value._id,
    //               changes: value,
    //             });
    //           }

    //           const msgid = value.sender === user._id ? user._id : value.receiver;
    //           const msg = acc.lastChats[msgid];

    //           if (!msg) {
    //             acc.lastChats[msgid] = {
    //               key: msgid,
    //               changes: {
    //                 lastMsgId: value._id,
    //               },
    //             };
    //           } else {
    //             // ! TODO
    //             acc.lastChats[msgid] = {
    //               key: msgid,
    //               changes: {
    //                 lastMsgId: value._id,
    //               },
    //             };
    //           }

    //           return acc;
    //         },
    //         {
    //           newChats: [],
    //           oldMessages: [],
    //           lastChats: {},
    //         } as {
    //           newChats: ChatType[];
    //           oldMessages: {
    //             key: string;
    //             changes: UpdateSpec<MessageType>;
    //           }[];
    //           lastChats: Record<
    //             string,
    //             {
    //               key: string;
    //               changes: UpdateSpec<MessageType>;
    //             }
    //           >;
    //         }
    //       );

    //       if (newChats.length) {
    //         const { chats } = await req<{
    //           chats: ChatType[];
    //         }>(
    //           "/chat/",
    //           {
    //             method: "PATCH",
    //             body: {
    //               chats: newChats.map(
    //                 (chat) =>
    //                   ({
    //                     ...chat,
    //                     status: "reached",
    //                   } satisfies ChatType)
    //               ),
    //             },
    //           },
    //           cont.signal
    //         );

    //         await db.chats.bulkAdd(chats);
    //       }

    //       await db.chats.bulkUpdate(oldMessages);
    //       await db.messages.bulkUpdate(Object.values(lastChats));
    //     } catch (e) {
    //       console.error("error: -> ", e);
    //     }
    //   };

    //   getAllChats();

    return abort;
  }, [failedChats]);

  return null;
};

const SyncChatsStatusToDb: FC = () => {
  const user = useUser((state) => state.user);

  const chats = useLiveQuery(() => {
    if (!user) {
      return [];
    }

    return db.chats
      .where('receiver')
      .equals(user._id)
      .and((chat) => chat.status === 'sent')
      .toArray();
  });

  useEffect(() => {
    const cont = new AbortController();
    const abort = () => {
      cont.abort();
    };

    if (!chats || !chats.length) {
      return abort;
    }

    const syncStatus = async () => {
      const updatedChats = chats.map(
        (chat) =>
          ({
            ...chat,
            status: 'reached',
          }) satisfies ChatType
      );
      await updateChats(updatedChats);

      const io = useSocket.getState().io;

      if (!io) {
        return;
      }

      updatedChats.forEach((chat) => {
        io?.emit('chat-status', chat.sender, chat);
      });
    };

    syncStatus();

    return abort;
  }, [chats]);

  return null;
};

const SyncToDb: FC = () => {
  useEffect(() => {
    const cont = new AbortController();
    const abort = () => {
      cont.abort();
    };

    const getAllChats = async () => {
      const user = useUser.getState().user;
      if (!user) {
        return abort;
      }
      try {
        const { chats, users } = await req<{
          chats: ChatType[];
          users: UserType[];
        }>('/chat/', undefined, cont.signal);

        const existUsers = await db.contacts
          .where('_id')
          .anyOf(users.map(({ _id }) => _id))
          .toArray();

        const newUsers = getNewUsers(existUsers, users);

        if (newUsers.length) {
          await db.contacts.bulkAdd(newUsers);
          await db.messages.bulkAdd(
            newUsers.map(
              ({ _id }) =>
                ({
                  _id,
                  lastMsgId: null,
                }) satisfies MessageType
            )
          );
        }

        const lastChats = chats.reduce(
          (acc, value) => {
            const msgid = value.sender === user._id ? user._id : value.receiver;
            const msg = acc[msgid];

            if (!msg) {
              acc[msgid] = {
                key: msgid,
                changes: {
                  _id: msgid,
                  lastMsgId: value._id,
                },
              };
            } else {
              // ! TODO
              acc[msgid] = {
                key: msgid,
                changes: {
                  _id: msgid,
                  lastMsgId: value._id,
                },
              };
            }

            return acc;
          },
          {} as Record<
            string,
            {
              key: string;
              changes: UpdateSpec<MessageType>;
            }
          >
        );

        // TODO!
        await db.messages.bulkUpdate(Object.values(lastChats));

        await db.transaction('rw', 'chats', async (t) => {
          try {
            return await Promise.all(
              chats.map((chat) => t.chats.upsert(chat._id, chat))
            );
          } catch {
            t.abort();
          }
        });
      } catch (e) {
        console.error('error: -> ', e);
      }
    };

    getAllChats();

    return abort;
  }, []);

  return <SyncChatsStatusToDb />;
};

const MainLayoutImpl: FC = () => {
  const handleValueChange = (value: SideBarUITabsKeysType) => {
    if (value) {
      setMsgId(null);
    }
  };
  return (
    <Tabs
      className='h-screen w-screen flex flex-row items-start gap-0'
      defaultValue={'message' satisfies SideBarUITabsKeysType}
      onValueChange={handleValueChange as unknown as () => void}
      orientation='vertical'
    >
      <SideBar />

      <MessagesTab />
      <GroupTab />
      <CallTab />
      <SettingsTab />
    </Tabs>
  );
};

const MainLayout: FC = () => {
  return (
    <>
      <MainLayoutImpl />
      <SyncToStore />
      <SyncToDb />
      <CreateNewChatsToDb />
      <Socket />
    </>
  );
};

export default MainLayout;
