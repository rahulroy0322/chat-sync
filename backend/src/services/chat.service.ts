import { Error as DbError, type FilterQuery, type UpdateQuery } from 'mongoose';
import type { ChatType } from '../@types/chat.types';
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

const findChatsByMsgId = async (id: string): DbResType<ChatType[], null> => {
  try {
    return await Chat.find({
      msgId: id,
    }).populate('sender');
  } catch (e) {
    if (e instanceof DbError) {
      return {
        error: e,
      };
    }

    return null;
  }
};

const findOneAndUpdate = async (
  where: FilterQuery<ChatType>,
  data: UpdateQuery<ChatType>
): DbResType<ChatType, null> => {
  try {
    return (
      await Chat.findOneAndUpdate(where, data, {
        new: true,
      }).populate('sender')
    )?.toJSON() as ChatType;
  } catch (e) {
    if (e instanceof DbError) {
      return {
        error: e,
      };
    }

    return null;
  }
};

export { findOneAndUpdate, createChat, findChatsByMsgId };
