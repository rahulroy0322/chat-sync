import { create } from 'zustand';

type UseMessagesType = {
  selectedMsg: string | null;
  isSettingOpen: boolean;
};

const useMessages = create<UseMessagesType>(() => ({
  isSettingOpen: false,
  selectedMsg: null,
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

export { setMsgId, openSetting, closeSetting, toggleSetting };

export default useMessages;
