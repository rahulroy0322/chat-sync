import type { MessageType } from '@/@types/message.types';
import { req } from '@/api/main';
import { db } from './dexie';

const syncMessages = async () => {
  const { messages } = await req<{ messages: MessageType[] }>('msg', undefined);
  return await Promise.all(
    messages.map((msg) => db.messages.upsert(msg._id, msg))
  );
};

// ! TODO ?
const syncContacts = async () => {
  const { users } = await req<{ users: MessageType[] }>('sync/user', undefined);

  return await Promise.all(
    users.map((user) => db.contacts.upsert(user._id, user))
  );
};

const syncChats = async () => {
  const { chats } = await req<{ chats: MessageType[] }>('sync/chat', undefined);

  return await Promise.all(
    chats.map((chat) => db.chats.upsert(chat._id, chat))
  );
};

const tryCatch = async <T>(
  promise: Promise<T>
): Promise<[null, T] | [unknown, null]> => {
  try {
    return [null, await promise];
  } catch (e) {
    return [e, null];
  }
};

const syncDb = async () => {
  const [msgError] = await tryCatch(syncMessages());
  const [chatError] = await tryCatch(syncChats());
  const [userError] = await tryCatch(syncContacts());
  if (msgError) {
    console.error('ERROR: db update messages', msgError);
  }
  if (chatError) {
    console.error('ERROR: db update chats', chatError);
  }
  if (userError) {
    console.error('ERROR: db update users', userError);
  }
};

export { syncDb };
