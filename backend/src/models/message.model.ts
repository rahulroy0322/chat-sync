import { model, Schema } from 'mongoose';
import type { MSGModelType } from '../@types/message.types';

const MsgSchema = new Schema<MSGModelType>(
  {
    // @ts-ignore
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'Creator is required'],
    },
    // @ts-expect-error
    users: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      required: [true, 'Users are required'],
      validate: {
        validator: (users: unknown[]) => users.length >= 2,
        message: 'At least one user is required',
      },
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Msg = model<MSGModelType>('msg', MsgSchema);

export default Msg;
