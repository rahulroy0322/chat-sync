import type { FC } from 'react';
import useAddUserContext, { AddUserContextProvider } from './context';
import UserItem from './item';

const AddUsersListImpl: FC = () => {
  const { users, loading } = useAddUserContext();
  if (loading) {
    return 'loading...';
  }
  return (
    <ul>
      {users.map((user) => (
        <UserItem
          {...user}
          key={user._id}
        />
      ))}
    </ul>
  );
};

const AddUsersList: FC = () => (
  <AddUserContextProvider>
    <AddUsersListImpl />
  </AddUserContextProvider>
);

export default AddUsersList;
