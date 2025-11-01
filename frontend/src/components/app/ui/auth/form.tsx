import type { ComponentProps, FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type FormPropsType = ComponentProps<'form'> & {
  children: ReactNode;
};

const Form: FC<FormPropsType> = ({ children, className, ...props }) => {
  return (
    <div className='w-[90%] flex items-center justify-center p-4 border-2 h-fit rounded-sm bg-primary/20'>
      <form
        {...props}
        className={cn('w-full flex items-center', className)}
      >
        {children}
      </form>
    </div>
  );
};

export { Form };
