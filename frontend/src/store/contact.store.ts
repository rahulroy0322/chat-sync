import { create } from 'zustand';
import type { UserType } from '@/@types/user.types';

type UseContactsType = {
  contacts: Record<string, UserType>;
};

const useContacts = create<UseContactsType>(() => ({
  contacts: {},
}));

const { setState: set } = useContacts;

const setContacts = (contacts: UseContactsType['contacts']) =>
  set({
    contacts,
  });

export { setContacts };

export default useContacts;
