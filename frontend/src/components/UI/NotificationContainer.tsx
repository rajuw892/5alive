// frontend/src/components/UI/NotificationContainer.tsx
import React from 'react';
import { motion } from 'framer-motion';
import Notification, { NotificationData } from './Notification';

interface NotificationContainerProps {
  notifications: NotificationData[];
  onClose: (id: string) => void;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onClose,
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-md">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
