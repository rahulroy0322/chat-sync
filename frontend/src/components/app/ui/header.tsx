import type { FC, ReactNode } from 'react';

type HeaderUIPropsType = Readonly<{
  children: ReactNode;
}>;

const HeaderUI: FC<HeaderUIPropsType> = ({ children }) => {
  return (
    <header className='h-14 flex flex-col shrink-0 items-center justify-center shadow-md'>
      {children}
    </header>
  );
};

export default HeaderUI;
