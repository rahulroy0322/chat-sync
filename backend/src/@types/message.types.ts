import type { ChatType } from './chat.types';
import type { ModelType } from './model.types';
import type { UserType } from './user.types';

type MSGType = {
  _id: string;
  createdBy: UserType['_id'];
  users: UserType['_id'][];
  lastChat: ChatType['_id'] | null;
};

type CreateMsgSchemaType = {
  uid: string;
};

type MSGModelType = ModelType<MSGType>;

export type { MSGType, MSGModelType, CreateMsgSchemaType };
