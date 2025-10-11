import { Error as DbError, Types } from 'mongoose';
import type { DbResType } from '../@types/db.types';
import type { MSGType } from '../@types/message.types';
import Msg from '../models/message.model';

const findMsgByID = async (id: string): Promise<DbResType<MSGType, null>> => {
  try {
    return (await Msg.findById(id))?.toJSON() as MSGType;
  } catch (e) {
    if (e instanceof DbError) {
      return {
        error: e,
      };
    }

    return null;
  }
};

const findMsgsByUId = async (
  uid: string
): Promise<DbResType<MSGType[], null>> => {
  try {
    return await Msg.find({
      users: new Types.ObjectId(uid),
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

export { findMsgByID, findMsgsByUId };
