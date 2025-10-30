import {
  createContext,
  type FC,
  type ReactNode,
  use,
  useEffect,
  useState,
} from 'react';
import type { UserType } from '@/@types/user.types';
import { getAllUser } from '@/api';

type AddUserContextType = {
  loading: boolean;
  setLoading: (value: boolean) => void;
  users: UserType[];
};

const AddUserContext = createContext<AddUserContextType | null>(null);

const useAddUserContext = () => {
  const context = use(AddUserContext);
  if (!context) {
    throw new Error(
      '"useAddUserContext" should only be used inside "AddUserContextProvider"'
    );
  }
  return context;
};

type AddUserContextProviderPropsType = {
  children: ReactNode;
};

const AddUserContextProvider: FC<AddUserContextProviderPropsType> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    const fetchAllUser = async () => {
      setLoading(true);

      try {
        setUsers(await getAllUser());
      } catch (e) {
        console.error('ERROR fetching users', e);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUser();
  }, []);
  return (
    <AddUserContext
      value={{
        loading,
        setLoading,
        users,
      }}
    >
      {children}
    </AddUserContext>
  );
};

export { AddUserContextProvider };

export default useAddUserContext;
