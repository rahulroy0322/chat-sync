import { create } from 'zustand';
import type { MessageType } from '@/@types/message.types';

type UseMessagesType = {
  selectedMsg: string | null;
  isSettingOpen: boolean;
  messages: Record<MessageType['_id'], MessageType> | null;
  // isFetching: boolean;
};

const useMessages = create<UseMessagesType>(() => ({
  isSettingOpen: false,
  selectedMsg: null,
  messages: null,
  // isFetching: false,
}));

const { getState: get, setState: set } = useMessages;

const setMsgId = (msgId: UseMessagesType['selectedMsg']) =>
  set({
    selectedMsg: msgId,
  });

const openSetting = () =>
  set({
    isSettingOpen: true,
  });

const closeSetting = () =>
  set({
    isSettingOpen: false,
  });

const toggleSetting = () =>
  set({
    isSettingOpen: !get().isSettingOpen,
  });

const setMessages = (messages: UseMessagesType['messages']) =>
  set({
    messages,
  });

export { setMsgId, setMessages, openSetting, closeSetting, toggleSetting };

export default useMessages;
