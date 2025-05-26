
import React from 'react';
import { RealtimeMessaging } from './RealtimeMessaging';

interface MessagingSystemProps {
  currentUserId: string;
  currentUserName: string;
  currentUserRole: string;
}

export const MessagingSystem = ({ currentUserId, currentUserName, currentUserRole }: MessagingSystemProps) => {
  return (
    <RealtimeMessaging 
      currentUserId={currentUserId}
      currentUserName={currentUserName}
      currentUserRole={currentUserRole}
    />
  );
};
