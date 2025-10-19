import { model, Schema } from 'mongoose';
import type {
  ChatModelType,
  ChatStatusType,
  ChatTypeandTextType,
} from '../@types/chat.types';
import { models } from './main';

const ChatSchema = new Schema<ChatModelType>(
  {
    type: {
      type: String,
      enum: {
        values: ['text', 'img', 'vid'] satisfies ChatTypeandTextType['type'][],
        message: '{VALUE} is not a valid type',
      },
      required: [true, 'Type is required'],
    },
    text: {
      type: String,
      required: function () {
        return this.type === 'text';
      },
    },
    url: {
      type: String,
      required: function () {
        const type = this.type as unknown as string;
        return type === 'img' || type === 'vid';
      },
      validate: {
        validator: (url: string) => {
          if (!url) return true;
          return /^https?:\/\/.+/.test(url);
        },
        message: 'Invalid URL format',
      },
    },
    status: {
      type: String,
      enum: {
        values: ['sent', 'read', 'reached'] satisfies ChatStatusType[],
        message: '{VALUE} is not a valid status',
      },
      default: 'sent',
    },
    editedAt: {
      type: Date,
      default: null,
    },
    // @ts-expect-error
    msgId: {
      type: Schema.Types.ObjectId,
      ref: models.msg,
      required: [true, 'Message ID is required'],
      index: true,
    },
    // @ts-expect-error
    sender: {
      type: Schema.Types.ObjectId,
      ref: models.user,
      required: [true, 'Sender is required'],
    },
    // @ts-expect-error
    receiver: {
      type: Schema.Types.ObjectId,
      ref: models.user,
      required: [true, 'Receiver is required'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Chat = model<ChatModelType>(models.chat, ChatSchema);

export default Chat;
