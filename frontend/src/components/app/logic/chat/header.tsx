import { type FC, useMemo } from 'react';
import useContacts from '@/store/contact.store';
import useMessages, { openSetting } from '@/store/messages.store';
import useUser from '@/store/user.store';
import ChatHeaderUI from '../../ui/chat/header';

// TODO!
const date = '2022-10-04T13:45:41.869Z';

const useContact = () => {
  const user = useUser((state) => state.user);
  const messages = useMessages((state) => state.messages);
  const selectedMsg = useMessages((state) => state.selectedMsg);

  const contactId = useMemo(() => {
    if (!user || !messages || !selectedMsg) {
      return null;
    }

    const otherUserId = messages[selectedMsg].users.find((u) => u !== user._id);

    if (!otherUserId) {
      return null;
    }

    return otherUserId;
  }, [messages, selectedMsg, user]);

  const contact = useContacts((state) =>
    state.contacts && contactId ? state.contacts[contactId] : null
  );
  return contact;
};

const ChatHeader: FC = () => {
  const contact = useContact();
  // const onlineUsers = useSocket((state) => state.onlineUsers);

  const isOnline = true;
  // ! TODO
  // const isOnline = useMemo(() => {
  //   return onlineUsers.has(contact?._id ?? '');
  // }, [contact?._id, onlineUsers.has]);

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
      isOnline={isOnline}
      lastSeen={date}
      onClick={handleHeaderClick}
      uname={uname}
    />
  );
};

export default ChatHeader;
