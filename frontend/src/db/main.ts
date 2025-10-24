import Dexie, { type EntityTable } from 'dexie';
import type { ChatType } from '@/@types/chat.types';
import type { MessageType } from '@/@types/message.types';
import type { UserType } from '@/@types/user.types';

// Todo
const db = new Dexie('TestDb') as Dexie & {
  messages: EntityTable<MessageType, '_id'>;
  contacts: EntityTable<UserType, '_id'>;
  chats: EntityTable<ChatType, '_id'>;
};

db.version(1).stores({
  messages: '_id,userId,lastMsgId',
  contacts: '_id,uname,avatarUrl',
  chats: '_id,createdAt,status,sender,receiver,type,text,url,editedAt',
});

export { db };
