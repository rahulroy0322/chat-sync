import Dexie, { type EntityTable } from 'dexie';
import type { ChatType } from '@/@types/chat.types';
import type { MessageType } from '@/@types/message.types';
import type { UserType } from '@/@types/user.types';

const db = new Dexie('TestDb') as Dexie & {
  contacts: EntityTable<UserType, '_id'>;
  messages: EntityTable<MessageType, '_id'>;
  chats: EntityTable<ChatType, '_id'>;
};

db.version(1).stores({
  messages: '_id,users,lastChat',
  contacts: '_id,uname,avatarUrl',
  chats: '_id,createdAt,editedAt,status,sender,msgId,type,text,url',
});

export { db };
