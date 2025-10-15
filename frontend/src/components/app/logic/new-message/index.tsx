import { type FC, useEffect, useState } from 'react';
import type { UserType } from '@/@types/user.types';
import { req } from '@/api/main';
import { AddUserContextProvider } from './context';
import UserItem from './item';

const AddUsersList: FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const getUsers = async () => {
      setIsLoading(true);
      try {
        const { users } = await req<{ users: UserType[] }>(
          'user',
          undefined,
          controller.signal
        );

        setUsers(users);
      } catch (e) {
        console.error('ERROR:', e);
      } finally {
        setIsLoading(false);
      }
    };

    getUsers();

    return () => {
      controller.abort();
    };
  }, []);

  // ! TODO
  if (isLoading) {
    return 'fetching';
  }

  return (
    <AddUserContextProvider>
      <ul>
        {users.map((user) => (
          <UserItem
            {...user}
            key={user._id}
          />
        ))}
      </ul>
    </AddUserContextProvider>
  );
};

export default AddUsersList;
