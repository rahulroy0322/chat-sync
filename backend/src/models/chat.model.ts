import { model, Schema } from 'mongoose';
import type { ChatModelType } from '../@types/chat.types';

const ChatSchema = new Schema<ChatModelType>(
  {
    // @ts-expect-error
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'Sender is required'],
    },
    type: {
      type: String,
      enum: {
        values: ['text', 'img', 'vid'],
        message: '{VALUE} is not a valid type',
      },
      required: [true, 'Type is required'],
    },
    text: {
      type: String,
      required: function () {
        return (this.type as unknown as string) === 'text';
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
        values: ['send', 'read', 'riched'],
        message: '{VALUE} is not a valid status',
      },
      default: 'send',
    },
    editedAt: {
      type: Date,
      default: null,
    },
    // @ts-expect-error
    msgId: {
      type: Schema.Types.ObjectId,
      ref: 'message',
      required: [true, 'Message ID is required'],
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Chat = model<ChatModelType>('chat', ChatSchema);

export default Chat;
