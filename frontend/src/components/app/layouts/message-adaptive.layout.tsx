import type { FC, ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

type MessagesLayoutImplPropsType = Readonly<{
  children: ReactNode;
  side: ReactNode;
  isRoot?: boolean;
}>;

const MessagesLayoutImpl: FC<MessagesLayoutImplPropsType> = ({
  children,
  side,
  isRoot = false,
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    if (isRoot) {
      return side;
    }
    return children;
  }
  return (
    <>
      {side}
      {children}
    </>
  );
};

type MessagesLayoutLogicPropsType = Omit<
  MessagesLayoutImplPropsType,
  'isRoot'
> & {
  selected: null | string;
};

const MessagesLayoutLogic: FC<MessagesLayoutLogicPropsType> = ({
  children,
  side,
  selected,
}) => {
  if (!selected) {
    return (
      <MessagesLayoutImpl
        isRoot
        side={side}
      >
        {children}
      </MessagesLayoutImpl>
    );
  }

  return <MessagesLayoutImpl side={side}>{children}</MessagesLayoutImpl>;
};

export default MessagesLayoutLogic;
