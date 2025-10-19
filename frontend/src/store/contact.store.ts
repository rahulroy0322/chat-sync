import { create } from 'zustand';
import type { UserType } from '@/@types/user.types';

type UseContactsType = {
  contacts: Record<UserType['_id'], UserType> | null;
};

const useContacts = create<UseContactsType>(() => ({
  contacts: null,
}));

const { setState: set } = useContacts;

const setContacts = (contacts: UseContactsType['contacts']) =>
  set({
    contacts,
  });

export { setContacts };

export default useContacts;
