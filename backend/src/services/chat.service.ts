import type { Abortable } from 'node:events';
import {
  Error as DbError,
  type FilterQuery,
  type ProjectionType,
  type QueryOptions,
  type UpdateQuery,
} from 'mongoose';
import type { ChatModelType, ChatType } from '../@types/chat.types';
import type { DbResType } from '../@types/db.types';
import Chat from '../models/chat.model';

const createChat = async (data: ChatType): DbResType<ChatType, null> => {
  try {
    return (await Chat.create(data))?.toJSON();
  } catch (e) {
    if (e instanceof DbError) {
      return {
        error: e,
      };
    }

    return null;
  }
};

const findChats = async (
  where: FilterQuery<ChatType>,
  projection?: ProjectionType<ChatType>,
  options?: QueryOptions<ChatModelType> & { lean: true } & Abortable
): DbResType<ChatType[], null> => {
  try {
    return await Chat.find(where, projection, options);
  } catch (e) {
    if (e instanceof DbError) {
      return {
        error: e,
      };
    }

    return null;
  }
};

const findChatsByMsgId = async (id: string): DbResType<ChatType[], null> =>
  await findChats({
    msgId: id,
  });

// const findOneAndUpdate = async (
//   where: FilterQuery<ChatType>,
//   data: UpdateQuery<ChatType>
// ): DbResType<ChatType, null> => {
//   try {
//     return (
//       await Chat.findOneAndUpdate(where, data, {
//         new: true,
//       }).populate('sender')
//     )?.toJSON() as ChatType;
//   } catch (e) {
//     if (e instanceof DbError) {
//       return {
//         error: e,
//       };
//     }

//     return null;
//   }
// };

const updateChats = async (
  where: FilterQuery<ChatType>,
  data: UpdateQuery<ChatType>
): DbResType<ChatType[], null> => {
  try {
    await Chat.updateMany(where, data);

    return await Chat.find(where);
  } catch (e) {
    if (e instanceof DbError) {
      return {
        error: e,
      };
    }

    return null;
  }
};

export { updateChats, createChat, findChats, findChatsByMsgId };
