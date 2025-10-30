// frontend/src/components/UI/Notification.tsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';

export interface NotificationData {
  id: string;
  type: 'player-left' | 'player-disconnected' | 'info' | 'success' | 'error';
  message: string;
  severity?: 'info' | 'warning' | 'error' | 'success';
  duration?: number;
}

interface NotificationProps {
  notification: NotificationData;
  onClose: (id: string) => void;
}

const Notification: React.FC<NotificationProps> = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const duration = notification.duration || 5000;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(notification.id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [notification.id, duration, onClose]);

  const getSeverityStyles = () => {
    switch (notification.severity) {
      case 'error':
        return {
          bg: 'bg-red-500/90',
          border: 'border-red-400',
          icon: <AlertCircle className="w-5 h-5" />,
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500/90',
          border: 'border-yellow-400',
          icon: <AlertTriangle className="w-5 h-5" />,
        };
      case 'success':
        return {
          bg: 'bg-green-500/90',
          border: 'border-green-400',
          icon: <CheckCircle className="w-5 h-5" />,
        };
      default:
        return {
          bg: 'bg-blue-500/90',
          border: 'border-blue-400',
          icon: <Info className="w-5 h-5" />,
        };
    }
  };

  const styles = getSeverityStyles();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`${styles.bg} ${styles.border} backdrop-blur-xl border-2 rounded-2xl p-4 shadow-2xl min-w-[300px] max-w-md`}
        >
          <div className="flex items-start gap-3">
            <div className="text-white mt-0.5">{styles.icon}</div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm md:text-base">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => onClose(notification.id), 300);
              }}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
