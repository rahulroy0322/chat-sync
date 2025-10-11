import { Error as DbError } from 'mongoose';
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

export { createChat, findChatsByMsgId };
