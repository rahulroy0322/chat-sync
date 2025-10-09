import { Check, CheckCheck, Clock } from 'lucide-react';
import type { FC } from 'react';
import type { ChatStatusType } from '@/@types/status.types';

type StatusIconPropsType = {
  className: string;
  status: ChatStatusType;
};

const StatusIcon: FC<StatusIconPropsType> = ({ status, ...props }) => {
  if (status === 'read' || status === 'riched') {
    return <CheckCheck {...props} />;
  }
  if (status === 'send') {
    return <Check {...props} />;
  }
  return <Clock {...props} />;
};

export default StatusIcon;
