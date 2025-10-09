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
  editedAt: string;
  status: ChatStatusType;
  attached?: unknown;
  sender: UserType;
} & ChatTypeandTextType;

export type { ChatType, ChatTypeandTextType };
