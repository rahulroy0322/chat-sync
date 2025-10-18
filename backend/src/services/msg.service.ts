import {
  Error as DbError,
  type FilterQuery,
  type ProjectionType,
  type QueryOptions,
  Types,
} from "mongoose";
import type { ChatType } from "../@types/chat.types";
import type { DbResType } from "../@types/db.types";
import type { MSGType } from "../@types/message.types";
import type { UserType } from "../@types/user.types";
import Msg from "../models/message.model";

const findMsg = (
  where: FilterQuery<MSGType>,
  projection?: ProjectionType<MSGType>,
  options?: QueryOptions<MSGType>
) => Msg.find(where, projection, options) as Promise<MSGType[]>;

const findMsgByID = async (id: string): Promise<DbResType<MSGType, null>> => {
  try {
    return (await Msg.findById(new Types.ObjectId(id)))?.toJSON() as MSGType;
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
    return await findMsg({
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
      status: "created" | "find";
      data: MSGType | null;
    },
    null
  >
> => {
  try {
    const msgs = await findMsg(
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

    if (msgs.length) {
      const msg = (
        msgs[0] as { toJSON: () => MSGType | null } | undefined
      )?.toJSON();
      if (msg) {
        return {
          status: "find",
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
        status: "created",
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

const updateLastChat = async (
  msgId: string,
  chatId: string
): Promise<
  DbResType<MSGType & { lastChat: ChatType | null; users: UserType[] }, null>
> => {
  try {
    return (await Msg.findOneAndUpdate(
      {
        _id: msgId,
      },
      {
        lastChat: chatId,
      },
      {
        new: true,
      }
    ).populate(["users", "lastChat"])) as null;
  } catch (e) {
    if (e instanceof DbError) {
      return {
        error: e,
      };
    }
    return null;
  }
};

export { findMsgByID, findMsgsByUId, findOrCreateMsg, updateLastChat };
