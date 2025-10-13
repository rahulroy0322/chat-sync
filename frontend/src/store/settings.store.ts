import { create } from 'zustand';

type UseSettingsType = {
  isContactOpen: boolean;
};

const useSettings = create<UseSettingsType>(() => ({
  isContactOpen: false,
}));

const { setState: set } = useSettings;

const setContactOpen = (isContactOpen: boolean) =>
  set({
    isContactOpen,
  });

export { setContactOpen };

export default useSettings;
