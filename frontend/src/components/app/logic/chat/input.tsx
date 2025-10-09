'use client';
import {
  CircleUserRound,
  File,
  LoaderPinwheel,
  Mic2,
  Send,
} from 'lucide-react';
import {
  type ChangeEvent,
  type FC,
  type KeyboardEvent,
  useMemo,
  useState,
} from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import useChats, { sendChat } from '@/store/chat.store';
import {
  ChatInput2ndWraperUI,
  ChatInputMainWraperUI,
  ChatInputUI,
} from '../../ui/chat/input';

const ChatInput: FC = () => {
  const isLoading = useChats((state) => state.isLoading || state.isSending);
  const [msg, setMsg] = useState('');

  const isSendDisabled = useMemo(() => {
    return !msg || isLoading;
  }, [isLoading, msg]);

  const handleMsgSubmit = () => {
    if (!msg.trim()) return;
    sendChat(msg);
    setMsg('');
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value);
  };

  const handleUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key.toString().toLowerCase() === 'enter') {
      if (e.metaKey || e.ctrlKey) {
        setMsg('');
      }
      handleMsgSubmit();
    }
  };

  return (
    <ChatInputMainWraperUI>
      <ChatInput2ndWraperUI>
        <Button
          size='icon'
          variant='input'
        >
          <File />
        </Button>
        <ChatInputUI
          onChange={handleInput}
          onKeyUp={handleUp}
          value={msg}
        />
        <Button
          size='icon'
          variant='input'
        >
          <CircleUserRound />
        </Button>

        <Button
          disabled
          size='icon'
          variant='input'
        >
          <Mic2 />
        </Button>
      </ChatInput2ndWraperUI>

      <Button
        className={cn({
          'text-primary': !isSendDisabled,
        })}
        disabled={isSendDisabled}
        onClick={handleMsgSubmit}
        size='icon'
        variant='input'
      >
        {isLoading ? (
          <LoaderPinwheel className='animate-spin animation-duration-[750ms]' />
        ) : (
          <Send />
        )}
      </Button>
    </ChatInputMainWraperUI>
  );
};

export default ChatInput;
