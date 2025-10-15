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
import useSocket from '@/store/io.store';
import useMessages from '@/store/messages.store';
import useUser from '@/store/user.store';
import {
  ChatInputInnerWrapperUI,
  ChatInputMainWrapperUI,
  ChatInputUI,
} from '../../ui/chat/input';

const ChatInput: FC = () => {
  const isLoading = useChats((state) => state.isLoading || state.isSending);
  const user = useUser((state) => state.user);
  const msgId = useMessages((state) => state.selectedMsg);
  const messages = useMessages((state) => state.messages);
  const io = useSocket((state) => state.io);
  const [msg, setMsg] = useState('');

  const isSendDisabled = useMemo(() => {
    return !msg || isLoading;
  }, [isLoading, msg]);

  const handleMsgSubmit = async () => {
    if (!msg.trim() || !msgId) return;
    setMsg('');
    const chat = await sendChat(msgId, msg);
    if (!user) {
      return;
    }
    const uid = messages
      ?.find((m) => m._id === msgId)
      ?.users.find((u) => u._id !== user._id);
    if (!uid) {
      return;
    }
    io?.emit('chat', uid._id, chat);
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value);
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key.toString().toLowerCase() === 'enter') {
      if (e.metaKey || e.ctrlKey) {
        setMsg('');
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
        {isLoading ? (
          <LoaderPinwheel className='animate-spin animation-duration-[750ms]' />
        ) : (
          <Send />
        )}
      </Button>
    </ChatInputMainWrapperUI>
  );
};

export default ChatInput;
