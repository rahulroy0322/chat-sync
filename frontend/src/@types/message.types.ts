import type { ChatStatusType } from './status.types';
import type { UserType } from './user.types';

type MessageTypeandTextType =
  | {
      type: 'img' | 'vid';
      text?: string;
    }
  | {
      text: string;
      type: 'text';
    };

type MessageType = {
  _id: string;
  // lastMsgAt: string;
  status: ChatStatusType;
  sender: UserType;
  user: UserType;
} & MessageTypeandTextType;

export type { MessageType, MessageTypeandTextType };
