import type { FC, ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

type MessagesLayoutImplPropsType = Readonly<{
  children: ReactNode;
  side: ReactNode;
  isRoot?: boolean;
}>;

type MessagesLayoutLogicPropsType = Omit<
  MessagesLayoutImplPropsType,
  'isRoot'
> & {
  selected: string | null;
};

const MessagesLayoutImpl: FC<MessagesLayoutImplPropsType> = ({
  children,
  side,
  isRoot = false,
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return isRoot ? side : children;
  }
  return (
    <>
      {side}
      {children}
    </>
  );
};

const MessagesLayoutLogic: FC<MessagesLayoutLogicPropsType> = ({
  children,
  side,
  selected,
}) => (
  <MessagesLayoutImpl
    isRoot={!selected}
    side={side}
  >
    {children}
  </MessagesLayoutImpl>
);

export default MessagesLayoutLogic;
