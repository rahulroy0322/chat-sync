import J from 'joi';
import type { CreateMsgSchemaType } from '../@types/message.types';

const createMsgSchema = J.object<CreateMsgSchemaType>({
  uid: J.string().trim().required(),
});

export { createMsgSchema };
