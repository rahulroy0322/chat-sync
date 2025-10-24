import type { Abortable } from 'node:events';
import {
  Error as DbError,
  type FilterQuery,
  type ProjectionType,
  type QueryOptions,
  Types,
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

const validateId = (id: string) => {
  try {
    return new Types.ObjectId(id);
  } catch {
    return new Types.ObjectId();
  }
};

const updateOrCreateChats = async (
  data: ChatType[]
): DbResType<ChatType[], null> => {
  try {
    const { operations, ids } = data.reduce(
      (acc, chat) => {
        const id = validateId(chat._id);
        acc.operations.push({
          updateOne: {
            // ! todo
            filter: { _id: id },
            update: { $set: chat },
            upsert: true,
          },
        });
        acc.ids.push(id);
        return acc;
      },
      {
        operations: [] as {
          updateOne: {
            filter: { _id: Types.ObjectId };
            update: { $set: ChatType };
            upsert: true;
          };
        }[],
        ids: [] as Types.ObjectId[],
      }
    );

    await Chat.bulkWrite(operations);

    return await Chat.find({ _id: { $in: ids } });
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

// const findChatsByMsgId = async (id: string): DbResType<ChatType[], null> =>
//   await findChats({
//     msgId: id,
//   });

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

const updateChats = async (chats: ChatType[]): DbResType<ChatType[], null> => {
  try {
    const { ids, ops } = chats.reduce(
      (acc, { _id: id, ...chat }) => {
        const _id = new Types.ObjectId(id);

        acc.ops.push({
          updateOne: {
            filter: { _id },
            update: chat,
            upsert: false,
          },
        });

        return acc;
      },
      { ids: [], ops: [] } as {
        ops: {
          updateOne: {
            filter: { _id: Types.ObjectId };
            update:
              | Omit<ChatType, '_id'>
              | {
                  $set: Partial<ChatType>;
                };
            upsert: boolean;
          };
        }[];
        ids: Types.ObjectId[];
      }
    );

    await Chat.bulkWrite(ops);

    return await Chat.find({
      _id: {
        $in: ids,
      },
    });
  } catch (e) {
    if (e instanceof DbError) {
      return {
        error: e,
      };
    }

    return null;
  }
};

export {
  updateChats,
  createChat,
  findChats,
  // findChatsByMsgId,
  updateOrCreateChats,
};
