import type { ComponentProps, FC } from 'react';
import {
  Avatar as A,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type AvatarPropsType = {
  url: string;
  alt: string;
  isOnline?: boolean;
} & ComponentProps<typeof A>;

const Avatar: FC<AvatarPropsType> = ({
  url,
  alt,
  isOnline = false,
  className,
  ...props
}) => (
  <A
    role='button'
    {...props}
    className={cn(
      'border border-transparent',
      { 'border-teal-500': isOnline },
      className
    )}
  >
    <AvatarImage src={url} />
    <AvatarFallback>{(alt || '').charAt(0)}</AvatarFallback>
  </A>
);

export default Avatar;
