import { create } from 'zustand';
import type { MessageType } from '@/@types/message.types';

type UseMessagesType = {
  selectedMsg: MessageType | null;
  isSettingOpen: boolean;
  messages: MessageType[] | null;
};

const useMessages = create<UseMessagesType>(() => ({
  isSettingOpen: false,
  selectedMsg: null,
  messages: null,
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

const setMessages = (messages: MessageType[]) =>
  set({
    messages,
  });

const addMessage = (message: MessageType) =>
  set(({ messages }) => ({
    messages: [...(messages || []), message],
  }));

export {
  setMsgId,
  setMessages,
  openSetting,
  closeSetting,
  toggleSetting,
  addMessage,
};

export default useMessages;
