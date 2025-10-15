import { type FC, useMemo } from "react";
import useMessages, { openSetting } from "@/store/messages.store";
import useUser from "@/store/user.store";
import ChatHeaderUI from "../../ui/chat/header";
import useSocket from "@/store/io.store";

// TODO!
const date = "2022-10-04T13:45:41.869Z";

const useContact = () => {
  const user = useUser((state) => state.user);
  const messages = useMessages((state) => state.messages);
  const selectedMsg = useMessages((state) => state.selectedMsg);

  const contact = useMemo(() => {
    if (!user || !messages || !selectedMsg) {
      return null;
    }

    const msg = messages.find((msg) => msg._id === selectedMsg);
    if (!msg) {
      return null;
    }

    const otherUser = msg.users.find((u) => u._id !== user._id);
    if (!otherUser) {
      return null;
    }

    return otherUser;
  }, [messages, selectedMsg, user]);

  return contact;
};

const ChatHeader: FC = () => {
  const contact = useContact();
  const onlineUsers = useSocket((state) => state.onlineUsers);

  const isOnline = useMemo(() => {
    return onlineUsers.has(contact?._id ?? "");
  }, [contact?._id, onlineUsers.has]);

  const handleHeaderClick = () => {
    openSetting();
  };

  if (!contact) {
    return null;
  }

  const { avatarUrl, uname } = contact;
  return (
    <ChatHeaderUI
      avatarUrl={avatarUrl}
      lastSeen={date}
      onClick={handleHeaderClick}
      uname={uname}
      isOnline={isOnline}
    />
  );
};

export default ChatHeader;
