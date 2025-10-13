import { create } from 'zustand';
import type { MessageType } from '@/@types/message.types';

type UseMessagesType = {
  selectedMsg: string | null;
  isSettingOpen: boolean;
  messages: MessageType[] | null;
  isFetching: boolean;
};

const useMessages = create<UseMessagesType>(() => ({
  isSettingOpen: false,
  selectedMsg: null,
  messages: null,
  isFetching: false,
}));

const { getState: get, setState: set } = useMessages;

const setFetching = (isFetching: boolean) =>
  set({
    isFetching,
  });

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
  setFetching,
  setMessages,
  openSetting,
  closeSetting,
  toggleSetting,
  addMessage,
};

export default useMessages;
