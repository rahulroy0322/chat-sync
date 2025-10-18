import type { ChatType } from './chat.types';
import type { UserType } from './user.types';

type MessageType = {
  _id: string;
  lastChat: ChatType['_id'] | null;
  users: UserType['_id'][];
};

export type { MessageType };
