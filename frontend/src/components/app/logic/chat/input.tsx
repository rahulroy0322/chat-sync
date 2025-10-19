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
import { sendChat } from '@/api/chat';
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

const ChatInput: FC = () => {
  const sending = useChats((state) => state.sending);
  const user = useUser((state) => state.user);
  const _message = useMessages((state) =>
    state.messages && state.selectedMsg
      ? state.messages[state.selectedMsg]
      : null
  );
  // const io = useSocket((state) => state.io);
  const [msg, setMsg] = useState('');

  const isSendDisabled = useMemo(() => {
    return !msg || sending;
  }, [msg, sending]);

  const handleMsgSubmit = async () => {
    if (!msg.trim() || !_message) return;
    setMsg('');
    const _chat = await sendChat(_message, msg);
    if (!user) {
      return;
    }
    const uid = _message.users.find((u) => u !== user._id);
    if (!uid) {
      return;
    }
    // io?.emit("chat", uid._id, chat);
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
        {sending ? (
          <LoaderPinwheel className='animate-spin animation-duration-[750ms]' />
        ) : (
          <Send />
        )}
      </Button>
    </ChatInputMainWrapperUI>
  );
};

export default ChatInput;
