import type { FC } from 'react';
import useUser from '@/store/user.store';
import SideBarUI from '../ui/sidebar';

const SideBar: FC = () => {
  const user = useUser((state) => state.user);
  if (!user) {
    return null;
  }

  const { avatarUrl, uname } = user;
  return (
    <SideBarUI
      avatarUrl={avatarUrl}
      name={uname}
    />
  );
};

export default SideBar;
