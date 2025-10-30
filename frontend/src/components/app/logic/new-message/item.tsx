import { type FC, type ReactNode, useCallback } from 'react';
import type { UserType } from '@/@types/user.types';
import Avatar from '@/components/app/ui/avatar';
import { Button } from '@/components/ui/button';
import { db } from '@/db/main';
import { cn } from '@/lib/utils';
import { setMsgId } from '@/store/messages.store';
import { setContactOpen } from '@/store/settings.store';
import useAddUserContext from './context';

type UserLinkPropsType = {
  user: UserType;
  children: ReactNode;
};

const UserLink: FC<UserLinkPropsType> = ({ user, children }) => {
  const { loading, setLoading } = useAddUserContext();

  const handleClick = useCallback(async () => {
    setLoading(true);
    try {
      let msg = await db.messages
        .where({
          _id: user._id,
        })
        .first();

      if (msg?._id) {
        setMsgId(msg);
        return;
      }
      // ? TODO
      msg = {
        _id: user._id,
        lastMsgId: null,
      };
      await db.messages.add(msg);
      await db.contacts.add(user);
      setContactOpen(false);
      setMsgId(msg);
    } catch (e) {
      console.error('ERROR create new message: ', e);
    } finally {
      setLoading(false);
    }
  }, [setLoading, user]);

  return (
    <Button
      className={cn('hover:no-underline cursor-pointer')}
      disabled={loading}
      onClick={handleClick}
      variant='link'
    >
      {children}
    </Button>
  );
};

type UserItemPropsType = UserType;

const UserItem: FC<UserItemPropsType> = (user) => (
  <li className='flex gap-2 items-center p-1 w-full'>
    <UserLink user={user}>
      <Avatar
        alt={user.uname}
        className='size-10'
        isOnline
        //! TODO
        url={user.avatarUrl}
      />
      <div
        className='grow pointer-events-none cursor-pointer'
        role='presentation'
      >
        <h2 className='text-base font-semibold w-fit'>{user.uname}</h2>
      </div>
    </UserLink>
  </li>
);

export default UserItem;
