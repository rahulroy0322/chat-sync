import J from 'joi';
import type { ChatStatusType, ChatType } from '../@types/chat.types';

const statuses = ['send', 'read', 'riched'] satisfies ChatStatusType[];

const statusSchema = J.string<ChatStatusType[]>()
  .valid(...statuses)
  .messages({
    'any.only': `Status must be one of: ${statuses.join(', ')}`,
    'any.required': 'Status is required',
  });

const baseChatSchema = {
  status: statusSchema.default('send' satisfies ChatStatusType),
};

// Text message schema
const textChatSchema = J.object({
  ...baseChatSchema,
  type: J.string().valid('text').required(),
  text: J.string().min(1).max(5000).required().messages({
    'string.empty': 'Text cannot be empty',
    'string.min': 'Text must be at least 1 character',
    'string.max': 'Text cannot exceed 5000 characters',
    'any.required': 'Text is required for text messages',
  }),
});

// Image message schema
const imageChatSchema = J.object({
  ...baseChatSchema,
  type: J.string().valid('img').required(),
  url: J.string().uri().required().messages({
    'string.uri': 'Invalid image URL',
    'any.required': 'URL is required for image messages',
  }),
  text: J.string().max(1000).optional().messages({
    'string.max': 'Caption cannot exceed 1000 characters',
  }),
});

const videoChatSchema = J.object({
  ...baseChatSchema,
  type: J.string().valid('vid').required(),
  url: J.string().uri().required().messages({
    'string.uri': 'Invalid video URL',
    'any.required': 'URL is required for video messages',
  }),
  text: J.string().max(1000).optional().messages({
    'string.max': 'Caption cannot exceed 1000 characters',
  }),
});

const createChatSchema = J.alternatives<ChatType>().try(
  textChatSchema,
  imageChatSchema,
  videoChatSchema
);
// .messages({
//   'alternatives.match': 'Invalid chat format',
// });

export { createChatSchema };
