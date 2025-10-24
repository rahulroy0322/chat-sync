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
import useChats from '@/store/chat.store';
import useMessages from '@/store/messages.store';
import useUser from '@/store/user.store';
import {
  ChatInputInnerWrapperUI,
  ChatInputMainWrapperUI,
  ChatInputUI,
} from '../../ui/chat/input';
import { sendChat } from '@/api/chat.api';

const ChatInput: FC = () => {
   const msg = useMessages((state) => state.selectedMsg);
  const isSending = useChats((state) => state.isSending);
  const [text, setText] = useState('');

  const isSendDisabled = useMemo(() => {
    return !text || isSending;
  }, [isSending, text]);

  const handleMsgSubmit = () => {
    if (!text.trim()) return;
    const userId = useUser.getState().user?._id;

    if (!userId || !msg) {
      return;
    }

    sendChat({
      msg,
      userId,
      text,
    });
    setText('');
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key.toString().toLowerCase() === 'enter') {
      if (e.metaKey || e.ctrlKey) {
        setText('');
        return;
      }
      handleMsgSubmit();
    }
  };

  return (
    <ChatInputMainWrapperUI>
      <ChatInputInnerWrapperUI>
        <Button
          size='icon'
          variant='input'
        >
          <File />
        </Button>
        <ChatInputUI
          onChange={handleInput}
          onKeyUp={handleKeyUp}
          value={text}
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
      </ChatInputInnerWrapperUI>

      <Button
        className={cn({
          'text-primary': !isSendDisabled,
        })}
        disabled={isSendDisabled}
        onClick={handleMsgSubmit}
        size='icon'
        variant='input'
      >
        {isSending ? (
          <LoaderPinwheel className='animate-spin animation-duration-[750ms]' />
        ) : (
          <Send />
        )}
      </Button>
    </ChatInputMainWrapperUI>
  );
};



export default ChatInput;
