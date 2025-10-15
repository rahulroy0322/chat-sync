import { model, Schema } from "mongoose";
import type { MSGModelType } from "../@types/message.types";
import { models } from "./main";

const MsgSchema = new Schema<MSGModelType>(
  {
    // @ts-expect-error
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: models.user,
      required: [true, "Creator is required"],
    },
    lastChat: {
      type: Schema.Types.ObjectId,
      ref: models.chat,
      default: null,
    },
    // @ts-expect-error
    users: {
      type: [Schema.Types.ObjectId],
      ref: "user",
      required: [true, "Users are required"],
      validate: {
        validator: (users: unknown[]) => users.length >= 2,
        message: "At least one user is required",
      },
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Msg = model<MSGModelType>(models.msg, MsgSchema);

export default Msg;
