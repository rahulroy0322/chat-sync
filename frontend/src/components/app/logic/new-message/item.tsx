import { type FC, type ReactNode, useCallback } from 'react';
import type { MessageType } from '@/@types/message.types';
import type { UserType } from '@/@types/user.types';
import { req } from '@/api/main';
import Avatar from '@/components/app/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { setMsgId } from '@/store/messages.store';
import { setContactOpen } from '@/store/settings.store';
import useAddUserContext from './context';

type UserLinkPropsType = {
  id: string;
  children: ReactNode;
};

const UserLink: FC<UserLinkPropsType> = ({ id, children }) => {
  const { loading, setLoading } = useAddUserContext();

  const handleClick = useCallback(async () => {
    try {
      setLoading(true);
      const { message } = await req<{
        message: MessageType;
      }>('/msg', {
        method: 'POST',
        body: {
          uid: id,
        },
      });

      // ! todo

      // addMessage(message);
      setContactOpen(false);
      setMsgId(message._id);
    } catch (e) {
      console.error('ERROR:', e);
    } finally {
      setLoading(false);
    }
  }, [id, setLoading]);

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

const UserItem: FC<UserItemPropsType> = ({ _id, avatarUrl, uname }) => (
  <li className='flex gap-2 items-center p-1 w-full'>
    <UserLink id={_id}>
      <Avatar
        alt={uname}
        className='size-10'
        isOnline
        //! TODO
        url={avatarUrl}
      />
      <div
        className='grow pointer-events-none cursor-pointer'
        role='presentation'
      >
        <h2 className='text-base font-semibold w-fit'>{uname}</h2>
      </div>
    </UserLink>
  </li>
);

export default UserItem;
