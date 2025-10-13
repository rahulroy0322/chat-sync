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
  users: UserType[];
} & MessageTypeandTextType;

export type { MessageType, MessageTypeandTextType };
