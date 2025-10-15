import { Check, CheckCheck, CircleAlert, Clock } from 'lucide-react';
import type { FC } from 'react';
import type { ChatStatusType } from '@/@types/status.types';
import { cn } from '@/lib/utils';

type StatusIconPropsType = {
  className: string;
  status: ChatStatusType;
};

const StatusIcon: FC<StatusIconPropsType> = ({ status, ...props }) => {
  if (status === 'read' || status === 'reached') {
    return (
      <CheckCheck
        {...props}
        className={cn('text-cyan-500', props.className)}
      />
    );
  }
  if (status === 'sent') {
    return <Check {...props} />;
  }
  if (status === 'failed') {
    return (
      <CircleAlert
        {...props}
        className={cn('text-destructive', props.className)}
      />
    );
  }
  return <Clock {...props} />;
};

export default StatusIcon;
