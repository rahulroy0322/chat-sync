import type { ComponentProps, FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ChatInputInnerWrapperUIPropsType = Readonly<{
  children: ReactNode;
}>;

type ChatInputMainWrapperUIPropsType = Readonly<{
  children: ReactNode;
}>;

type ChatInputUIPropsType = ComponentProps<'input'>;

const ChatInputInnerWrapperUI: FC<ChatInputInnerWrapperUIPropsType> = ({
  children,
}) => (
  <div
    className='flex items-center grow px-1 justify-center gap-0.5 border rounded-sm border-input focus-within:border-primary'
    role='presentation'
  >
    {children}
  </div>
);

const ChatInputMainWrapperUI: FC<ChatInputMainWrapperUIPropsType> = ({
  children,
}) => (
  <div
    className='flex shadow-md-input p-2 gap-0.5 items-center justify-center'
    role='presentation'
  >
    {children}
  </div>
);

const ChatInputUI: FC<ChatInputUIPropsType> = ({ className, ...props }) => (
  <input
    className={cn('w-full outline-none border-none', className)}
    placeholder='Type Your Message...'
    type='text'
    {...props}
  />
);

export { ChatInputUI, ChatInputMainWrapperUI, ChatInputInnerWrapperUI };
