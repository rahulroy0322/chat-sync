import type { MSGType } from './message.types';
import type { ModelType } from './model.types';
import type { UserType } from './user.types';

type ChatStatusType = 'sent' | 'read' | 'reached';

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
    sender: UserType["_id"];
  receiver: UserType["_id"];
  status: ChatStatusType;
  editedAt: Date | null;
  msgId: MSGType['_id'];

  attached?: string;
} & ChatTypeandTextType;

type ChatModelType = ModelType<ChatType>;

export type { ChatType, ChatStatusType, ChatModelType, ChatTypeandTextType };
