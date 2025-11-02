import type { FC, ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

type FormFigurePropsType = {
  children: ReactNode;
};

const FormFigure: FC<FormFigurePropsType> = ({ children }) => {
  const isMobile = useIsMobile();
  return isMobile ? null : (
    <figure className='basis-1/3 h-full shrink-0 overflow-hidden flex items-center justify-center'>
      {children}
    </figure>
  );
};

export { FormFigure };
