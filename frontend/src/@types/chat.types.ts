import type { MessageType } from './message.types';
import type { ChatStatusType } from './status.types';
import type { UserType } from './user.types';

type ChatTypeandTextType =
  | {
      type: 'img' | 'vid';
      url: string;
      text?: string;
    }
  | {
      text: string;
      type: 'text';
    };

type ChatType = {
  _id: string;
  createdAt: string;
  editedAt: string | null;
  status: ChatStatusType;
  attached?: unknown;
  sender: UserType['_id'];
  receiver: UserType['_id'];
  msgId: MessageType['_id'];
} & ChatTypeandTextType;

export type { ChatType, ChatTypeandTextType };
