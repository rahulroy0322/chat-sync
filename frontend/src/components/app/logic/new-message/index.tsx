import type { FC } from 'react';
import Loading from '../../ui/loading';
import useAddUserContext, { AddUserContextProvider } from './context';
import UserItem from './item';

const AddUsersListImpl: FC = () => {
  const { users, loading } = useAddUserContext();
  if (loading) {
    return <Loading size='base' />;
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
