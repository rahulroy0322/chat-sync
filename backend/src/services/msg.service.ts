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

const findOrCreateMsg = async (
  uid: string,
  otherUid: string
): Promise<
  DbResType<
    {
      status: 'created' | 'find';
      data: MSGType | null;
    },
    null
  >
> => {
  try {
    const msgs = await Msg.find(
      {
        users: {
          $all: [new Types.ObjectId(uid), new Types.ObjectId(otherUid)],
        },
      },
      undefined,
      {
        limit: 1,
      }
    );

    if (msgs) {
      const msg = msgs[0]?.toJSON() as MSGType;
      if (msg) {
        return {
          status: 'find',
          data: msg,
        };
      }
      return null;
    }

    const msg = (
      await Msg.create({
        createdBy: uid,
        users: [otherUid, uid],
      })
    )?.toJSON();

    if (msg) {
      return {
        status: 'created',
        data: msg,
      };
    }
    return null;
  } catch (e) {
    if (e instanceof DbError) {
      return {
        error: e,
      };
    }
    return null;
  }
};

export { findMsgByID, findMsgsByUId, findOrCreateMsg };
