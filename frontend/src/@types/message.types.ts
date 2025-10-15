import type { ChatType } from './chat.types';
import type { UserType } from './user.types';

type MessageType = {
  _id: string;
  lastChat: ChatType | null;
  users: UserType[];
};

export type { MessageType };
