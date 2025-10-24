import useContacts from '@/store/contact.store';
import useMessages, { openSetting } from '@/store/messages.store';
import useUser from '@/store/user.store';
import { type FC, useMemo } from 'react';
import ChatHeaderUI from '../../ui/chat/header';

const date = '2022-10-04T13:45:41.869Z';

const useContact = () => {
  const user = useUser((state) => state.user);
  const message = useMessages((state) => state.selectedMsg);
  const contacts = useContacts((state) => state.contacts);

  const contact = useMemo(() => {
    if (!user || !message) {
      return null;
    }

    return contacts[message._id];
  }, [user, message, contacts]);

  return contact;
};

const ChatHeader: FC = () => {
  const contact = useContact();

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
      uname={uname}
      onClick={handleHeaderClick}
    />
  );
};

export default ChatHeader;
