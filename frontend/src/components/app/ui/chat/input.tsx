import type { ComponentProps, FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ChatInput2ndWraperUIPropsType = Readonly<{
  children: React.ReactNode;
}>;

const ChatInput2ndWraperUI: FC<ChatInput2ndWraperUIPropsType> = ({
  children,
}) => (
  <div
    className='flex items-center grow px-1 justify-center gap-0.5 border-1 rounded-sm border-input focus-within:border-primary'
    role='presentation'
  >
    {children}
  </div>
);

type ChatInputMainWraperUIPropsType = Readonly<{
  children: ReactNode;
}>;

const ChatInputMainWraperUI: FC<ChatInputMainWraperUIPropsType> = ({
  children,
}) => (
  <div
    className='flex shadow-md-input p-2 gap-0.5 items-center justify-center'
    role='presentation'
  >
    {children}
  </div>
);

type ChatInputUIPropsType = ComponentProps<'input'>;

const ChatInputUI: FC<ChatInputUIPropsType> = ({ className, ...props }) => (
  <input
    className={cn('w-full outline-none border-none', className)}
    placeholder='Type Your Message...'
    {...props}
  />
);

export { ChatInputUI, ChatInput2ndWraperUI, ChatInputMainWraperUI };
