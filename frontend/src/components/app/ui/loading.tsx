import { cva, type VariantProps } from 'class-variance-authority';
import type { FC } from 'react';
import { cn } from '@/lib/utils';

type LoadingPropsType = VariantProps<typeof loadingVariants> & {
  className?: string;
  wraperClassName?: string;
};

const loadingVariants = cva(
  'block rounded-[99999px] border-5 border-primary border-b-transparent animate-spin',
  {
    variants: {
      size: {
        base: 'size-30',
        standred: 'size-50',
      },
    },
    defaultVariants: {
      size: 'standred',
    },
  }
);

const Loading: FC<LoadingPropsType> = ({
  size,
  className,
  wraperClassName,
}) => (
  <div
    className={cn(
      'h-full w-full bg-background/70 flex items-center justify-center',
      wraperClassName
    )}
    role='presentation'
  >
    <span
      className={cn(
        loadingVariants({
          size,
          className,
        })
      )}
      role='progressbar'
    />
  </div>
);

export default Loading;
